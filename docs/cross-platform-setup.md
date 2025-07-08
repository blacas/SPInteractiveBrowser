# 🌐 Cross-Platform WireGuard Setup

This guide covers WireGuard VPN setup for all major operating systems that the Secure Remote Browser supports.

## 🎯 Platform Support Matrix

| Platform | Auto-Connect | Manual Setup | Status |
|----------|-------------|--------------|--------|
| 🪟 **Windows** | ❌ | ✅ Required | Full Support |
| 🍎 **macOS** | ✅ | ⚠️ Optional | Full Support |
| 🐧 **Linux** | ✅ | ⚠️ Optional | Full Support |

## 🪟 Windows Setup

### Prerequisites
- Windows 10/11
- Administrator privileges (for WireGuard installation)

### Installation Steps
1. **Download WireGuard**: https://www.wireguard.com/install/
2. **Install WireGuard GUI**: Run installer as Administrator
3. **Import Configuration**:
   - Open WireGuard GUI application
   - Click "Add Tunnel" → "Add from file"
   - Select your `config/wireguard-australia.conf` file
   - Click "Activate" to connect
4. **Verify Connection**: Check tunnel shows as "Active"

### Windows-Specific Notes
- ⚠️ **Manual Connection Required**: App cannot auto-connect for security
- ✅ **Auto-Detection**: App detects when WireGuard is connected via GUI
- 🔒 **Admin Rights**: WireGuard requires administrator privileges

---

## 🍎 macOS Setup

### Installation Steps

#### Option A: Using Homebrew (Recommended)
```bash
# Install WireGuard tools
brew install wireguard-tools

# Connect using config file
sudo wg-quick up ./config/wireguard-australia.conf
```

#### Option B: Using WireGuard App
1. Install from Mac App Store: "WireGuard"
2. Import your configuration file
3. Activate the tunnel

### macOS-Specific Notes
- ✅ **Auto-Connect**: Application can establish connections automatically
- 🔍 **Detection Methods**: Uses both `wg show` and network interface detection
- 🛡️ **Security**: Requires sudo for `wg-quick` commands

---

## 🐧 Linux Setup

### Installation Steps

#### Ubuntu/Debian:
```bash
sudo apt update && sudo apt install wireguard
sudo wg-quick up ./config/wireguard-australia.conf
```

#### RHEL/CentOS/Fedora:
```bash
sudo dnf install wireguard-tools
sudo wg-quick up ./config/wireguard-australia.conf
```

#### Arch Linux:
```bash
sudo pacman -S wireguard-tools
sudo wg-quick up ./config/wireguard-australia.conf
```

### Linux-Specific Notes
- ✅ **Auto-Connect**: Full automatic connection support
- 🔧 **Multiple Options**: Command line, NetworkManager GUI, or systemd
- 🐧 **Distribution Support**: Works on all major Linux distributions

---

## 🚀 Application Integration

The Secure Remote Browser automatically:
1. **Detects your operating system**
2. **Uses appropriate connection methods**
3. **Provides platform-specific instructions**
4. **Monitors connection status**

### Platform-Specific Behavior

| Platform | Auto-Connect | Detection Method | Manual Steps |
|----------|-------------|------------------|--------------|
| 🪟 Windows | ❌ | Network interfaces | GUI required |
| 🍎 macOS | ✅ | `wg show` + interfaces | Optional |
| 🐧 Linux | ✅ | `wg show` command | Optional |

---

## 🔧 Troubleshooting

### Common Commands

| Action | Windows | macOS/Linux |
|--------|---------|-------------|
| **Check Status** | GUI or `wg show` | `sudo wg show` |
| **Connect** | GUI: Activate | `sudo wg-quick up config` |
| **Disconnect** | GUI: Deactivate | `sudo wg-quick down config` |

### Platform-Specific Issues

#### 🪟 Windows
- **Issue**: "WireGuard not detected"
- **Solution**: Ensure GUI is running and tunnel is active

#### 🍎 macOS
- **Issue**: `wg-quick` not found
- **Solution**: `brew install wireguard-tools`

#### 🐧 Linux
- **Issue**: Permission denied
- **Solution**: Use `sudo` for WireGuard commands

---

## ✅ Success Checklist

- [ ] WireGuard is installed on your platform
- [ ] Configuration file is loaded/imported
- [ ] Tunnel is active and connected
- [ ] IP shows Australian location (test: ipinfo.io)
- [ ] Secure Remote Browser detects connection
- [ ] Application starts without VPN errors

---

## 🎉 Summary

Your Secure Remote Browser now supports **universal cross-platform deployment**:

- **🪟 Windows**: GUI-based connection with auto-detection
- **🍎 macOS**: Auto-connect with homebrew or App Store
- **🐧 Linux**: Full CLI/GUI support across distributions
- **🔧 Smart Detection**: Platform-aware connection handling
- **📋 User-Friendly**: Contextual instructions per platform

Deploy confidently on any major operating system! 🚀