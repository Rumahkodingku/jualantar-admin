# PRD — Merchant Approval Frontend

**Project:** JualAntar  
**Repository:** `jualantar-admin`  
**Feature:** Merchant Approval UI/UX & API Integration  
**Document:** PRD-merchant-approval-frontend.md  
**Version:** 1.0  
**Date:** 15 September 2026

## 1. Overview

`jualantar-admin` menjadi aplikasi internal untuk Admin/Operator melakukan Merchant Approval melalui REST API `jualantar-api`.

Frontend tidak mengakses database. Seluruh data dan mutation berasal dari:

```text
/api/v1/admin/merchant-approvals/*
```

Merchant Registration tetap berada di `jualantar-merchant`.

## 2. Goals

- Menyediakan approval dashboard.
- Menampilkan queue merchant application.
- Menampilkan detail application secara lengkap.
- Mendukung claim/release.
- Mendukung review per komponen.
- Mendukung request revision.
- Mendukung reject.
- Mendukung approve.
- Menampilkan timeline/audit events.
- Menangani RFC 9457 secara konsisten.
- Menggunakan type-safe API contracts.

## 3. Non-Goals

- Merchant registration form.
- Product/catalog management.
- Driver management.
- Payout verification engine.
- Direct database access.

## 4. Existing Frontend Architecture

Pertahankan pola module pada `app/modules`.

Tambahkan:

```text
app/modules/merchant-approval/
├── components/
├── hooks/
├── pages/
├── routes/
├── schemas/
├── services/
├── types/
└── index.ts
```

Gunakan stack dan pola existing project. Jangan membuat architecture baru hanya untuk feature ini.

## 5. Information Architecture

```text
Admin
│
├── Dashboard
│
└── Merchant Approval
    ├── Overview
    ├── Queue
    │   ├── Pending
    │   ├── In Review
    │   ├── Revision Required
    │   ├── Approved
    │   └── Rejected
    │
    └── Approval Detail
        ├── Business
        ├── Identity
        ├── Legal Entity
        ├── Service
        ├── Categories
        ├── Outlets
        ├── Documents
        ├── Payout
        ├── Review
        ├── Revisions
        └── Timeline
```

## 6. Approval Dashboard

Endpoint:

```http
GET /api/v1/admin/merchant-approvals/summary
```

Display:

- Pending count.
- In Review count.
- Revision Required count.
- Approved today.
- Rejected today.

Dashboard cards should link directly to filtered queue.

## 7. Approval Queue

Endpoint:

```http
GET /api/v1/admin/merchant-approvals
```

Features:

- Search business/application number.
- Filter status.
- Filter assigned reviewer.
- Pagination.
- Sort by submission date.
- Refresh.
- Loading state.
- Empty state.
- Error state.

Table columns:

```text
Application Number
Business Name
Type
Service
Status
Submitted At
Assigned To
Actions
```

Actions depend on status and permissions.

## 8. Approval Detail

Endpoint:

```http
GET /api/v1/admin/merchant-approvals/{approval}
```

Layout:

```text
Header
├── Business name
├── Application number
├── Status
├── Assigned reviewer
└── Actions

Content
├── Business
├── Identity
├── Legal Entity
├── Service
├── Categories
├── Outlets
├── Documents
├── Payout
├── Component Review
├── Revision History
└── Timeline
```

The detail screen must prioritize review decisions rather than editing merchant data.

## 9. Claim Workflow

Button:

```text
Claim Review
```

API:

```http
POST /api/v1/admin/merchant-approvals/{approval}/claim
```

After success:

- Update application status to `in_review`.
- Show current reviewer.
- Enable review controls.
- Invalidate approval detail and queue queries.

Prevent duplicate claim requests.

## 10. Release Workflow

API:

```http
POST /api/v1/admin/merchant-approvals/{approval}/release
```

Confirmation dialog recommended.

After success:

- Clear assignment.
- Update status if API returns it.
- Refresh queue/detail.

## 11. Component Review UI

Every reviewable component gets a review card:

```text
Component
Status
Data/Preview
Admin note
Review action
```

Actions:

```text
Verify
Reject
```

Review request:

