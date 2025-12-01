// Shared types and enums that can be used in both client and server code
// These do not import Mongoose or any Node.js-specific modules

export enum AssetStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  RESERVED = 'RESERVED',
}

export enum OwnershipType {
  OWNED = 'OWNED',
  LEASED = 'LEASED',
  RENTED = 'RENTED',
}

export enum DriverStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum RentalType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  CUSTOM = 'CUSTOM',
}

export enum RentalStatus {
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum MaintenanceStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum PurchaseRequestStatus {
  DRAFT = 'DRAFT',
  PENDING_SUPERVISOR_APPROVAL = 'PENDING_SUPERVISOR_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SENT_TO_FINANCE = 'SENT_TO_FINANCE',
  COMPLETED = 'COMPLETED',
}

export enum ItemCategory {
  TYRE = 'TYRE',
  TUBE = 'TUBE',
  ALLOY_WHEEL = 'ALLOY_WHEEL',
  SEAT_COVER = 'SEAT_COVER',
  FLOOR_MAT = 'FLOOR_MAT',
  OIL = 'OIL',
  LUBRICANT = 'LUBRICANT',
  BRAKE_PAD = 'BRAKE_PAD',
  WIPER = 'WIPER',
  BATTERY = 'BATTERY',
  LIGHT = 'LIGHT',
  MIRROR = 'MIRROR',
  FILTER = 'FILTER',
  OTHER = 'OTHER',
}


