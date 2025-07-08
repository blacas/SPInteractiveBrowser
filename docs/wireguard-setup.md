# 🔧 Complete Guide: WireGuard + Australian VPS Setup

This guide provides comprehensive instructions for setting up a WireGuard VPN server on an Australian VPS for the Secure Remote Browser application.

## Overview

This setup ensures all browser traffic is routed through Australian servers for compliance requirements. The solution provides:
- Full control over VPN infrastructure
- Australian IP address geolocation
- Cost-effective solution (~$5-6/month)
- Enterprise-grade security

---

## Step 1: Choose and Create Australian VPS

### Option A: DigitalOcean (Recommended for beginners)

#### 1.1 Create DigitalOcean Account:
1. Go to https://www.digitalocean.com/
2. Click "Sign Up"
3. Enter your email and create a password
4. Verify your email address
5. Add a payment method (credit card or PayPal)
6. You'll get $200 in credits for 60 days as a new user

#### 1.2 Create a Droplet (Server):
1. Click "Create" → "Droplets"
2. Choose an image: **Ubuntu 22.04 (LTS) x64**
3. Choose a plan:
   - Basic plan
   - Regular Intel with SSD
   - **$6/month (1GB RAM, 1vCPU, 25GB SSD)** - sufficient for VPN
4. Choose a datacenter region:
   - **Asia Pacific → Sydney 1** (closest to Australia)
5. Authentication:
   - Select "SSH keys" (recommended) or "Password"
   - If SSH keys: Upload your public key or create one
   - If Password: Choose a strong password (write it down!)
6. Finalize:
   - Hostname: `wireguard-australia-vpn`
   - Click "Create Droplet"

#### 1.3 Note Your Server Details:
- **Server IP**: Write down the IP address (e.g., 139.59.xxx.xxx) 134.199.169.102
- **Username**: root
- **Password/SSH Key**: What you set up above

### Option B: Vultr (Good alternative)

#### 1.1 Create Vultr Account:
1. Go to https://www.vultr.com/
2. Sign up with email
3. Add payment method
4. $100 credit for new users

#### 1.2 Deploy Server:
1. Click "Deploy New Server"
2. Server Type: **Cloud Compute - Regular Performance**
3. Server Location: **Sydney, Australia**
4. Server Image: **Ubuntu 22.04 LTS x64**
5. Server Size: **$6/month (1GB RAM, 1vCPU, 25GB SSD)**
6. Authentication: SSH Keys or Password
7. Server Hostname: `wireguard-australia`
8. Click "Deploy Now"

### Option C: Linode (Now Akamai)

#### 1.1 Create Linode Account:
1. Go to https://www.linode.com/
2. Create account
3. Add payment method
4. $100 credit for new users

#### 1.2 Create Linode:
1. Click "Create" → "Linode"
2. Choose a Distribution: **Ubuntu 22.04 LTS**
3. Region: **Sydney, AU**
4. Linode Plan: **Nanode 1GB ($5/month)**
5. Root Password: Set a strong password
6. SSH Keys: Upload if you have them
7. Click "Create Linode"

---

## Step 2: Initial Server Setup

### 2.1 Connect to Your Server:

**If you used SSH Keys:**
```bash
ssh root@YOUR_SERVER_IP
```

**If you used Password:**
```bash
ssh root@YOUR_SERVER_IP
# Enter password when prompted
```

**Example:**
```bash
ssh root@139.59.123.456
```

### 2.2 Update the Server:
```bash
apt update && apt upgrade -y
```

### 2.3 Verify Location (Optional but recommended):
```bash
curl ipinfo.io
```

You should see something like:
```json
{
  "ip": "139.59.123.456",
  "city": "Sydney",
  "region": "New South Wales",
  "country": "AU",
  "org": "AS14061 DigitalOcean, LLC"
}
```

---

## Step 3: Install WireGuard Server

### 3.1 Download and Run WireGuard Installation Script:
```bash
curl -O https://raw.githubusercontent.com/angristan/wireguard-install/master/wireguard-install.sh
chmod +x wireguard-install.sh
./wireguard-install.sh
```

### 3.2 Follow the Interactive Setup:

The script will ask you several questions. Here are the recommended answers:

```
IPv4 or IPv6 public address: 134.199.169.102 [Auto-detected]
Public interface: eth0 [Auto-detected]
WireGuard interface name: wg0
Server WireGuard IPv4: 10.66.66.1
Server WireGuard IPv6: fd42:42:42::1
Server WireGuard port [1-65535]: 59926 [ACTUAL PORT USED - Security Enhanced]
First DNS resolver to use for the clients: 1.1.1.1
Second DNS resolver to use for the clients: 1.0.0.1
Client name: secure-browser [Limited to 15 characters]
Client WireGuard IPv4: 10.66.66.2
Client WireGuard IPv6: fd42:42:42::2
```