```json
{
  "component": "identity",
  "subject_type": "merchant_identity",
  "subject_id": "uuid",
  "status": "verified",
  "note": "Identity data is valid."
}
```

Endpoint:

```http
POST /api/v1/admin/merchant-approvals/{approval}/reviews
```

Use confirmation for destructive/rejection actions.

## 12. Document Review

Document card must show:

- Document type.
- File name.
- File metadata.
- Preview/open action if supported.
- Review status.
- Reviewer note.

Do not expose object storage credentials or raw private storage paths.

## 13. Revision Workflow

Admin opens:

```text
Request Revision
```

Dialog:

```text
General note
+
Selected components
+
Reason per component
```

API:

```http
POST /api/v1/admin/merchant-approvals/{approval}/revision
```

Request:

```json
{
  "note": "Please correct the following data.",
  "items": [
    {
      "component": "identity",
      "subject_type": "merchant_identity",
      "subject_id": "uuid",
      "reason": "KTP image is unclear."
    }
  ]
}
```

After success:

```text
application.status = revision_required
```

UI should clearly communicate that the merchant must make corrections and resubmit.

## 14. Reject Workflow

Open confirmation dialog.

Require rejection reason.

API:

```http
POST /api/v1/admin/merchant-approvals/{approval}/reject
```

Request:

```json
{
  "reason": "Application does not meet requirements."
}
```

After success:

```text
status = rejected
```

Disable further approval actions.

## 15. Approve Workflow

Approve button must only appear when:

```text
application.status = in_review
```

Before submission, show confirmation containing:

- Merchant name.
- Application number.
- Review summary.
- Unresolved rejected/pending components, if any.

API:

```http
POST /api/v1/admin/merchant-approvals/{approval}/approve
```

After success:

```text
application = approved
merchant = active
```

Show success state and remove action buttons.

## 16. Timeline

Endpoint:

```http
GET /api/v1/admin/merchant-approvals/{approval}/events
```

Timeline event examples:

```text
Application submitted
Review claimed
Review released
Review started
Component verified
Component rejected
Revision requested
Application resubmitted
Application approved
Application rejected
```

Each event displays:

- Actor.
- Event.
- Timestamp.
- Relevant metadata where safe.

## 17. Revision History

Endpoint:

```http
GET /api/v1/admin/merchant-approvals/{approval}/revisions
```

Display:

- Revision status.
- Requested by.
- Requested at.
- General note.
- Revision items.
- Resolution state.

## 18. TypeScript Contracts

Create:

```text
types/merchant-approval.ts
schemas/merchant-approval.schema.ts
```

Core types:

```ts
type ApplicationStatus =
  | "draft"
  | "pending"
  | "in_review"
  | "revision_required"
  | "approved"
  | "rejected";

type ReviewComponent =
  | "business"
  | "identity"
  | "legal_entity"
  | "service"
  | "category"
  | "outlet"
  | "document"
  | "payout";

type ReviewStatus =
  | "pending"
  | "verified"
  | "rejected";
```

Do not duplicate backend business rules inside frontend schemas.

Schemas validate input shape; backend remains authoritative.

## 19. API Service

Create:

```text
services/merchant-approval-api.ts
```

Methods:

```ts
getSummary()
getApprovals(params)
getApproval(id)
claimApproval(id)
releaseApproval(id)
reviewComponent(id, payload)
requestRevision(id, payload)
rejectApplication(id, payload)
approveApplication(id)
getEvents(id)
getRevisions(id)
```

The service must use the project's existing HTTP client.

## 20. Hooks

Recommended hooks:

```text
use-merchant-approval-summary.ts
use-merchant-approvals.ts
use-merchant-approval.ts
use-claim-approval.ts
use-release-approval.ts
use-review-component.ts
use-request-revision.ts
use-reject-application.ts
use-approve-application.ts
use-approval-events.ts
use-approval-revisions.ts
```

Use the project's existing data-fetching strategy.

Mutations must invalidate affected queries.

## 21. RFC 9457 Error Handling

Backend errors use:

```http
Content-Type: application/problem+json
```

Example:

