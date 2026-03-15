// ============================================================
// TypeScript Types/Interfaces for Smart Website Platform
// Matching Prisma schema models for Thai local government sites
// ============================================================

// --- Enums ---

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export enum ComplaintStatus {
  SUBMITTED = 'SUBMITTED',
  RECEIVED = 'RECEIVED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

// --- Core Models ---

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  logo?: string | null;
  favicon?: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  socialFacebook?: string | null;
  socialLine?: string | null;
  socialYoutube?: string | null;
  socialTiktok?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headerStyle: 'default' | 'centered' | 'minimal';
  footerStyle: 'default' | 'compact' | 'expanded';
  fontFamily: 'Prompt' | 'Sarabun';
  logoPosition: 'left' | 'center';
  navStyle: 'horizontal' | 'mega-menu';
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role: UserRole;
  avatar?: string | null;
  tenantId: string;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// --- Content Models ---

export interface News {
  id: string;
  title: string;
  titleEn?: string | null;
  slug: string;
  excerpt?: string | null;
  excerptEn?: string | null;
  content: string;
  contentEn?: string | null;
  featuredImage?: string | null;
  category: NewsCategory;
  tags?: string | null;
  isPublished: boolean;
  isPinned: boolean;
  publishedAt?: Date | null;
  viewCount: number;
  author?: User | null;
  authorId: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum NewsCategory {
  NEWS = 'NEWS',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  PR = 'PR',
}

export enum ProcurementType {
  BID = 'BID',
  AUCTION = 'AUCTION',
  PURCHASE = 'PURCHASE',
  HIRE = 'HIRE',
}

export enum ProcurementStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
}

export interface Procurement {
  id: string;
  title: string;
  description?: string | null;
  type: ProcurementType;
  status: ProcurementStatus;
  budget?: number | null;
  documentUrl?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  publishedAt?: Date | null;
  authorId: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  id: string;
  title: string;
  titleEn?: string | null;
  slug: string;
  content: string;
  contentEn?: string | null;
  featuredImage?: string | null;
  template: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isPublished: boolean;
  publishedAt?: Date | null;
  authorId: string;
  author?: User | null;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Navigation ---

export interface MenuItem {
  id: string;
  label: string;
  labelEn?: string | null;
  url: string;
  icon?: string | null;
  target: string;
  order: number;
  isVisible: boolean;
  parentId?: string | null;
  parent?: MenuItem | null;
  children?: MenuItem[];
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Media ---

export interface Media {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt?: string | null;
  folder?: string | null;
  uploadedById: string;
  tenantId: string;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

// --- Banners ---

export interface Banner {
  id: string;
  title: string;
  titleEn?: string | null;
  subtitle?: string | null;
  subtitleEn?: string | null;
  imageUrl: string;
  videoUrl?: string | null;
  linkUrl?: string | null;
  order: number;
  isActive: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Gallery ---

export interface Gallery {
  id: string;
  title: string;
  titleEn?: string | null;
  description?: string | null;
  coverImage?: string | null;
  images?: GalleryImage[];
  isPublished: boolean;
  publishedAt?: Date | null;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryImage {
  id: string;
  galleryId: string;
  mediaId: string;
  caption?: string | null;
  order: number;
  gallery?: Gallery;
  media?: Media;
}

// --- Complaints / E-Service ---

export interface Complaint {
  id: string;
  trackingNumber: string;
  subject: string;
  description: string;
  category: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  location?: string | null;
  attachmentUrl?: string | null;
  status: ComplaintStatus;
  responseNote?: string | null;
  assignedToId?: string | null;
  assignedTo?: User | null;
  citizenId?: string | null;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Downloads ---

export interface Document {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  fileSize?: number | null;
  downloadCount: number;
  isPublished: boolean;
  publishedAt?: Date | null;
  authorId: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Contact ---

export enum ContactStatus {
  NEW = 'NEW',
  READ = 'READ',
  REPLIED = 'REPLIED',
  ARCHIVED = 'ARCHIVED',
}

export interface ContactSubmission {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  subject: string;
  message: string;
  status: ContactStatus;
  repliedAt?: Date | null;
  citizenId?: string | null;
  tenantId: string;
  createdAt: Date;
}

// --- AI Chat ---

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: Record<string, unknown>;
  tenantId: string;
  createdAt: Date;
}

// --- SEO ---

export interface SEOConfig {
  id: string;
  pageUrl: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  noIndex: boolean;
  noFollow: boolean;
  structuredData?: Record<string, unknown>;
  tenantId: string;
  updatedAt: Date;
}

// --- Activity Log ---

export interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  details?: Record<string, unknown>;
  userId: string;
  user?: User;
  tenantId: string;
  createdAt: Date;
}

// --- Component Props ---

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

export interface NavItem {
  label: string;
  labelEn?: string;
  href?: string;
  icon?: string;
  target?: '_self' | '_blank';
  children?: NavItem[];
}

export interface SocialLink {
  platform: 'facebook' | 'line' | 'youtube' | 'tiktok' | 'twitter' | 'instagram';
  url: string;
  label: string;
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

// --- API Response Types ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