**🔒 Security Note**: The script automatically suggested port **59926** instead of the standard 51820. This provides better security by:
- Avoiding automated attacks targeting port 51820
- Reducing exposure to port scanners
- Adding security through obscurity

### 3.3 Wait for Installation:

The script will:
- Install WireGuard
- Generate server keys  
- Create client configuration
- Configure firewall rules
- Start the WireGuard service

You'll see output like:
```
✓ WireGuard installation is now complete.
✓ Configuration file available at: /root/wg0-client-secure-browser-client.conf
✓ WireGuard is active and will start on boot.
```

---

## Step 4: Download Client Configuration

### 4.1 Display the Configuration:
```bash
cat /root/wg0-client-secure-browser.conf
```

You'll see something like:
```ini
[Interface]
PrivateKey = YOUR_PRIVATE_KEY
Address = 10.66.66.2/32,fd42:42:42::2/128
DNS = 1.1.1.1,1.0.0.1

[Peer]
PublicKey = SERVER_PUBLIC_KEY
PresharedKey = PRESHARED_KEY
Endpoint = YOUR_SERVER_IP:51820
AllowedIPs = 0.0.0.0/0,::/0
```

### 4.2 Copy Configuration to Your Local Machine:

#### Method A: Copy-Paste (Easiest)
1. Select and copy the entire output from the `cat` command above
2. On your local machine, the config directory already exists in your project
3. Create the WireGuard configuration file:

**On Windows:**
```powershell
# Navigate to your project directory
cd D:\UpworkProjects\Hourly\BC\secure-remote-browser
# Create the config file
notepad config\wireguard-australia.conf
```

**On Mac/Linux:**
```bash
# Navigate to your project directory
cd /path/to/secure-remote-browser
# Create the config file
nano config/wireguard-australia.conf
```

4. Replace the template content with the actual configuration from your server

#### Method B: Using SCP (Secure Copy)
```bash
scp root@YOUR_SERVER_IP:/root/wg0-client-secure-browser-client.conf ./config/wireguard-australia.conf
```

#### Method C: Using SFTP
```bash
sftp root@YOUR_SERVER_IP
get /root/wg0-client-secure-browser-client.conf ./config/wireguard-australia.conf
quit
```

---

## Step 5: Configure Your Application

### 5.1 Update Your .env File:

Update your existing `.env` file with the actual server IP:

```env
# Replace YOUR_SERVER_IP and YOUR_PORT with your actual server details
WIREGUARD_ENDPOINT=YOUR_SERVER_IP:YOUR_PORT

# Example (using your actual values):
# WIREGUARD_ENDPOINT=134.199.169.102:59926
```

**Important**: Replace `YOUR_SERVER_IP` with your actual server IP address from Step 1.

---

## Step 6: Test WireGuard Connection

### 6.1 Install WireGuard Client on Your Local Machine:

#### Windows:
1. Download from: https://www.wireguard.com/install/
2. Install WireGuard for Windows
3. Open WireGuard application
4. Click "Add Tunnel" → "Add empty tunnel"
5. Copy-paste your configuration from `config/wireguard-australia.conf`
6. Save as "Australia VPN"

#### Mac:
```bash
brew install wireguard-tools
```

#### Linux:
```bash
sudo apt install wireguard
```

### 6.2 Test the Connection:

#### Method A: Using WireGuard GUI (Windows/Mac)
1. Open WireGuard application
2. Select your "Australia VPN" tunnel
3. Click "Activate"
4. Check if it connects successfully

#### Method B: Using Command Line (Linux/Mac)
```bash
sudo wg-quick up ./config/wireguard-australia.conf
```

### 6.3 Verify Australian IP:
```bash
curl ipinfo.io
```

You should see:
```json
{
  "ip": "139.59.123.456",
  "city": "Sydney", 
  "region": "New South Wales",
  "country": "AU"
}
```

---

## Step 7: Server Security Hardening (Recommended)

### 7.1 Configure Firewall:
```bash
# Allow SSH
ufw allow 22/tcp

# Allow WireGuard (actual port used)
ufw allow 59926/udp

# Enable firewall
ufw --force enable

# Check status
ufw status
```

