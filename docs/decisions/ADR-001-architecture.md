# Architecture Decision Records (ADRs)

## ADR-001: Monorepo with Turbo

**Status**: Accepted

**Context**: 
- Multiple applications (web, API, mobile)
- Shared packages (types, validation, database schema)
- Need for code sharing and DRY principle

**Decision**:
Use a monorepo structure with Turbo for build orchestration and caching.

**Consequences**:
- ✅ Easy code sharing between apps
- ✅ Unified dependency management
- ✅ Faster builds with Turbo caching
- ❌ Larger repository size
- ❌ More complex CI/CD setup

---

## ADR-002: NestJS for Backend

**Status**: Accepted

**Context**:
- Need for scalable, maintainable backend
- Multiple modules with different responsibilities
- Team experience with Express/Node.js
- Future need for microservices

**Decision**:
Use NestJS framework with TypeScript for the backend API.

**Consequences**:
- ✅ Built-in modules system (aligns with microservices)
- ✅ Strong TypeScript support
- ✅ Decorator-based DI and routing
- ✅ Good testing support
- ❌ Learning curve for new team members
- ❌ Slightly heavier than Express

---

## ADR-003: Prisma ORM

**Status**: Accepted

**Context**:
- PostgreSQL as primary database
- Need for type-safe database queries
- Developer experience and migrations
- Support for schema versioning

**Decision**:
Use Prisma as the ORM and schema management tool.

**Consequences**:
- ✅ Type-safe queries
- ✅ Auto-generated migrations
- ✅ Prisma Studio for data exploration
- ✅ Excellent documentation
- ❌ Cannot use raw SQL queries easily (workaround available)
- ❌ Vendor lock-in (limited database support)

---

## ADR-004: Role-Based Access Control (RBAC)

**Status**: Accepted

**Context**:
- Multiple user roles (Farmer, Contractor, Tractor Owner, etc.)
- Different permissions per role
- Need for flexible permission management

**Decision**:
Implement RBAC using database-driven permission system with decorators in NestJS.

**Consequences**:
- ✅ Flexible permission management
- ✅ Scalable to new roles
- ✅ Auditable (can track permission changes)
- ❌ Additional database queries for permission checks
- ❌ Complexity in permission design

---

## ADR-005: JWT for Authentication

**Status**: Accepted

**Context**:
- Stateless API design
- Multiple client applications
- Need for refresh token mechanism
- Mobile app requires efficient authentication

**Decision**:
Use JWT tokens with short expiry (15 min) and refresh tokens (7 days).

**Consequences**:
- ✅ Stateless authentication
- ✅ Works across multiple clients
- ✅ Can be decoded on client for profile info
- ❌ Token revocation requires blacklist/DB check
- ❌ Can't easily update permissions in real-time

---

## ADR-006: PostgreSQL for Primary Database

**Status**: Accepted

**Context**:
- Relational data structure (users, bookings, payments)
- ACID compliance required
- Strong ecosystem and support
- Cost-effective for development

**Decision**:
Use PostgreSQL 14+ as the primary database.

**Consequences**:
- ✅ Strong ACID guarantees
- ✅ Rich data types (JSON, Arrays, Ranges)
- ✅ Excellent scaling capabilities
- ✅ Large ecosystem and community
- ❌ Not ideal for unstructured data (documents)
- ❌ Requires careful schema design for scale

---

## ADR-007: Redis for Caching & Sessions

**Status**: Accepted

**Context**:
- Need for fast session storage
- Real-time notification queuing
- Rate limiting and throttling
- Distributed caching layer

**Decision**:
Use Redis for sessions, caching, and real-time features.

**Consequences**:
- ✅ High-speed in-memory storage
- ✅ Pub/Sub for real-time features
- ✅ Support for TTL-based expiry
- ✅ Cluster mode for HA
- ❌ Memory limitations
- ❌ Data loss if not persisted

---

## ADR-008: Location-Based Matching

**Status**: Accepted

**Context**:
- Geographic proximity is primary matching criterion
- Need for efficient nearest-neighbor queries
- Rural areas with varying density

**Decision**:
Use PostGIS extension for PostgreSQL to enable location-based queries.

**Consequences**:
- ✅ Efficient geographic queries
- ✅ Built into PostgreSQL
- ✅ Supports complex geographic operations
- ❌ Additional PostgreSQL extension to manage
- ❌ Learning curve for spatial queries

---

## ADR-009: REST API with WebSockets for Real-time

**Status**: Accepted

**Context**:
- Need for request-response communication (REST)
- Need for real-time notifications and messaging
- Browser compatibility requirements

**Decision**:
Use REST API for primary operations and WebSockets (Socket.io) for real-time features.

**Consequences**:
- ✅ Separation of concerns
- ✅ REST widely understood and documented
- ✅ WebSockets for efficient real-time
- ❌ Two different protocols to manage
- ❌ WebSocket state management complexity

---

## ADR-010: Payment Gateway Integration

**Status**: Accepted

**Context**:
- Multiple payment methods needed (UPI, bank transfer)
- Security and compliance requirements
- India-centric market

**Decision**:
Use Razorpay (or Stripe) as primary payment processor with fallback to direct bank integration.

**Consequences**:
- ✅ Handles multiple payment methods
- ✅ Webhook integration for notifications
- ✅ India-specific payment support (UPI)
- ✅ Reduces PCI compliance burden
- ❌ Commission per transaction
- ❌ Vendor dependency
