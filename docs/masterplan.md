# Masterplan.md – Secure Remote Browser Platform

---

## 📌 App Overview

This project is a **secure remote-browser desktop application** built with Electron and React. Its purpose is to allow users to access PDFs hosted on SharePoint — securely, consistently, and always inside a controlled browser environment. All users interact through a sandboxed browser interface, and additional browsing capabilities are enabled based on role.

Security is a top priority. The app routes all activity through an Australian VPN, uses vault-managed shared credentials for SharePoint login, and enforces browsing rules by user level.

> 🔧 In addition to the main app, a **dedicated Admin Panel** will be developed as a **separate web-based project**, built in **Next.js + Supabase**, to manage users, access levels, and system configuration.

---

## 🧑‍💻 Target Users

- **Employees and internal teams** who need access to SharePoint-hosted documents.
- **Remote contractors or third parties** who need secured, time-scoped access.
- **Enterprises and IT teams** requiring compliance with geo-restricted access and browsing control.

---

## 🧩 Core Features

### Electron Remote Browser App (Primary Application)
- 🔐 Per-user authentication with role-based access.
- 📄 SharePoint content accessed via browser at all access levels.
- 🌍 Australian VPN tunnel auto-connected for all activity.
- 🔑 Secure credential injection for SharePoint login (vault-managed).
- 🧭 Role-controlled browser access (SharePoint-only, Whitelisted, Full).
- 🧊 Fully sandboxed browser window (Electron with context isolation).
- 📂 PDF viewing embedded inside browser, never exposed to OS-level tools.

### 🛠️ Admin Panel (Separate Project)
> The **Admin Panel is a separate, standalone web application**, developed in **Next.js (App Router)** using **Supabase** as the backend.

- 👥 Used by system administrators to:
  - Create and manage user accounts
  - Assign roles and permissions
  - View system activity (future logging)
- ✅ Powered by Supabase Auth + PostgreSQL with Row-Level Security (RLS).
- 🎨 Styled with ShadCN UI + Tailwind CSS for consistency and modern UX.
- 🔧 Designed to be modular, scalable, and secure.

---

## 🧱 Access Levels

| Level | Browser Access Description                                 | SharePoint Access |
|-------|-------------------------------------------------------------|--------------------|
| 1     | **Browser locked to SharePoint-only domains**               | ✅ Inside browser  |
| 2     | **Browser allows SharePoint + whitelisted external domains**| ✅ Inside browser  |
| 3     | **Full unrestricted browser access** (still VPN-routed)     | ✅ Inside browser  |

> 💡 Regardless of access level, **SharePoint functionality is always rendered inside the browser interface**.

---

## 🔄 User Flow Summary

1. User launches the Electron app.
2. React login screen appears; user logs in with personal credentials.
3. VPN tunnel to Australian node is established.
4. Based on their role:
   - Level 1: Browser is restricted to SharePoint only.
   - Level 2: Browser allows SharePoint + specific domains.
   - Level 3: Browser is fully open, but securely tunneled.
5. Vault-based credentials are used to log into SharePoint automatically.
6. User browses, previews, or downloads PDFs inside the browser environment.

---

## 🔧 Tech Stack Overview

### Electron App
- **Electron** + **React** (via Vite or Electron-Vite)
- **Node.js** for background services (VPN, Vault, Auth)
- **Electron IPC + Context Isolation**
- **PDF.js** for rendering PDFs securely inside the browser
- **VPN Client** (WireGuard or OpenVPN integration)
- **Vault** (e.g., HashiCorp Vault or 1Password CLI)

### Admin Panel (Separate Web App)
- **Next.js (App Router)** + TypeScript
- **Supabase**: PostgreSQL, Auth, Realtime (optional)
- **Tailwind CSS** + **ShadCN UI** for styling
- **Row-Level Security (RLS)** for data protection

---

## 🧠 Conceptual Data Model

### Supabase (Admin Panel DB)

#### `users`
- `id` (UUID)
- `email`
- `full_name`
- `access_level` (enum: level_1, level_2, level_3)
- `created_at`

#### `audit_logs` *(optional future feature)*
- `user_id`
- `timestamp`
- `url_accessed`
- `ip_address`
- `action_type` (e.g., login, pdf_open)

---

## 🎨 UI Design Principles

### Electron App
- **Unified browser window** with:
  - Address bar (shown or hidden depending on role)
  - VPN status indicator
  - Embedded PDF viewing (PDF.js)
  - Controlled browsing panel with dynamic permissions
- **Minimalist UI** to avoid distraction and reinforce security

### Admin Panel
- **Dashboard** for high-level system overview
- **User Management Page** for inviting, editing, and assigning roles
- **Role-based visibility** using Supabase RLS
- Future-ready: audit logs, activity feed, config toggles

---

## 🔐 Security Considerations

- Credentials are injected securely from vault via backend services.
- Browser is sandboxed (Electron contextIsolation, preload, etc.)
- VPN connection is required before browser becomes usable.
- Admin Panel is protected with Supabase Auth + strict role checks.
- Electron app disables DevTools and native integrations in production.
- Navigation is controlled and validated client-side and server-side.
- Optional: file download controls or restrictions.

---

## 🚀 Development Phases

### Phase 1 – MVP
- Electron browser with locked SharePoint view
- Vault-based credential injection
- Supabase-backed Admin Panel (standalone)
  - User list and access level management

### Phase 2 – Expanded Roles
- Level 2 and Level 3 browser functionality
- Whitelist enforcement logic
- VPN integration and fallback UX

### Phase 3 – Security & Observability
- Full credential lifecycle management
- Audit trail logging (local or remote)
- Electron security hardening

### Phase 4 – Future Add-ons
- OCR or PDF search integration
- Realtime Supabase admin dashboard
- Invite workflows, role presets

---

## 🌱 Future Expansion

- Mobile companion app (SharePoint-only)
- Azure AD / Okta integration
- Region-switching VPN support
- System-wide analytics + heatmaps
- Secure bookmark system

---

## ✅ Final Summary

This system is composed of **two tightly connected, but independently deployed applications**:

1. **Electron Remote Browser App** – a secure, user-role-aware browser with VPN tunneling, credential injection, and SharePoint-focused PDF interaction.
2. **Admin Panel (Next.js)** – a fully separate, modern web app used by administrators to manage users, permissions, and eventually monitor activity.

Together, these components create a secure, performant, and future-proof solution for remote content access — with a foundation built for scalability and compliance.