### 7.2 Disable Root Login (Optional but recommended):
```bash
# Create a new user
adduser admin
usermod -aG sudo admin

# Disable root SSH login
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart ssh
```

---

## Step 8: Application Integration

### 8.1 Update WireGuard Configuration:

After getting the real configuration from your server, update `config/wireguard-australia.conf` with the actual values:

```ini
[Interface]
PrivateKey = [Your actual private key from server]
Address = 10.66.66.2/32,fd42:42:42::2/128
DNS = 1.1.1.1,1.0.0.1

[Peer]
PublicKey = [Your actual server public key]
PresharedKey = [Your actual preshared key]
Endpoint = [YOUR_ACTUAL_SERVER_IP]:[YOUR_ACTUAL_PORT]
AllowedIPs = 0.0.0.0/0,::/0
```

### 8.2 Update .env File:

Replace `YOUR_SERVER_IP` and `YOUR_PORT` in your `.env` file with your actual server details:

```env
WIREGUARD_ENDPOINT=134.199.169.102:59926
```

---

## Step 9: Testing & Verification

### 9.1 Test VPN Integration:
```bash
npm run dev
```

### 9.2 Check VPN Status:

Your application should:
- Automatically connect to WireGuard
- Show Australian IP in the VPN status indicator  
- Block access if VPN fails to connect

### 9.3 Verify Security:

1. **IP Location**: Confirm browsing shows Australian IP
2. **Fail-Closed**: Disconnect VPN and verify browser blocks access
3. **DNS Leaks**: Use https://dnsleaktest.com/ to verify no DNS leaks

---

## Step 10: Maintenance & Monitoring

### 10.1 Server Monitoring:
```bash
# Check WireGuard status
systemctl status wg-quick@wg0

# Check connected clients
wg show

# View server resources
htop
```

### 10.2 Log Monitoring:
```bash
# WireGuard logs
journalctl -u wg-quick@wg0 -f

# System logs
tail -f /var/log/syslog
```

### 10.3 Monthly Maintenance:
- Check VPS billing and resource usage
- Update server packages: `apt update && apt upgrade`
- Monitor WireGuard connection logs
- Verify Australian IP geolocation still works

---

## 🎯 Quick Reference

### Your WireGuard Setup Summary:
- **Server Provider**: [DigitalOcean/Vultr/Linode]
- **Server Location**: Sydney, Australia
- **Server IP**: 134.199.169.102
- **WireGuard Port**: 59926 (randomly assigned for security)
- **Config File**: `./config/wireguard-australia.conf`
- **Monthly Cost**: ~$5-6 USD

### Key Files:
- **VPN Config**: `./config/wireguard-australia.conf`
- **Environment**: `.env` (WIREGUARD_ENDPOINT setting)
- **Application Logs**: `./logs/app.log`

### Connection Test Commands:
```bash
# Test VPN connection
ping 10.66.66.1

# Check public IP
curl ipinfo.io

# Test DNS resolution
nslookup google.com
```

---

## 🚨 Troubleshooting

### Common Issues:

#### Connection Fails:
- Check server firewall (port 59926 open)
- Verify server IP and port in configuration
- Check WireGuard service status on server

#### No Internet Through VPN:
- Verify `AllowedIPs = 0.0.0.0/0, ::/0` in config
- Check DNS settings
- Verify server routing configuration

#### Not Showing Australian IP:
- Confirm server is actually in Australia: `curl ipinfo.io`
- Check for IP/DNS leaks
- Verify VPN is actually routing traffic

### Need Help?
- Check WireGuard logs: `journalctl -u wg-quick@wg0`
- Verify server connectivity: `ping [your-server-ip]`
- Test port accessibility: `telnet 134.199.169.102 59926`

---

## 🎉 Completion

Your WireGuard + Australian VPS setup is now complete! This gives you:

✅ **Full control** over your VPN infrastructure  
✅ **Australian IP geolocation** for compliance  
✅ **Cost-effective solution** (~$5-6/month)  
✅ **Enterprise-grade security** with fail-closed protection  
✅ **Professional error handling** that guides users through any issues  
✅ **Custom security port** (59926) for enhanced protection  

Your WireGuard VPN is now configured with:
- **Server**: 134.199.169.102:59926 (Sydney, Australia)
- **Client Name**: secure-browser
- **Private Key**: cGrJCcqEhu+SBrKnwSFB9ZPobfpKCvFzIfTlLqvu8HI=
- **DNS Servers**: 1.1.1.1, 1.0.0.1

The total cost is around $5-6/month, making it very cost-effective compared to commercial VPN services while providing complete control over your infrastructure. 