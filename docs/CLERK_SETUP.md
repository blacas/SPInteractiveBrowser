# 🔐 Clerk Authentication Setup for Secure Remote Browser

## Overview

The Secure Remote Browser now uses Clerk for modern, secure authentication with enterprise-grade features including SSO, MFA, and user management.

## 🚀 Quick Setup

### 1. Create Clerk Application

1. **Go to Clerk Dashboard**: https://dashboard.clerk.com/
2. **Sign up or Sign in** with your account
3. **Create a new application**:
   - Application name: "Secure Remote Browser"
   - Choose "React" as the framework
   - Click "Create application"

### 2. Get Your API Keys

1. **In the Clerk Dashboard**, go to "API Keys" in the sidebar
2. **Copy your keys**:
   - **Publishable Key**: Starts with `pk_test_` or `pk_live_`
   - **Secret Key**: Starts with `sk_test_` or `sk_live_`

### 3. Configure Environment Variables

Create a `.env` file in the `secure-remote-browser` directory:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Other configuration...
VPN_PROVIDER=wireguard
WIREGUARD_ENDPOINT=134.199.169.102:59926
# ... rest of your configuration
```

## 🎨 Features

### Modern Login Experience
- **Chrome-like interface** with modern design
- **Multiple sign-in options** (email, social providers)
- **Responsive design** that works on all screen sizes
- **Loading states** and smooth transitions

### Enterprise Features
- **Single Sign-On (SSO)** support
- **Multi-factor Authentication (MFA)**
- **Social login** (Google, Microsoft, GitHub, etc.)
- **Passwordless authentication**
- **Session management**
- **User profiles** and metadata

### Security
- **Secure token handling**
- **Automatic session refresh**
- **Secure logout** with cleanup
- **CSRF protection**
- **Rate limiting**

## 🔧 Configuration Options

### Access Levels
Users can be assigned access levels through Clerk's public metadata:

```json
{
  "publicMetadata": {
    "accessLevel": 1
  }
}
```

- **Level 1**: SharePoint-only access
- **Level 2**: SharePoint + Microsoft domains
- **Level 3**: Full internet access (VPN protected)

### User Management
- Manage users through Clerk Dashboard
- Set user roles and permissions
- Monitor user activity and sessions
- Configure organization settings

## 🎯 Social Providers Setup

### Google OAuth
1. **In Clerk Dashboard**, go to "Social Connections"
2. **Enable Google**
3. **Add your Google OAuth credentials**:
   - Client ID from Google Cloud Console
   - Client Secret from Google Cloud Console

### Microsoft OAuth (Recommended for SharePoint users)
1. **Enable Microsoft** in Clerk Dashboard
2. **Configure Azure AD**:
   - Application ID from Azure
   - Directory (tenant) ID
   - Client secret

## 🔄 Migration from Old Auth

If upgrading from the previous authentication system:

1. **Users will need to sign up** with Clerk using their existing email
2. **Access levels** can be set in Clerk Dashboard
3. **SharePoint integration** works automatically
4. **VPN and vault** connections remain the same

## 🚨 Troubleshooting

### Common Issues

#### "VITE_CLERK_PUBLISHABLE_KEY is required"
- Check that your `.env` file exists in the correct directory
- Verify the key starts with `pk_test_` or `pk_live_`
- Restart the application after adding environment variables

#### "Authentication service unavailable"
- Check internet connectivity
- Verify Clerk Dashboard shows your app as active
- Try refreshing the page

#### Users can't sign in
- Check if the email domain is allowed in Clerk settings
- Verify social provider configuration
- Check Clerk Dashboard for error logs

### Debug Mode
Enable debug logging by adding to your `.env`:
```env
LOG_LEVEL=debug
```

## 🎉 Testing

### Test Users
Create test users in Clerk Dashboard:
1. Go to "Users" in Clerk Dashboard
2. Click "Create user"
3. Set email and access level in metadata
4. Test different access levels

### Access Level Testing
1. **Level 1 User**: Should only access SharePoint domains
2. **Level 2 User**: SharePoint + Microsoft domains
3. **Level 3 User**: Full internet (with VPN)

## 📞 Support

For Clerk-specific issues:
- **Clerk Documentation**: https://clerk.dev/docs
- **Clerk Discord**: https://discord.gg/clerk
- **Support**: support@clerk.dev

For application issues:
- Check the application logs
- Verify VPN and vault configurations
- Test without Clerk using the fallback auth (if available)

## 🔗 Next Steps

1. **Set up Clerk application** with your keys
2. **Configure social providers** for easy login
3. **Set user access levels** in Clerk Dashboard
4. **Test the authentication flow**
5. **Configure MFA** for enhanced security

Your Secure Remote Browser now has enterprise-grade authentication with a modern, Chrome-like interface! 🚀 