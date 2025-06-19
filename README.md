# 🔒 Secure Remote Browser Platform

A secure, role-based desktop application that provides controlled access to SharePoint documents through a sandboxed browser environment with automatic VPN protection.

<div align="center">

![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

## 🎯 Overview

This application provides enterprise-grade secure access to SharePoint-hosted documents for employees, contractors, and third parties. All browsing activity is automatically routed through an Australian VPN tunnel, with role-based access controls and secure credential management.

### ✨ Key Features

- 🔐 **Role-Based Access Control** - Three-tier permission system
- 🌍 **Automatic VPN Protection** - All traffic routed through Australian servers
- 🔑 **Secure Credential Injection** - Vault-managed SharePoint authentication
- 📄 **Sandboxed PDF Viewing** - Documents rendered securely within the browser
- 🛡️ **Context Isolation** - Full Electron security hardening
- 👥 **Multi-User Support** - Individual authentication with personalized access

## 🧩 Access Levels

| Level | Description | Browser Access |
|-------|-------------|----------------|
| **Level 1** | SharePoint Only | 🔒 Restricted to SharePoint domains only |
| **Level 2** | Controlled Browsing | 🔒 SharePoint + whitelisted external domains |
| **Level 3** | Full Access | 🌐 Unrestricted browsing (VPN-secured) |

> All levels maintain SharePoint access with secure PDF viewing capabilities

## 🛠️ Tech Stack

### Desktop Application
- **Frontend**: React 18 + TypeScript + Vite
- **Desktop Framework**: Electron with context isolation
- **Styling**: Tailwind CSS + ShadCN UI components
- **Security**: VPN integration + Vault credential management
- **PDF Rendering**: PDF.js for secure document viewing

### Admin Panel (Separate Project)
- **Framework**: Next.js 14 (App Router)
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **UI**: ShadCN UI + Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd secure-remote-browser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Configure your VPN and Vault settings
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run electron:build
   ```

## 📁 Project Structure

```
secure-remote-browser/
├── electron/              # Electron main process
│   ├── main.ts            # Main process entry
│   └── preload.ts         # Preload scripts
├── src/                   # React application
│   ├── components/        # UI components
│   ├── pages/            # Application pages
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Utility functions
├── public/               # Static assets
└── docs/                 # Documentation
    └── masterplan.md     # Detailed project specification
```

## 🔒 Security Features

- **Sandboxed Environment**: Full context isolation prevents unauthorized access
- **VPN-First Architecture**: All network traffic automatically secured
- **Credential Vault Integration**: SharePoint credentials never stored locally
- **Role-Based Restrictions**: URL filtering based on user access level
- **Production Hardening**: DevTools disabled, native integrations controlled

## 🧑‍💻 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run electron:dev` - Start Electron in development
- `npm run electron:build` - Build Electron application
- `npm run preview` - Preview production build

### Development Guidelines

1. Follow TypeScript strict mode
2. Use ShadCN UI components for consistency
3. Implement proper error boundaries
4. Test security features thoroughly
5. Document API integrations

## 🎨 UI Components

This project uses [ShadCN UI](https://ui.shadcn.com/) for consistent, accessible components:

```bash
# Add new components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [x] MVP Electron browser with SharePoint access
- [x] Basic role-based access control
- [ ] VPN integration and auto-connect
- [ ] Admin Panel development (separate project)
- [ ] Enhanced security hardening
- [ ] Audit logging and monitoring
- [ ] Mobile companion app

## ⚖️ License

This project is proprietary software. All rights reserved.

## 📞 Support

For questions or support, please contact the development team or create an issue in the repository.

---

<div align="center">
Built with ❤️ for secure enterprise document access
</div>
