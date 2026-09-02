# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Client Layer                          │
├─────────────────────────────────────────────────────────┤
│  Web App (Next.js)  │  Mobile App (React Native)        │
└──────────┬──────────────────────────────┬────────────────┘
           │                              │
           └──────────────┬───────────────┘
                          │
        ┌─────────────────▼────────────────┐
        │   API Gateway / Load Balancer    │
        └─────────────────┬────────────────┘
                          │
    ┌─────────────────────▼──────────────────────┐
    │         Backend Services (NestJS)          │
    ├──────────────────────────────────────────┤
    │ Auth   │ Users  │ Bookings │ Payments    │
    │ Roles  │ Farms  │ Matching │ Ratings     │
    │ Notices│ Work   │ Disputes │ Notifications
    └─────────────────────┬──────────────────────┘
           ┌──────────────┼──────────────┐
           │              │              │
    ┌──────▼───┐    ┌─────▼─────┐    ┌─▼──────────┐
    │ PostgreSQL│    │   Redis   │    │ File Store │
    │  (Primary │    │  (Cache   │    │  (S3/GCS)  │
    │  Database)│    │ + Sessions)   │            │
    └───────────┘    └───────────┘    └────────────┘
           │
           │
    ┌──────▼────────────────┐
    │   External Services   │
    ├──────────────────────┤
    │ Payment Gateway      │
    │ SMS Provider         │
    │ Email Service        │
    │ Geolocation Service  │
    └──────────────────────┘
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript, TailwindCSS |
| **Backend** | NestJS, Node.js 18+, TypeScript |
| **Database** | PostgreSQL 14+ |
| **ORM** | Prisma |
| **Cache** | Redis |
| **Authentication** | JWT + OAuth 2.0 |
| **File Storage** | AWS S3 or Google Cloud Storage |
| **Payments** | Stripe / Razorpay |
| **SMS** | Twilio / AWS SNS |
| **Email** | SendGrid / AWS SES |
| **Real-time** | WebSockets, Socket.io |
| **Deployment** | Docker, Docker Compose, Kubernetes (future) |

## Microservices (Future)

As the platform scales, services can be separated:

- **Auth Service**: User authentication and authorization
- **User Service**: Profile management
- **Booking Service**: Work request and booking management
- **Payment Service**: Payment processing and reconciliation
- **Notification Service**: Notifications, SMS, email
- **Matching Service**: AI-powered matching algorithm
- **Rating Service**: Reviews and ratings
- **Dispute Service**: Conflict resolution
- **File Service**: Document and image management
- **Messaging Service**: Real-time messaging

## Security Architecture

- **API Security**: JWT tokens with refresh rotation
- **Data Encryption**: TLS for transit, encryption at rest
- **Authentication**: Multi-factor auth (OTP for high-risk operations)
- **Authorization**: Role-based access control (RBAC)
- **Payment Security**: PCI DSS compliance, tokenization
- **Input Validation**: Server-side validation for all inputs
- **CORS**: Configured for specified domains only
- **Rate Limiting**: API throttling per user/IP

---

## Deployment Architecture

```
┌──────────────────────────────────────┐
│   CI/CD Pipeline (GitHub Actions)    │
└──────────────┬───────────────────────┘
               │
    ┌──────────▼──────────┐
    │  Docker Registry    │
    │  (Container Images) │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────────────┐
    │  Container Orchestration    │
    │  (Docker Compose / K8s)     │
    └──────────┬──────────────────┘
               │
    ┌──────────▼──────────────────┐
    │  Cloud Provider             │
    │  (AWS/GCP/Azure)            │
    └─────────────────────────────┘
```
