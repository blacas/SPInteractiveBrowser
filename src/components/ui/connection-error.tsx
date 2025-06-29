import React from 'react';
import { Shield, Wifi, AlertTriangle, Settings, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';

interface ConnectionErrorProps {
  type: 'vpn-failed' | 'environment-invalid' | 'config-missing' | 'vault-failed';
  error?: string;
  details?: string[];
  onRetry?: () => void;
  onOpenSettings?: () => void;
}

export const ConnectionError: React.FC<ConnectionErrorProps> = ({
  type,
  error,
  details = [],
  onRetry,
  onOpenSettings
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case 'vpn-failed':
        return {
          icon: <Wifi className="w-16 h-16 text-red-400" />,
          title: 'VPN Connection Failed',
          subtitle: 'Unable to establish secure connection to Australian servers',
          description: 'This application requires a VPN connection to Australia for security compliance. The VPN connection could not be established.',
          suggestions: [
            'Check your internet connection',
            'Verify your WireGuard configuration file exists',
            'Ensure your Australian VPS server is running',
            'Check your WIREGUARD_ENDPOINT in .env file',
            'Try connecting to your VPN manually first'
          ],
          actionText: 'Retry VPN Connection',
          secondaryText: 'Check VPN Settings'
        };
      
      case 'environment-invalid':
        return {
          icon: <Settings className="w-16 h-16 text-orange-400" />,
          title: 'Configuration Required',
          subtitle: 'Environment configuration needs to be completed',
          description: 'Your .env file contains placeholder values that need to be replaced with actual configuration.',
          suggestions: [
            'Replace "your-server-ip:51820" with your actual server IP',
            'Update HashiCorp Vault URLs with real endpoints',
            'Set actual SharePoint tenant URL',
            'Configure real vault credentials',
            'See setup documentation for detailed instructions'
          ],
          actionText: 'Open Setup Guide',
          secondaryText: 'Retry After Configuration'
        };
      
      case 'config-missing':
        return {
          icon: <AlertTriangle className="w-16 h-16 text-yellow-400" />,
          title: 'Configuration Files Missing',
          subtitle: 'Required configuration files are not found',
          description: 'The application is missing required configuration files needed for secure operation.',
          suggestions: [
            'Ensure config/wireguard-australia.conf exists',
            'Verify .env file is in the project root',
            'Check file permissions and accessibility',
            'Follow the setup guide to create missing files'
          ],
          actionText: 'View Setup Instructions',
          secondaryText: 'Retry'
        };
      
      case 'vault-failed':
        return {
          icon: <Shield className="w-16 h-16 text-purple-400" />,
          title: 'Secure Vault Unavailable',
          subtitle: 'Cannot access credential storage system',
          description: 'The secure vault containing SharePoint credentials is not accessible. You can continue with limited functionality.',
          suggestions: [
            'Check your vault service is running',
            'Verify vault credentials in .env file',
            'Ensure network connectivity to vault server',
            'Check vault authentication permissions'
          ],
          actionText: 'Continue Without Vault',
          secondaryText: 'Retry Vault Connection'
        };
      
      default:
        return {
          icon: <AlertTriangle className="w-16 h-16 text-red-400" />,
          title: 'Connection Error',
          subtitle: 'Unable to establish secure connection',
          description: 'An unexpected error occurred while setting up the secure browser environment.',
          suggestions: ['Check your internet connection', 'Restart the application'],
          actionText: 'Retry',
          secondaryText: 'Contact Support'
        };
    }
  };

  const config = getErrorConfig();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-slate-800 border-slate-700">
        <div className="p-8 text-center space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            {config.icon}
          </div>

          {/* Error Title */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {config.title}
            </h1>
            <p className="text-xl text-slate-300 mb-4">
              {config.subtitle}
            </p>
            <p className="text-slate-400 leading-relaxed">
              {config.description}
            </p>
          </div>

          {/* Error Details */}
          {error && (
            <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 text-left">
              <h3 className="text-sm font-semibold text-red-200 mb-2">Technical Details:</h3>
              <code className="text-xs text-red-300 break-all block bg-red-900/30 p-2 rounded">
                {error}
              </code>
            </div>
          )}

          {/* Additional Details */}
          {details.length > 0 && (
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-left">
              <h3 className="text-sm font-semibold text-slate-200 mb-2">Additional Information:</h3>
              <ul className="text-sm text-slate-300 space-y-1">
                {details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-slate-400 mr-2">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Troubleshooting Steps */}
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 text-left">
            <h3 className="text-sm font-semibold text-blue-200 mb-3 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Troubleshooting Steps:
            </h3>
            <ol className="text-sm text-blue-100 space-y-2">
              {config.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-400 mr-2 font-mono text-xs bg-blue-900/30 px-1 rounded">
                    {index + 1}
                  </span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center flex-wrap">
            {onRetry && (
              <Button
                onClick={onRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {config.actionText}
              </Button>
            )}
            
            {onOpenSettings && (
              <Button
                onClick={onOpenSettings}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 px-6 py-2"
              >
                <Settings className="w-4 h-4 mr-2" />
                {config.secondaryText}
              </Button>
            )}

            {type === 'environment-invalid' && (
              <Button
                onClick={() => window.open('https://github.com/your-repo/docs/setup.md', '_blank')}
                variant="outline"
                className="border-green-600 text-green-300 hover:bg-green-900/20 px-6 py-2"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Setup Guide
              </Button>
            )}
          </div>

          {/* Status Bar */}
          <div className="border-t border-slate-600 pt-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-4">
                <span>🔒 Enterprise Security v2.1.0</span>
                <span>•</span>
                <span>Australia Compliance Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Disconnected</span>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-xs text-slate-500 space-y-1">
            <p>
              For technical support, contact your system administrator or refer to the setup documentation.
            </p>
            <p>
              Error Code: {type.toUpperCase()}-{Date.now().toString().slice(-6)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConnectionError; 