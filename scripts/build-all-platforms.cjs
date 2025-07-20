#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

/**
 * Execute a command and return a promise
 */
function execCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`🔨 Running: ${command} ${args.join(' ')}`);
    
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Build for a specific platform
 */
async function buildPlatform(platform, arch = null) {
  try {
    const args = ['run'];
    
    switch (platform) {
      case 'win32':
        args.push('make:win');
        break;
      case 'darwin':
        if (arch === 'intel') {
          args.push('make:mac:intel');
        } else if (arch === 'silicon') {
          args.push('make:mac:silicon');
        } else {
          args.push('make:mac');
        }
        break;
      case 'linux':
        args.push('make:linux');
        break;
      default:
        throw new Error(`Unknown platform: ${platform}`);
    }

    await execCommand('npm', args);
    console.log(`✅ Successfully built for ${platform}${arch ? ` (${arch})` : ''}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to build for ${platform}${arch ? ` (${arch})` : ''}: ${error.message}`);
    return false;
  }
}

/**
 * Publish for a specific platform
 */
async function publishPlatform(platform, arch = null) {
  try {
    const args = ['run'];
    
    switch (platform) {
      case 'win32':
        args.push('publish:win');
        break;
      case 'darwin':
        if (arch === 'intel') {
          args.push('publish:mac:intel');
        } else if (arch === 'silicon') {
          args.push('publish:mac:silicon');
        } else {
          args.push('publish:mac');
        }
        break;
      case 'linux':
        args.push('publish:linux');
        break;
      default:
        throw new Error(`Unknown platform: ${platform}`);
    }

    await execCommand('npm', args);
    console.log(`✅ Successfully published for ${platform}${arch ? ` (${arch})` : ''}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to publish for ${platform}${arch ? ` (${arch})` : ''}: ${error.message}`);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'make';
  const platformArg = args[1];

  console.log('🚀 Multi-Platform Build Script');
  console.log(`📍 Current OS: ${os.platform()} (${os.arch()})`);
  console.log(`🎯 Command: ${command}`);

  const platforms = platformArg ? [platformArg] : ['win32', 'darwin', 'linux'];
  const isPublish = command === 'publish';
  
  let successCount = 0;
  let totalCount = 0;

  console.log(`\n📦 ${isPublish ? 'Publishing' : 'Building'} for platforms: ${platforms.join(', ')}\n`);

  for (const platform of platforms) {
    totalCount++;
    
    try {
      const success = isPublish 
        ? await publishPlatform(platform)
        : await buildPlatform(platform);
        
      if (success) {
        successCount++;
      }
    } catch (error) {
      console.error(`💥 Unexpected error with ${platform}: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }

  console.log('📊 Summary:');
  console.log(`✅ Successful: ${successCount}/${totalCount}`);
  console.log(`❌ Failed: ${totalCount - successCount}/${totalCount}`);

  if (successCount === totalCount) {
    console.log('\n🎉 All platforms completed successfully!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some platforms failed. Check the output above for details.');
    console.log('\n💡 Tips:');
    console.log('   • macOS builds typically require running on macOS');
    console.log('   • Windows builds work best on Windows (but may work on other platforms)');
    console.log('   • Linux builds generally work on most Unix-like systems');
    console.log('   • Try building individual platforms: npm run make:win, npm run make:mac, npm run make:linux');
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('\n🛑 Build interrupted by user');
  process.exit(1);
});

// Run the script
main().catch((error) => {
  console.error('💥 Script failed:', error.message);
  process.exit(1);
}); 