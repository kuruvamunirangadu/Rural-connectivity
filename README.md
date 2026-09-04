# RuralConnect

A comprehensive platform connecting rural agricultural stakeholders for seamless resource sharing, service delivery, and economic growth.

---

## 📲 Mobile App (Direct Android APK Download)

Get the standalone native Android application for direct installation on mobile devices:

[![Download Android APK](https://img.shields.io/badge/Download-RuralConnect%20APK%20(v1.0.0)-00C853?style=for-the-badge&logo=android&logoColor=white)](https://github.com/kuruvamunirangadu/Rural-connectivity/releases)

- **Direct Download Link**: [Download RuralConnect.apk (GitHub Releases)](https://github.com/kuruvamunirangadu/Rural-connectivity/releases)
- **Local File Path**: [`./RuralConnect.apk`](./RuralConnect.apk) or [`./apps/web/public/RuralConnect.apk`](./apps/web/public/RuralConnect.apk)
- **File Size**: ~4.72 MB
- **Supported Android OS**: Android 7.0 (API 24) to Android 15+ (API 36)

### 📲 How to Install on Mobile:
1. Download **`RuralConnect.apk`** on your Android device (via browser, WhatsApp, Telegram, or Google Drive).
2. Tap the downloaded `.apk` file.
3. If prompted with *"Install unknown apps"*, tap **Allow from this source**.
4. Tap **Install** and launch **RuralConnect**!

---

## 🌾 Overview

RuralConnect bridges the gap between farmers, contractors, equipment owners, workers, suppliers, and service providers in rural areas. The platform enables efficient resource allocation, skill matching, and service delivery through a multi-role marketplace.

## 🚀 Key Features

- **Strict Role-Segregated Dashboards**: Pure isolated cockpit views for Farmers, Tractor Owners, Contractors, Skilled Workers, Agri-Input Suppliers, and Equipment Owners.
- **Deterministic 2-Stage Matching Engine**: Geospatial radius filtering, HP implement matching, and trust score ranking.
- **Dynamic Pricing & Smart Escrow Vault**: Acreage, implement tariff, and mobilization calculations.
- **IoT & Live Telemetry**: Tractor RPM, fuel flow, GPS speed, and field mission lifecycles.
- **Multilingual Comms & IVR**: Real-time in-app chat with contact masking and synthesized voice support.
- **Native Android Support**: Full Capacitor native integration with bundled offline assets.

## 🏗️ Project Structure

- **`apps/web`** - Next.js 14 web application & Capacitor Android native project
- **`apps/api`** - NestJS backend API (31 domain modules)
- **`apps/mobile`** - Mobile workspace & native assets
- **`packages/matching-engine`** - Pure deterministic 2-stage matching and pricing calculation engine
- **`packages/database`** - Prisma database schemas (25+ entities)
- **`packages/shared-types`** - Shared TypeScript contracts and validation
- **`docs/`** - Product vision, architecture, and ADRs
- **`tests/`** - Unit, integration, and 13-milestone test suite

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS, Lucide Icons, Capacitor 7 (Android)
- **Backend**: NestJS 10, Node.js 20, TypeScript
- **Database**: PostgreSQL 15 (Prisma ORM)
- **Cache**: Redis 7
- **Containers**: Docker & Docker Compose

---

## 💻 Getting Started

### Prerequisites

- Node.js 20+ & `pnpm`
- PostgreSQL 15+ & Redis 7 (or Docker)
- Java JDK 17+ & Android SDK (for mobile APK builds)

### 🐳 Running with Docker (Recommended)

Start the full stack (Postgres, Redis, API, and Web) with a single command:

```bash
docker compose up -d
```

- **Frontend Cockpit**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

### 💻 Running Locally without Docker

```bash
# 1. Install dependencies
pnpm install

# 2. Run both Frontend & Backend
pnpm run dev

# 3. Or run services individually
pnpm --filter @ruralconnect/web dev    # Port 3000
pnpm --filter @ruralconnect/api dev    # Port 3001
```

---

## 📱 Building the Android APK from Source

To compile a fresh `.apk` file from the latest codebase:

```bash
# 1. Build web production bundle
pnpm --filter @ruralconnect/web build

# 2. Sync to native Android workspace
cd apps/web && pnpm exec cap sync android

# 3. Compile APK using Gradle
cd android
$env:JAVA_HOME="C:\Program Files\Java\jdk-19"
& "C:\Program Files\Java\jdk-19\bin\java.exe" -jar "gradle\wrapper\gradle-wrapper.jar" assembleDebug
```
The compiled APK will be output at `apps/web/android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 🧪 Verification & Tests

Run the full 13-milestone domain and algorithmic test suite:

```bash
python scripts/verify_modules.py
```

---

## 📄 License

MIT License. See [LICENSE](./LICENSE) for details.