```json
{
  "type": "https://api.jualantar.id/problems/invalid-state-transition",
  "title": "Invalid State Transition",
  "status": 409,
  "detail": "Merchant application cannot be approved while its status is revision_required.",
  "instance": "/api/v1/admin/merchant-approvals/uuid",
  "code": "MERCHANT_APPLICATION_INVALID_STATE"
}
```

Frontend error mapping:

| Status | UI |
|---|---|
| 400 | Generic request error |
| 401 | Redirect/re-authenticate |
| 403 | Permission denied |
| 404 | Not found screen/toast |
| 409 | Lifecycle conflict |
| 422 | Field/domain validation |
| 429 | Retry later message |
| 500 | Generic server error |
| 503 | Service unavailable |

Prefer `code` for programmatic handling.

## 22. UX States

Every page must support:

```text
loading
success
empty
error
retry
```

Mutation states:

```text
idle
submitting
success
error
```

Prevent double submission.

## 23. Permission-aware UI

Frontend receives/knows current permissions and hides or disables actions appropriately.

Permissions:

```text
merchant.approval.view
merchant.approval.claim
merchant.approval.review
merchant.approval.revision
merchant.approval.reject
merchant.approval.approve
```

Frontend permission checks are UX controls only. Backend authorization remains mandatory.

## 24. Routing

Recommended routes:

```text
/admin/merchant-approvals
/admin/merchant-approvals/:approvalId
```

Optional filtered query:

```text
/admin/merchant-approvals?status=pending
/admin/merchant-approvals?status=in_review
/admin/merchant-approvals?assigned_to=me
```

## 25. Component Structure

```text
merchant-approval/
├── components/
│   ├── approval-status-badge.tsx
│   ├── approval-summary.tsx
│   ├── approval-table.tsx
│   ├── approval-detail.tsx
│   ├── component-review-card.tsx
│   ├── revision-dialog.tsx
│   ├── rejection-dialog.tsx
│   ├── approval-confirm-dialog.tsx
│   ├── approval-timeline.tsx
│   └── revision-history.tsx
│
├── hooks/
├── pages/
│   ├── merchant-approval-dashboard-page.tsx
│   ├── merchant-approval-list-page.tsx
│   └── merchant-approval-detail-page.tsx
│
├── routes/
├── schemas/
├── services/
├── types/
└── index.ts
```

## 26. UX Principles

1. Approval actions must be explicit.
2. Destructive actions require confirmation.
3. Revision reasons must be visible to admins.
4. Current application status must always be prominent.
5. Admin must know who owns the review.
6. Never silently mutate application state.
7. Show server errors in human-readable form.
8. Do not allow UI to imply approval when backend has not confirmed it.
9. Use optimistic updates only where state transitions cannot cause inconsistency; default to server-confirmed updates.
10. Preserve accessibility and keyboard navigation.

## 27. API Integration Flow

```text
Admin opens queue
      ↓
GET /merchant-approvals
      ↓
Admin opens application
      ↓
GET /merchant-approvals/{id}
      ↓
Claim
      ↓
POST /{id}/claim
      ↓
Review components
      ↓
POST /{id}/reviews
      ↓
 ┌────┴────────────┐
 ▼                 ▼
Revision          Approve
 │                 │
 ▼                 ▼
POST /revision    POST /approve
 │                 │
 ▼                 ▼
Merchant edits    Merchant active
and resubmits
```

## 28. Frontend Acceptance Criteria

- Approval module exists under `app/modules/merchant-approval`.
- Queue is paginated and filterable.
- Detail page displays all approval data.
- Claim/release work correctly.
- Component reviews work correctly.
- Revision dialog supports multiple revision items.
- Reject requires a reason.
- Approve requires confirmation.
- Timeline and revision history are visible.
- RFC 9457 errors are parsed consistently.
- Loading/error/empty states are implemented.
- Permission-aware actions are implemented.
- Mutation query invalidation is correct.
- No direct database access.
- No business workflow logic is duplicated from backend.
- Existing dashboard/auth flows remain unaffected.

## 29. Definition of Done

Frontend is complete when Admin can perform the entire Merchant Approval lifecycle from `pending` through `in_review`, `revision_required`, `approved`, or `rejected` using only the public API contract, with clear UI states and consistent error handling.
