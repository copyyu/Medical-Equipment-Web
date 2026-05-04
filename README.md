# Medical Equipment Web

> ระบบจัดการเครื่องมือแพทย์สำหรับผู้ดูแลระบบ (Admin Dashboard) — Frontend พัฒนาด้วย React + TypeScript + Vite ออกแบบให้ทำงานร่วมกับ Backend API ของ [Medical-Equipment-LineChatBot](https://github.com/copyyu/Medical-Equipment-LineChatBot)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)

---

## สารบัญ

- [ภาพรวมโครงการ](#ภาพรวมโครงการ)
- [ฟีเจอร์หลัก](#ฟีเจอร์หลัก)
- [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [การติดตั้งและรัน](#การติดตั้งและรัน)
- [ตัวแปรสิ่งแวดล้อม](#ตัวแปรสิ่งแวดล้อม)
- [หน้าจอและ Routes](#หน้าจอและ-routes)
- [สถาปัตยกรรม Frontend](#สถาปัตยกรรม-frontend)
- [การ Deploy ด้วย Docker](#การ-deploy-ด้วย-docker)

---

## ภาพรวมโครงการ

**Medical Equipment Web** คือ Admin Dashboard สำหรับระบบจัดการเครื่องมือแพทย์ในโรงพยาบาล เป็น Single Page Application (SPA) ที่ให้ผู้ดูแลระบบสามารถ:

- ดูสรุปภาพรวมเครื่องมือ สถานะ และ Ticket แจ้งซ่อมผ่าน Dashboard
- จัดการข้อมูลเครื่องมือแพทย์ (เพิ่ม, แก้ไข, ลบ, ค้นหา, กรอง)
- นำเข้าข้อมูลเครื่องมือจากไฟล์ Excel
- จัดการ Ticket แจ้งซ่อมพร้อมติดตามสถานะ
- ดูประวัติกิจกรรมทั้งหมด (Activity Log)
- รับการอัปเดตข้อมูลแบบ Real-time ผ่าน Server-Sent Events (SSE)

ระบบนี้ทำงานร่วมกับ Backend API: [Medical-Equipment-LineChatBot](https://github.com/copyyu/Medical-Equipment-LineChatBot) (Go Fiber)

---

## ฟีเจอร์หลัก

### Dashboard

| ฟีเจอร์ | รายละเอียด |
|---------|-----------|
| สรุปสถานะเครื่องมือ | แสดงจำนวนเครื่องมือแยกตามสถานะ (ใช้งานอยู่, ชำรุด, รอปลดระวาง ฯลฯ) |
| เครื่องมือใกล้หมดอายุ | แสดงรายการเครื่องมือที่ใกล้ถึงกำหนดเปลี่ยน |
| สถานะงานซ่อม | สรุปจำนวน Ticket แยกตามสถานะ (กำลังดำเนินการ, ส่งคืนแล้ว, ส่งซ่อมภายนอก) |
| Auto-refresh | ข้อมูล Dashboard อัปเดตอัตโนมัติทุก 30 วินาที |

### จัดการเครื่องมือ (Equipment)

| ฟีเจอร์ | รายละเอียด |
|---------|-----------|
| รายการเครื่องมือ | แสดงตาราง พร้อม Pagination และการกรอง |
| เพิ่มเครื่องมือ | ฟอร์มเพิ่มเครื่องมือใหม่ |
| แก้ไข/ลบ | แก้ไขข้อมูลผ่าน Modal, ลบพร้อม Confirm Dialog |
| นำเข้า Excel | อัปโหลดไฟล์ .xlsx เพื่อ Import ข้อมูลจำนวนมาก |
| ค้นหาและกรอง | ค้นหาตามชื่อ/รหัส, กรองตามสถานะ, แผนก และอื่น ๆ |
| ดูรายละเอียด | Modal แสดงข้อมูลเครื่องมือครบถ้วน |

### Ticket แจ้งซ่อม

| ฟีเจอร์ | รายละเอียด |
|---------|-----------|
| รายการ Ticket | ตาราง Ticket พร้อมสถานะ, ระดับความเร่งด่วน |
| ดูรายละเอียด | Modal แสดงข้อมูล Ticket ครบถ้วน |
| อัปเดตสถานะ | แก้ไขสถานะ Ticket ผ่าน Modal |

### Activity Log

| ฟีเจอร์ | รายละเอียด |
|---------|-----------|
| ประวัติกิจกรรม | แสดงรายการกิจกรรมทั้งหมดในระบบ |

### Real-time (SSE)

| ฟีเจอร์ | รายละเอียด |
|---------|-----------|
| Event Stream | เชื่อมต่อ Backend ผ่าน Server-Sent Events |
| Auto-reconnect | เชื่อมต่อใหม่อัตโนมัติเมื่อ Connection หลุด |
| Data Sync | Refetch ข้อมูลอัตโนมัติหลัง Reconnect เพื่อป้องกัน Data Loss |

### Authentication

| ฟีเจอร์ | รายละเอียด |
|---------|-----------|
| Login | เข้าสู่ระบบด้วย Username/Password |
| Session | จัดการ Token ผ่าน LocalStorage |
| Protected Routes | เข้าถึงหน้าต่าง ๆ ได้เฉพาะเมื่อล็อกอินแล้ว |
| Auto-redirect | Redirect ไปหน้า Login เมื่อ Token หมดอายุ (401) |

---

## เทคโนโลยีที่ใช้

| เทคโนโลยี | รายละเอียด |
|-----------|-----------|
| React 19 | UI Library |
| TypeScript 5.9 | Type-safe JavaScript |
| Vite 7 | Build Tool และ Dev Server |
| Tailwind CSS 4 | Utility-first CSS Framework |
| React Router DOM 7 | Client-side Routing (SPA) |
| Zustand 5 | State Management (Lightweight) |
| Lucide React | Icon Library |
| SweetAlert2 | Confirm Dialog และ Alert |
| React Hot Toast | Toast Notifications |
| SheetJS (xlsx) | อ่าน/เขียนไฟล์ Excel |
| Nginx | Production Web Server (SPA Routing) |
| Docker | Containerization |

---

## โครงสร้างโปรเจกต์

```
Medical-Equipment-Web/
├── src/
│   ├── App.tsx                        # Root Component (Auth Check)
│   ├── main.tsx                       # Entry Point (React DOM)
│   ├── index.css                      # Global Styles (Tailwind)
│   ├── router/
│   │   └── router.tsx                 # Route Definitions และ Protected Routes
│   ├── layouts/
│   │   ├── MainLayout.tsx             # Layout หลัก (Navbar + Sidebar + Content)
│   │   └── AuthLayout.tsx             # Layout สำหรับหน้า Login
│   ├── pages/
│   │   ├── HomePage/                  # Dashboard (สรุปภาพรวม)
│   │   ├── Equipment/
│   │   │   ├── EquipmentListPage.tsx  # รายการเครื่องมือ
│   │   │   └── AddEquipmentPage.tsx   # เพิ่มเครื่องมือ / Import Excel
│   │   ├── Ticket/
│   │   │   └── TicketPage.tsx         # รายการ Ticket แจ้งซ่อม
│   │   ├── ActivityLog/
│   │   │   └── ActivityLogPage.tsx    # ประวัติกิจกรรม
│   │   └── LoginPage/
│   │       └── LoginPage.tsx          # หน้า Login
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx             # Navigation Bar
│   │   │   └── Sidebar.tsx            # Sidebar Menu
│   │   ├── dashboard/
│   │   │   ├── AssetStatusSection.tsx # สรุปสถานะเครื่องมือ
│   │   │   ├── ExpiredEquipmentSection.tsx  # เครื่องมือใกล้หมดอายุ
│   │   │   └── JobStatusSection.tsx   # สรุปสถานะงานซ่อม
│   │   ├── Table/
│   │   │   ├── EquipmentTable.tsx     # ตารางเครื่องมือ
│   │   │   └── TicketTable.tsx        # ตาราง Ticket
│   │   ├── Modal/
│   │   │   ├── ViewEquipmentModal.tsx # ดูรายละเอียดเครื่องมือ
│   │   │   ├── EditEquipmentModal.tsx # แก้ไขเครื่องมือ
│   │   │   ├── DeleteConfirmModal.tsx # ยืนยันการลบ
│   │   │   ├── ViewRequestModal.tsx   # ดูรายละเอียด Ticket
│   │   │   └── EditRequestModal.tsx   # แก้ไข Ticket
│   │   ├── filter/
│   │   │   └── FilterBar.tsx          # แถบกรองข้อมูล
│   │   ├── Pagination/                # Pagination Component
│   │   ├── Status/                    # Status Badge / Stat Cards
│   │   └── form/                      # Form Components
│   ├── service/
│   │   ├── api.ts                     # API Client (Fetch Wrapper + Auth)
│   │   ├── authService.ts             # Authentication Service
│   │   ├── dashboardService.ts        # Dashboard API
│   │   ├── equipmentService.ts        # Equipment CRUD API
│   │   ├── ticketService.ts           # Ticket API
│   │   └── activityLogService.ts      # Activity Log API
│   ├── stores/
│   │   ├── authStore.ts               # Auth State (Zustand)
│   │   └── activityLogStore.ts        # Activity Log State (Zustand)
│   ├── hooks/
│   │   ├── useDashboard.ts            # Dashboard Data Hook
│   │   ├── useEquipmentList.ts        # Equipment List Hook
│   │   └── useEventStream.ts          # SSE Real-time Hook
│   ├── types/
│   │   ├── equipment.ts               # Equipment Types
│   │   ├── ticket.ts                  # Ticket Types
│   │   ├── dashboard.ts               # Dashboard Types
│   │   ├── auth.ts                    # Auth Types
│   │   ├── activityLog.ts             # Activity Log Types
│   │   ├── status.ts                  # Status Enums
│   │   └── index.ts                   # Type Re-exports
│   ├── constants/
│   │   ├── config.ts                  # App Config (Pagination, Intervals)
│   │   └── equipmentOptions.ts        # Equipment Dropdown Options
│   └── utils/
│       └── auth.ts                    # Token Utilities (LocalStorage)
├── public/                            # Static Assets
├── Dockerfile                         # Multi-stage Build (Node + Nginx)
├── nginx.conf                         # Nginx Config (SPA Routing + Gzip)
├── .env.example                       # ตัวอย่างตัวแปรสิ่งแวดล้อม
├── index.html                         # HTML Template
├── vite.config.ts                     # Vite Configuration
├── tsconfig.json                      # TypeScript Configuration
├── eslint.config.js                   # ESLint Configuration
└── package.json                       # Dependencies และ Scripts
```

---

## การติดตั้งและรัน

### ข้อกำหนดเบื้องต้น

- [Node.js 20+](https://nodejs.org/)
- [Backend API](https://github.com/copyyu/Medical-Equipment-LineChatBot) ต้องรันอยู่ก่อน

### รันแบบ Development

```bash
# 1. Clone โปรเจกต์
git clone https://github.com/copyyu/Medical-Equipment-Web.git
cd Medical-Equipment-Web

# 2. ติดตั้ง Dependencies
npm install

# 3. สร้างไฟล์ .env
cp .env.example .env
# แก้ไข VITE_API_URL ให้ชี้ไปที่ Backend API

# 4. รัน Development Server
npm run dev
```

Dev server จะรันที่ `http://localhost:5173`

### Build สำหรับ Production

```bash
npm run build
```

ไฟล์ที่ Build จะอยู่ในโฟลเดอร์ `dist/`

### Scripts ที่ใช้ได้

| Script | คำสั่ง | รายละเอียด |
|--------|--------|-----------|
| dev | `npm run dev` | รัน Development Server (Vite) |
| build | `npm run build` | Build สำหรับ Production |
| preview | `npm run preview` | Preview Production Build |
| lint | `npm run lint` | ตรวจสอบ Code ด้วย ESLint |

---

## ตัวแปรสิ่งแวดล้อม

สร้างไฟล์ `.env` จาก `.env.example`:

| ตัวแปร | ค่าตัวอย่าง | คำอธิบาย |
|--------|------------|---------|
| `VITE_API_URL` | `http://localhost:8081` | URL ของ Backend API |

> หมายเหตุ: ตัวแปรที่ขึ้นต้นด้วย `VITE_` จะถูก Inject เข้า Client-side Code โดย Vite ห้ามใส่ข้อมูลลับ (Secret) ในตัวแปรเหล่านี้

---

## หน้าจอและ Routes

| Path | หน้าจอ | สิทธิ์ | รายละเอียด |
|------|--------|--------|-----------|
| `/` | Login | Public | หน้าเข้าสู่ระบบ |
| `/home` | Dashboard | Protected | สรุปภาพรวมเครื่องมือและ Ticket |
| `/equipment` | Equipment List | Protected | รายการเครื่องมือแพทย์ |
| `/add-equipment` | Add Equipment | Protected | เพิ่มเครื่องมือ / Import Excel |
| `/ticket` | Ticket | Protected | รายการ Ticket แจ้งซ่อม |
| `/activity-log` | Activity Log | Protected | ประวัติกิจกรรมทั้งหมด |

---

## สถาปัตยกรรม Frontend

### ภาพรวม

```
User Interface (Pages)
        |
   Components (Reusable UI)
        |
   Custom Hooks (Business Logic)
        |
   Services (API Communication)
        |
   Backend API (Go Fiber)
```

### State Management

- **Zustand** สำหรับ Global State (Auth, Activity Log)
- **React State** (useState/useEffect) สำหรับ Local State ในแต่ละ Component
- **Custom Hooks** สำหรับ Encapsulate Business Logic (useDashboard, useEquipmentList, useEventStream)

### API Communication

- ใช้ **Fetch API** ผ่าน ApiClient class ที่รวมศูนย์การจัดการ Request/Response
- รองรับ **Bearer Token Authentication** อัตโนมัติ
- จัดการ **401 Unauthorized** แบบ Global (Auto-redirect ไปหน้า Login)
- รองรับ **File Upload** ผ่าน FormData (Import Excel)

### Real-time Events

- ใช้ **Server-Sent Events (SSE)** ผ่าน Custom Hook `useEventStream`
- รองรับ Event Types: `equipment.created`, `equipment.updated`, `equipment.deleted`, `ticket.created`, `ticket.updated`
- Auto-reconnect เมื่อ Connection หลุด
- Refetch ข้อมูลอัตโนมัติหลัง Reconnect เพื่อป้องกัน Data Loss จาก Redis Pub/Sub

---

## การ Deploy ด้วย Docker

### Build Docker Image

```bash
docker build -t medical-equipment-web .
```

### Run Container

```bash
docker run -d -p 8080:8080 medical-equipment-web
```

### รายละเอียด Docker

- **Build Stage**: Node.js 20 Alpine สำหรับ Build React App
- **Runtime Stage**: Nginx Unprivileged (Non-root) สำหรับ Serve Static Files
- **Port**: 8080 (Non-root container)
- **SPA Routing**: Nginx config รองรับ React Router (`try_files $uri /index.html`)
- **Optimization**: Gzip compression และ Static asset caching (6 เดือน)

---

## License

This project is for educational and internal use.
