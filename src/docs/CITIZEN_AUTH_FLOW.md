# Citizen Authentication Flow Analysis
# วิเคราะห์ระบบยืนยันตัวตนประชาชน — Smart Website Platform

> **Version:** 1.0
> **Last Updated:** 2026-03-16
> **Platform:** Smart Website สำหรับเทศบาล/อปท.
> **Tech Stack:** Next.js, Prisma, LINE Login, Google OAuth, Facebook Login, Phone/Email OTP

---

## สารบัญ (Table of Contents)

1. [Website Flow Analysis (วิเคราะห์ Flow ทั้งเว็บไซต์)](#1-website-flow-analysis)
2. [Authentication Methods (วิธีการยืนยันตัวตน)](#2-authentication-methods)
3. [Data Collection Matrix (ตารางการเก็บข้อมูล)](#3-data-collection-matrix)
4. [SSO Flow (Single Sign-On Flow)](#4-sso-flow)
5. [2FA Flow (Two-Factor Authentication)](#5-2fa-flow)
6. [PDPA Compliance Flow](#6-pdpa-compliance-flow)
7. [CDP Integration Roadmap (แผนงาน City Data Platform)](#7-cdp-integration-roadmap)
8. [Security Considerations](#8-security-considerations)

---

## 1. Website Flow Analysis

### วิเคราะห์ Flow ทั้งเว็บไซต์

ภาพรวมของทุกหน้าในเว็บไซต์และจุดที่เกี่ยวข้องกับระบบยืนยันตัวตนประชาชน (Citizen Auth Touchpoints)

```
┌─────────────────────────────────────────────────────────────────┐
│                     SMART WEBSITE PLATFORM                      │
│                                                                 │
│  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌──────────────────┐  │
│  │ PUBLIC  │  │ OPTIONAL │  │ AUTH   │  │ ADMIN (แยกระบบ)  │  │
│  │  PAGES  │  │   AUTH   │  │ REQUIRED│  │                  │  │
│  │ (เปิด)  │  │ (เสริม)  │  │ (บังคับ)│  │                  │  │
│  └────┬────┘  └────┬─────┘  └───┬────┘  └──────────────────┘  │
│       │            │            │                               │
│  Homepage     News         E-Service                           │
│  About        Announcements  Profile                           │
│  Gallery      Downloads      Complaint                         │
│  Search       Contact          Tracking                        │
│  Procurement  AI Chat                                          │
│               Complaints                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

### 1.1 หน้าหลัก (Homepage)

| รายการ | รายละเอียด |
|--------|-----------|
| **Page** | หน้าหลัก / Homepage |
| **Route** | `/` |
| **Auth Requirement** | ❌ ไม่ต้องเข้าสู่ระบบ |
| **Data Collection** | — ไม่มีการเก็บข้อมูลส่วนบุคคล (มีเฉพาะ anonymous analytics) |
| **Benefits of Login** | แสดงชื่อประชาชน, แสดง personalized content, Quick access ไปยังบริการที่ใช้บ่อย |

**User Flow:**
```
ผู้เยี่ยมชม ──▶ เข้า Homepage
                    │
        ┌───────────┴───────────────┐
        │                           │
   [ไม่ Login]                 [Login แล้ว]
        │                           │
   ดูข้อมูลทั่วไป              แสดงชื่อผู้ใช้
   เห็นปุ่ม "เข้าสู่ระบบ"      แสดง Quick Menu
   Banner, ข่าวล่าสุด          แสดงการแจ้งเตือน
   ประกาศ, ปฏิทิน              Personalized Content
```

---

### 1.2 ข้อมูลเทศบาล (About)

| รายการ | รายละเอียด |
|--------|-----------|
| **Page** | ข้อมูลเทศบาล / About Municipality |
| **Route** | `/about`, `/about/structure`, `/about/vision`, `/about/executives` |
| **Auth Requirement** | ❌ ไม่ต้องเข้าสู่ระบบ |
| **Data Collection** | — ไม่มี (anonymous page view tracking เท่านั้น) |
| **Benefits of Login** | ไม่มีประโยชน์เพิ่มเติม — เป็นหน้าข้อมูลสาธารณะ |

**User Flow:**
```
ผู้เยี่ยมชม ──▶ เข้าหน้า About
                    │
         ดูข้อมูลทั่วไปของเทศบาล
         วิสัยทัศน์ / โครงสร้าง / ผู้บริหาร
         (ไม่มี auth touchpoint)
```

---

### 1.3 ข่าวสาร (News)

| รายการ | รายละเอียด |
|--------|-----------|
| **Page** | ข่าวสาร / News |
| **Route** | `/news`, `/news/[id]` |
| **Auth Requirement** | 🔓 เข้าสู่ระบบเพื่อใช้ฟีเจอร์เพิ่มเติม |
| **Data Collection** | Bookmark data, Reading history, Category preferences |
| **Benefits of Login** | บันทึกข่าว (Bookmark), ประวัติการอ่าน, แนะนำข่าวที่สนใจ |

**User Flow:**
```
ผู้เยี่ยมชม ──▶ เข้าหน้า News
                    │
        ┌───────────┴───────────────┐
        │                           │
   [ไม่ Login]                 [Login แล้ว]
        │                           │
   ดูรายการข่าว                ดูรายการข่าว
   อ่านรายละเอียด              อ่านรายละเอียด
   แชร์ข่าว                    แชร์ข่าว
        │                      ⭐ บันทึกข่าว (Bookmark)
        │                      📋 ดูประวัติการอ่าน
        │                      🎯 ข่าวแนะนำ (Personalized)
        │                           │
   [กดบันทึก] ──▶ Prompt Login      │
                    │               │
              เลือกวิธี Login       │
              LINE / Google /       │
              Facebook / OTP        │
                    │               │
              Login สำเร็จ ──▶ บันทึกข่าว + redirect กลับ
```

---

### 1.4 ประกาศ (Announcements)

| รายการ | รายละเอียด |
|--------|-----------|
| **Page** | ประกาศ / Announcements |
| **Route** | `/announcements`, `/announcements/[id]` |
| **Auth Requirement** | 🔓 เข้าสู่ระบบเพื่อใช้ฟีเจอร์เพิ่มเติม |
| **Data Collection** | Subscription preferences, Notification channel (LINE/Email/SMS) |
| **Benefits of Login** | รับการแจ้งเตือนประกาศใหม่ผ่าน LINE/Email/SMS, เลือกหมวดหมู่ที่สนใจ |

**User Flow:**
```
ผู้เยี่ยมชม ──▶ เข้าหน้า Announcements
                    │
        ┌───────────┴───────────────┐
        │                           │
   [ไม่ Login]                 [Login แล้ว]
        │                           │
   ดูรายการประกาศ              ดูรายการประกาศ
   อ่านรายละเอียด              อ่านรายละเอียด
        │                      🔔 Subscribe หมวดหมู่
        │                      📱 เลือก Channel แจ้งเตือน
        │                           (LINE / Email / SMS)
        │                      📋 ดูประกาศที่ Subscribe
        │                           │
   [กด Subscribe] ──▶ Prompt Login  │
                         │          │
                   Login สำเร็จ     │
                         │          │
                   เลือกหมวดหมู่ + Channel
                   บันทึก Preferences
```

---

### 1.5 จัดซื้อจัดจ้าง (Procurement)

| รายการ | รายละเอียด |
|--------|-----------|
| **Page** | จัดซื้อจัดจ้าง / Procurement |
| **Route** | `/procurement`, `/procurement/[id]` |
| **Auth Requirement** | ❌ ไม่ต้องเข้าสู่ระบบ |
| **Data Collection** | — ไม่มี (เป็นข้อมูลสาธารณะตาม พ.ร.บ.จัดซื้อจัดจ้าง) |
| **Benefits of Login** | ไม่มี — ข้อมูลจัดซื้อจัดจ้างต้องเปิดเผยต่อสาธารณะ |

**User Flow:**
```
ผู้เยี่ยมชม ──▶ เข้าหน้า Procurement
                    │
         ดูรายการจัดซื้อจัดจ้าง
         กรองตามประเภท / ปีงบประมาณ
         ดูรายละเอียด / ดาวน์โหลดเอกสาร
         (ไม่มี auth touchpoint — เป็นข้อมูลสาธารณะ)
```

---

### 1.6 อัลบั้มภาพ (Gallery)

| รายการ | รายละเอียด |
|--------|-----------|
| **Page** | อัลบั้มภาพ / Photo Gallery |
| **Route** | `/gallery`, `/gallery/[albumId]` |
| **Auth Requirement** | ❌ ไม่ต้องเข้าสู่ระบบ |
| **Data Collection** | — ไม่มี |
| **Benefits of Login** | ไม่มี — เป็นหน้าแสดงภาพกิจกรรมสาธารณะ |

**User Flow:**
```
ผู้เยี่ยมชม ──▶ เข้าหน้า Gallery
                    │
         ดูรายการอัลบั้ม
         เลือกอัลบั้ม ──▶ ดูภาพ
         (ไม่มี auth touchpoint)
```

---

### 1.7 ดาวน์โหลดเอกสาร (Downloads)

| รายการ | รายละเอียด |
|--------|-----------|
| **Page** | ดาวน์โหลดเอกสาร / Document Downloads |
| **Route** | `/downloads`, `/downloads/[categoryId]` |
| **Auth Requirement** | 🔓 เข้าสู่ระบบเพื่อใช้ฟีเจอร์เพิ่มเติม / 🔒 บางเอกสารต้องเข้าสู่ระบบ |
| **Data Collection** | Download history, Document access logs |
| **Benefits of Login** | ดาวน์โหลดเอกสารที่จำกัดสิทธิ์, ประวัติการดาวน์โหลด, แจ้งเตือนเอกสารใหม่ |

**User Flow:**
```
ผู้เยี่ยมชม ──▶ เข้าหน้า Downloads
                    │
        ┌───────────┴───────────────┐
        │                           │
   [เอกสารสาธารณะ]           [เอกสารจำกัดสิทธิ์]
        │                           │
   ดาวน์โหลดได้เลย            ต้อง Login ก่อน
   (anonymous tracking)            │
        │                    ┌──────┴──────┐
        │               [ไม่ Login]   [Login แล้ว]
        │                    │             │
        │              Prompt Login    ดาวน์โหลดได้
        │              + แจ้งเหตุผล    + บันทึกประวัติ
        │                    │             │
        │              Login สำเร็จ ──▶ ดาวน์โหลด
        │                              + บันทึกลง History
        │
   [Login แล้ว — เอกสารสาธารณะ]
        │
   ดาวน์โหลด + บันทึกประวัติ + แจ้งเตือนเอกสารใหม่
```

---

### 1.8 ติดต่อเรา (Contact)

| รายการ | รายละเอียด |
|--------|-----------|
| **Page** | ติดต่อเรา / Contact Us |
| **Route** | `/contact` |
| **Auth Requirement** | 🔓 เข้าสู่ระบบเพื่อใช้ฟีเจอร์เพิ่มเติม |
| **Data Collection** | ชื่อ, อีเมล, เบอร์โทร, หัวข้อ, รายละเอียด, ประวัติการติดต่อ |
| **Benefits of Login** | กรอกข้อมูลอัตโนมัติ (Pre-fill), ติดตามสถานะ, ดูประวัติการติดต่อ |

**User Flow:**
```
ผู้เยี่ยมชม ──▶ เข้าหน้า Contact
                    │
        ┌───────────┴───────────────┐
        │                           │
   [ไม่ Login]                 [Login แล้ว]
        │                           │
   กรอกฟอร์มด้วยตนเอง         Pre-fill ชื่อ/อีเมล/เบอร์โทร
   - ชื่อ-นามสกุล              แก้ไขได้ก่อนส่ง
   - อีเมล                         │
   - เบอร์โทร                 ส่งฟอร์ม
   - หัวข้อ + รายละเอียด           │
        │                      บันทึกประวัติการติดต่อ
   ส่งฟอร์ม                   สามารถติดตามสถานะได้
   (ไม่มีประวัติ)              ดูประวัติการติดต่อทั้งหมด
        │
   [แนะนำให้ Login]
   "เข้าสู่ระบบเพื่อติดตามสถานะ"
```

---

### 1.9 ร้องเรียน/ร้องทุกข์ (Complaints)

| รายการ | รายละเอียด |
|--------|-----------|
| **Page** | ร้องเรียน/ร้องทุกข์ / Complaints |
| **Route** | `/complaints`, `/complaints/new`, `/complaints/[id]` |
| **Auth Requirement** | 🔓 เข้าสู่ระบบเพื่อใช้ฟีเจอร์เพิ่มเติม (ส่งร้องเรียนได้โดยไม่ login แต่จะไม่สามารถติดตามสถานะได้) |
| **Data Collection** | ชื่อ, เบอร์โทร, อีเมล, ที่อยู่, หมวดเรื่องร้องเรียน, รายละเอียด, รูปภาพ/ไฟล์แนบ, พิกัด GPS |
| **Benefits of Login** | Pre-fill ข้อมูล, ติดตามสถานะ Real-time, ประวัติเรื่องร้องเรียน, รับการแจ้งเตือนผ่าน LINE/SMS/Email |

**User Flow:**
```
ผู้เยี่ยมชม ──▶ เข้าหน้า Complaints
                    │
        ┌───────────┴───────────────────┐
        │                               │
   [ส่งร้องเรียนใหม่]           [ติดตามสถานะ]
        │                               │
   ┌────┴─────┐                    ต้อง Login
   │          │                    หรือใช้เลขที่ร้องเรียน
   │          │                         │
[ไม่ Login] [Login]              ┌──────┴──────┐
   │          │                  │             │
กรอกข้อมูล  Pre-fill          [Login]     [ใช้เลข Ref]
ด้วยตนเอง  ข้อมูลส่วนตัว       │             │
   │          │              ดูรายการ      กรอกเลขที่
   │          │              ร้องเรียน     ร้องเรียน
   │          │              ทั้งหมด          │
ส่งร้องเรียน  ส่งร้องเรียน      │         ดูสถานะ
   │          │              ดูสถานะ      เรื่องเดียว
ได้เลข Ref   บันทึกใน         แต่ละเรื่อง
(ติดตาม     Profile            │
ด้วยเลข     + ติดตามได้      รับ Notification
Ref เท่านั้น) + แจ้งเตือน      เมื่อสถานะเปลี่ยน
```

---

### 1.10 บริการออนไลน์ (E-Service)

| รายการ | รายละเอียด |
|--------|-----------|
| **Page** | บริการออนไลน์ / E-Service |
| **Route** | `/e-service`, `/e-service/[serviceId]` |
| **Auth Requirement** | 🔒 **ต้องเข้าสู่ระบบ** |
| **Data Collection** | ข้อมูลส่วนบุคคลตามบริการ (เลขบัตรประชาชน, ที่อยู่, เอกสารประกอบ ฯลฯ) |
| **Benefits of Login** | เป็นข้อบังคับ — ต้องยืนยันตัวตนเพื่อใช้บริการ |

**User Flow:**
```
ผู้เยี่ยมชม ──▶ เข้าหน้า E-Service
                    │
              ดูรายการบริการ (public)
                    │
              เลือกบริการ
                    │
           ┌────────┴────────┐
           │                 │
      [ไม่ Login]       [Login แล้ว]
           │                 │
     Redirect ไป         ดำเนินการ
     หน้า Login          ยื่นคำร้อง
     + Return URL             │
           │            กรอกข้อมูลตามฟอร์ม
     เลือกวิธี Login    แนบเอกสาร
     LINE / Google /    ยืนยัน PDPA Consent
     Facebook / OTP          │
           │            ส่งคำร้อง
     Login สำเร็จ            │
           │            ได้เลขที่คำร้อง
     Redirect กลับ      ติดตามสถานะ
     + ดำเนินการต่อ     รับ Notification
                        เมื่อสถานะเปลี่ยน

บริการตัวอย่าง:
├── ขอข้อมูลข่าวสาร
├── แจ้งซ่อมไฟฟ้า/ประปา
├── ขออนุญาตก่อสร้าง
├── ชำระภาษี
├── จองสถานที่
├── ขอใบอนุญาตประกอบการ
└── อื่นๆ ตามภารกิจเทศบาล
```

---

### 1.11 ค้นหา (Search)

| รายการ | รายละเอียด |
|--------|-----------|
| **Page** | ค้นหา / Search |
| **Route** | `/search?q=...` |
| **Auth Requirement** | ❌ ไม่ต้องเข้าสู่ระบบ |
| **Data Collection** | Search queries (anonymous), Search history (logged in) |
| **Benefits of Login** | ประวัติการค้นหา, ผลลัพธ์ที่ personalized |

**User Flow:**
```
ผู้เยี่ยมชม ──▶ พิมพ์คำค้น
                    │
         แสดงผลลัพธ์จากทุกส่วน
         (ข่าว, ประกาศ, เอกสาร, บริการ)
                    │
        ┌───────────┴───────────────┐
        │                           │
   [ไม่ Login]                 [Login แล้ว]
        │                           │
   ผลลัพธ์ทั่วไป               ผลลัพธ์ + Personalized ranking
                                บันทึกประวัติการค้นหา
```

---

### 1.12 AI Chat

| รายการ | รายละเอียด |
|--------|-----------|
| **Page** | AI Chat / ผู้ช่วย AI |
| **Route** | `/chat` หรือ Floating Widget ทุกหน้า |
| **Auth Requirement** | 🔓 เข้าสู่ระบบเพื่อใช้ฟีเจอร์เพิ่มเติม |
| **Data Collection** | Chat messages, Conversation history, User intent data |
| **Benefits of Login** | ประวัติการสนทนา, คำตอบเฉพาะบุคคล, เชื่อมกับ E-Service, ดูสถานะคำร้อง |

**User Flow:**
```
ผู้เยี่ยมชม ──▶ เปิด AI Chat
                    │
        ┌───────────┴───────────────┐
        │                           │
   [ไม่ Login]                 [Login แล้ว]
        │                           │
   ถามคำถามทั่วไป              ถามคำถามทั่วไป
   ข้อมูลเทศบาล               ข้อมูลเทศบาล
   เวลาทำการ                   เวลาทำการ
   สถานที่ติดต่อ                  │
        │                      🎯 "สถานะคำร้องของฉัน?"
        │                      🎯 "ภาษีค้างชำระเท่าไหร่?"
        │                      🎯 "นัดหมายได้ไหม?"
        │                      📋 ดูประวัติสนทนา
        │                           │
   [ถามเรื่องส่วนตัว]         AI ดึงข้อมูลจาก Profile
   ──▶ "กรุณาเข้าสู่ระบบ       + E-Service History
       เพื่อดูข้อมูลส่วนบุคคล"  ตอบเฉพาะบุคคล
```

---

### สรุปภาพรวม Auth Requirements

```
┌────────────────────────────┬──────────────────────────┐
│         หน้า / Page        │     Auth Requirement     │
├────────────────────────────┼──────────────────────────┤
│ หน้าหลัก (Homepage)        │ ❌ ไม่ต้อง               │
│ ข้อมูลเทศบาล (About)       │ ❌ ไม่ต้อง               │
│ ข่าวสาร (News)             │ 🔓 เสริม (Bookmark)      │
│ ประกาศ (Announcements)     │ 🔓 เสริม (Subscribe)     │
│ จัดซื้อจัดจ้าง (Procurement)│ ❌ ไม่ต้อง               │
│ อัลบั้มภาพ (Gallery)       │ ❌ ไม่ต้อง               │
│ ดาวน์โหลด (Downloads)      │ 🔓 เสริม / 🔒 บางเอกสาร │
│ ติดต่อเรา (Contact)        │ 🔓 เสริม (Pre-fill)      │
│ ร้องเรียน (Complaints)     │ 🔓 เสริม (Tracking)      │
│ บริการออนไลน์ (E-Service)  │ 🔒 บังคับ                │
│ ค้นหา (Search)             │ ❌ ไม่ต้อง               │
│ AI Chat                    │ 🔓 เสริม (Personalized)  │
└────────────────────────────┴──────────────────────────┘

Legend:
  ❌ = ไม่ต้องเข้าสู่ระบบ (No auth required)
  🔓 = เข้าสู่ระบบเพื่อใช้ฟีเจอร์เพิ่มเติม (Optional auth, enhanced features)
  🔒 = ต้องเข้าสู่ระบบ (Auth required)
```

---

## 2. Authentication Methods

### วิธีการยืนยันตัวตน

ระบบรองรับ 5 วิธีการ Login โดยประชาชนสามารถเลือกวิธีใดก็ได้ และเชื่อมโยงบัญชีได้ (Account Linking)

---

### 2.1 LINE Login

**เหตุผลที่เป็น Primary Method:** LINE เป็นแอปที่คนไทยใช้มากที่สุด (>53 ล้านบัญชี) เหมาะกับกลุ่มเป้าหมายที่เป็นประชาชนทั่วไป

**Data Collected:**
| Field | Type | ตัวอย่าง | PDPA Category |
|-------|------|---------|---------------|
| `userId` | String | `U1234567890abcdef...` | Identifier |
| `displayName` | String | `สมชาย` | Personal Data |
| `pictureUrl` | URL | `https://profile.line-scdn.net/...` | Personal Data |
| `statusMessage` | String | `Hello World` | Personal Data |
| `email` | String (optional, ต้องขอ permission) | `somchai@email.com` | Personal Data |

**Flow Diagram:**
```
ประชาชน ──▶ กดปุ่ม "เข้าสู่ระบบด้วย LINE"
                │
                ▼
        ┌──────────────────┐
        │  Redirect ไปยัง   │
        │  LINE Auth Server │
        │                  │
        │  authorize URL:  │
        │  https://access. │
        │  line.me/oauth2/ │
        │  v2.1/authorize  │
        │                  │
        │  params:         │
        │  - response_type │
        │  - client_id     │
        │  - redirect_uri  │
        │  - state (CSRF)  │
        │  - scope:        │
        │    profile,      │
        │    openid,       │
        │    email         │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  LINE Login Page  │
        │  (LINE App /      │
        │   QR Code /       │
        │   Email+Password) │
        └────────┬─────────┘
                 │
           ผู้ใช้อนุญาต
                 │
                 ▼
        ┌──────────────────┐
        │  LINE Redirect    │
        │  กลับมาที่         │
        │  /api/auth/       │
        │  callback/line    │
        │                  │
        │  params:         │
        │  - code           │
        │  - state          │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  Backend:         │
        │  1. Verify state  │
        │  2. Exchange code  │
        │     → access_token│
        │  3. GET /v2/      │
        │     profile       │
        │  4. Verify ID     │
        │     token         │
        │  5. Upsert Citizen│
        │     record        │
        │  6. Check Account │
        │     Linking        │
        │  7. Create Session│
        │  8. Set httpOnly  │
        │     cookie        │
        └────────┬─────────┘
                 │
                 ▼
        Redirect ไปหน้าเดิม (return URL)
        + แสดง Welcome Message
```

---

### 2.2 Google OAuth

**Data Collected:**
| Field | Type | ตัวอย่าง | PDPA Category |
|-------|------|---------|---------------|
| `sub` | String | `1234567890` | Identifier |
| `email` | String | `somchai@gmail.com` | Personal Data |
| `email_verified` | Boolean | `true` | Metadata |
| `name` | String | `สมชาย ใจดี` | Personal Data |
| `given_name` | String | `สมชาย` | Personal Data |
| `family_name` | String | `ใจดี` | Personal Data |
| `picture` | URL | `https://lh3.googleusercontent.com/...` | Personal Data |
| `locale` | String | `th` | Metadata |

**Flow Diagram:**
```
ประชาชน ──▶ กดปุ่ม "เข้าสู่ระบบด้วย Google"
                │
                ▼
        ┌──────────────────┐
        │  Redirect ไปยัง   │
        │  Google OAuth     │
        │                  │
        │  accounts.google │
        │  .com/o/oauth2/  │
        │  v2/auth         │
        │                  │
        │  scope:          │
        │  - openid        │
        │  - profile       │
        │  - email         │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  Google Login     │
        │  เลือก Google     │
        │  Account          │
        └────────┬─────────┘
                 │
           ผู้ใช้อนุญาต
                 │
                 ▼
        ┌──────────────────┐
        │  Callback:        │
        │  /api/auth/       │
        │  callback/google  │
        │                  │
        │  Exchange code    │
        │  → access_token   │
        │  + id_token       │
        └────────┬─────────┘
                 │
                 ▼
        Backend: Verify + Upsert + Session
        (เหมือนขั้นตอน LINE ข้อ 5-8)
```

---

### 2.3 Facebook Login

**Data Collected:**
| Field | Type | ตัวอย่าง | PDPA Category |
|-------|------|---------|---------------|
| `id` | String | `1234567890` | Identifier |
| `email` | String | `somchai@email.com` | Personal Data |
| `name` | String | `สมชาย ใจดี` | Personal Data |
| `picture.data.url` | URL | `https://graph.facebook.com/...` | Personal Data |

**Flow Diagram:**
```
ประชาชน ──▶ กดปุ่ม "เข้าสู่ระบบด้วย Facebook"
                │
                ▼
        ┌──────────────────┐
        │  Redirect ไปยัง   │
        │  Facebook OAuth   │
        │                  │
        │  facebook.com/   │
        │  v18.0/dialog/   │
        │  oauth            │
        │                  │
        │  scope:          │
        │  - public_profile│
        │  - email         │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  Facebook Login   │
        │  Page             │
        └────────┬─────────┘
                 │
           ผู้ใช้อนุญาต
                 │
                 ▼
        ┌──────────────────┐
        │  Callback:        │
        │  /api/auth/       │
        │  callback/        │
        │  facebook         │
        └────────┬─────────┘
                 │
                 ▼
        Backend: Verify + Upsert + Session
```

---

### 2.4 Phone + OTP (SMS)

**Data Collected:**
| Field | Type | ตัวอย่าง | PDPA Category |
|-------|------|---------|---------------|
| `phoneNumber` | String | `0812345678` | Personal Data |
| `verificationStatus` | Boolean | `true` | Metadata |
| `verifiedAt` | DateTime | `2026-03-16T10:00:00Z` | Metadata |

**Flow Diagram:**
```
ประชาชน ──▶ เลือก "เข้าสู่ระบบด้วยเบอร์โทร"
                │
                ▼
        ┌──────────────────┐
        │  กรอกเบอร์โทรศัพท์ │
        │  08x-xxx-xxxx    │
        │                  │
        │  Validation:     │
        │  - รูปแบบเบอร์ไทย │
        │  - 10 หลัก        │
        │  - ขึ้นต้น 0      │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  Backend:         │
        │  1. Rate limit    │
        │     check         │
        │  2. Generate OTP  │
        │     (6 digits)    │
        │  3. Store OTP     │
        │     (TTL: 5 min)  │
        │  4. Send SMS via  │
        │     provider      │
        │     (ThaiBulkSMS/ │
        │      SMSMKT)      │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  แสดงหน้ากรอก OTP  │
        │  _ _ _ _ _ _     │
        │                  │
        │  Countdown: 5:00 │
        │  "ส่ง OTP อีกครั้ง" │
        │  (หลัง 60 วินาที)  │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  Backend:         │
        │  1. Verify OTP    │
        │  2. Check attempt │
        │     count (max 5) │
        │  3. Upsert Citizen│
        │  4. Create Session│
        │  5. Invalidate    │
        │     used OTP      │
        └────────┬─────────┘
                 │
                 ▼
        Login สำเร็จ ──▶ Redirect
```

---

### 2.5 Email + OTP

**Data Collected:**
| Field | Type | ตัวอย่าง | PDPA Category |
|-------|------|---------|---------------|
| `email` | String | `somchai@email.com` | Personal Data |
| `verificationStatus` | Boolean | `true` | Metadata |
| `verifiedAt` | DateTime | `2026-03-16T10:00:00Z` | Metadata |

**Flow Diagram:**
```
ประชาชน ──▶ เลือก "เข้าสู่ระบบด้วยอีเมล"
                │
                ▼
        ┌──────────────────┐
        │  กรอกอีเมล        │
        │  user@example.com│
        │                  │
        │  Validation:     │
        │  - รูปแบบ email   │
        │  - ไม่ใช่ disposable│
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  Backend:         │
        │  1. Rate limit    │
        │  2. Generate OTP  │
        │     (6 digits)    │
        │  3. Store OTP     │
        │     (TTL: 10 min) │
        │  4. Send Email    │
        │     (Resend /     │
        │      SendGrid /   │
        │      SES)         │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  แสดงหน้ากรอก OTP  │
        │  (เหมือน SMS)     │
        │                  │
        │  + ลิงก์ Magic    │
        │    Link ในอีเมล   │
        │    (ทางเลือก)     │
        └────────┬─────────┘
                 │
                 ▼
        Verify + Session (เหมือน SMS OTP)
```

---

### สรุปเปรียบเทียบวิธี Login

```
┌──────────────┬───────────┬──────────┬───────────┬──────────────┐
│    Method    │ ความง่าย  │ ข้อมูลได้ │ ความนิยม  │ ข้อควรระวัง   │
├──────────────┼───────────┼──────────┼───────────┼──────────────┤
│ LINE Login   │ ★★★★★    │ ★★★     │ ★★★★★    │ ต้องมี LINE   │
│ Google OAuth │ ★★★★     │ ★★★★   │ ★★★★     │ ต้องมี Google │
│ Facebook     │ ★★★★     │ ★★★     │ ★★★      │ ความนิยมลดลง │
│ Phone OTP    │ ★★★      │ ★★      │ ★★★★     │ ค่า SMS      │
│ Email OTP    │ ★★★      │ ★★      │ ★★★      │ อาจเข้า Spam │
└──────────────┴───────────┴──────────┴───────────┴──────────────┘
```

---

## 3. Data Collection Matrix

### ตารางการเก็บข้อมูลทั้งหมด

| # | Touchpoint | Data Collected | Auth Required | Consent Required | CDP Value |
|---|-----------|---------------|---------------|-----------------|-----------|
| 1 | LINE Login | userId, displayName, pictureUrl, statusMessage, email | Yes (implicit) | Yes - PDPA Consent | **สูงมาก** — ใช้เป็น primary identifier, ส่ง notification ผ่าน LINE |
| 2 | Google OAuth | sub, email, name, picture, locale | Yes (implicit) | Yes - PDPA Consent | **สูง** — ได้ verified email |
| 3 | Facebook Login | id, email, name, picture | Yes (implicit) | Yes - PDPA Consent | **ปานกลาง** — ข้อมูลน้อยลง |
| 4 | Phone OTP | phoneNumber, verificationStatus | Yes (implicit) | Yes - PDPA Consent | **สูงมาก** — verified phone, ส่ง SMS ได้ |
| 5 | Email OTP | email, verificationStatus | Yes (implicit) | Yes - PDPA Consent | **สูง** — verified email, ส่ง email ได้ |
| 6 | Profile Update | ชื่อ, นามสกุล, เลขบัตร ปชช., ที่อยู่, วันเกิด | Yes | Yes - Explicit | **สูงมาก** — ข้อมูลครบถ้วน |
| 7 | News Bookmark | articleId, timestamp | Yes | No (legitimate interest) | **ปานกลาง** — ความสนใจ |
| 8 | Announcement Subscribe | categories, notificationChannel | Yes | Yes - Explicit | **สูง** — ช่องทางติดต่อ + ความสนใจ |
| 9 | Document Download | documentId, timestamp, citizenId | Mixed | No (legitimate interest) | **ปานกลาง** — พฤติกรรมการใช้งาน |
| 10 | Contact Form | ชื่อ, email, phone, message | No (optional auth) | Yes - Explicit | **สูง** — ข้อมูลติดต่อ + ปัญหา |
| 11 | Complaint Form | ชื่อ, email, phone, ที่อยู่, GPS, รายละเอียด, ภาพ | No (optional auth) | Yes - Explicit | **สูงมาก** — ข้อมูลครบ + ภูมิสาสตร์ |
| 12 | E-Service Application | ข้อมูลตามบริการ (ID card, ที่อยู่, เอกสาร) | **Yes** | Yes - Explicit per service | **สูงมาก** — ข้อมูลบริการครบ |
| 13 | AI Chat | messages, intent, context | No (optional auth) | Yes - Implicit (chat usage) | **สูง** — ความต้องการของประชาชน |
| 14 | Search | search queries, click-through | No | No (anonymous analytics) | **ต่ำ-ปานกลาง** — ความสนใจ |
| 15 | Page Views | pageUrl, timestamp, referrer, device | No | Yes - Cookie Consent | **ต่ำ** — พฤติกรรมทั่วไป |
| 16 | Notification Preferences | channels (LINE/SMS/Email), frequency | Yes | Yes - Explicit | **สูง** — ช่องทาง + ความถี่ |

---

### Citizen Data Profile (โครงสร้างข้อมูลประชาชน)

```
CitizenProfile {
  // === Core Identity ===
  id                    UUID (internal)

  // === Auth Providers (Account Linking) ===
  lineUserId            String?       ← LINE Login
  googleSub             String?       ← Google OAuth
  facebookId            String?       ← Facebook Login
  phone                 String?       ← Phone OTP (verified)
  email                 String?       ← Email OTP / OAuth (verified)

  // === Personal Information ===
  firstName             String?       ← Profile / E-Service
  lastName              String?       ← Profile / E-Service
  nationalId            String?       ← E-Service (encrypted)
  dateOfBirth           Date?         ← Profile
  address               JSON?         ← Profile / E-Service
  avatarUrl             String?       ← OAuth provider

  // === Preferences ===
  language              String        ← Browser / Profile
  notificationChannels  String[]      ← Settings
  subscribedCategories  String[]      ← Announcement Subscribe

  // === Activity Data (CDP) ===
  bookmarkedNews        Relation[]    ← News Bookmark
  downloadHistory       Relation[]    ← Document Downloads
  searchHistory         Relation[]    ← Search (logged in)
  chatHistory           Relation[]    ← AI Chat
  complaints            Relation[]    ← Complaints
  serviceApplications   Relation[]    ← E-Service
  contactHistory        Relation[]    ← Contact Form

  // === Security ===
  twoFactorEnabled      Boolean
  twoFactorMethod       String?       (SMS / Email)
  lastLoginAt           DateTime
  loginHistory          JSON[]

  // === PDPA ===
  consentRecords        Relation[]
  dataRetentionExpiry   DateTime

  // === Metadata ===
  createdAt             DateTime
  updatedAt             DateTime
  lastActiveAt          DateTime
}
```

---

## 4. SSO Flow (Single Sign-On Flow)

### 4.1 Unified SSO Experience

ระบบใช้ Unified Citizen Identity ที่รองรับหลาย provider โดยประชาชนมี 1 profile ไม่ว่าจะ login ด้วยวิธีใด

```
┌─────────────────────────────────────────────────────────┐
│                  CITIZEN AUTH GATEWAY                     │
│                                                         │
│   ┌─────┐  ┌────────┐  ┌──────────┐  ┌─────┐  ┌─────┐ │
│   │LINE │  │ Google │  │ Facebook │  │Phone│  │Email│ │
│   │Login│  │ OAuth  │  │  Login   │  │ OTP │  │ OTP │ │
│   └──┬──┘  └───┬────┘  └────┬─────┘  └──┬──┘  └──┬──┘ │
│      │         │            │            │        │     │
│      └─────────┴─────┬──────┴────────────┴────────┘     │
│                      │                                   │
│                      ▼                                   │
│            ┌──────────────────┐                          │
│            │  Identity        │                          │
│            │  Resolution      │                          │
│            │  Engine          │                          │
│            └────────┬─────────┘                          │
│                     │                                    │
│                     ▼                                    │
│            ┌──────────────────┐                          │
│            │  Unified Citizen │                          │
│            │  Profile         │                          │
│            │  (Single Record) │                          │
│            └────────┬─────────┘                          │
│                     │                                    │
│                     ▼                                    │
│            ┌──────────────────┐                          │
│            │  Session Manager │                          │
│            │  (JWT + Cookie)  │                          │
│            └─────────────────┘                          │
└─────────────────────────────────────────────────────────┘
```

---

### 4.2 Account Linking Logic

เมื่อประชาชน Login ด้วย provider ใหม่ ระบบจะพยายามเชื่อมโยงบัญชี (Account Linking) โดยอัตโนมัติ

```
ประชาชน Login ด้วย Provider ใหม่
                │
                ▼
       ┌────────────────────┐
       │  ตรวจสอบ: Provider │
       │  ID มีในระบบหรือไม่ │
       └────────┬───────────┘
                │
        ┌───────┴───────┐
        │               │
    [มีแล้ว]        [ยังไม่มี]
        │               │
   Login ปกติ      ตรวจสอบ: มี email
   ใช้ Profile      ตรงกับบัญชีอื่นไหม?
   เดิม                 │
                ┌───────┴───────┐
                │               │
           [email ตรง]     [ไม่ตรง]
                │               │
        ┌───────────────┐   สร้าง Profile ใหม่
        │ แสดง Prompt:  │   + บันทึก Provider ID
        │               │
        │ "พบบัญชีที่ใช้  │
        │  อีเมลนี้แล้ว   │
        │  ต้องการ       │
        │  เชื่อมบัญชี    │
        │  หรือไม่?"     │
        └───────┬───────┘
                │
        ┌───────┴───────┐
        │               │
     [เชื่อม]       [ไม่เชื่อม]
        │               │
   Verify ตัวตน     สร้าง Profile ใหม่
   ผ่าน email      (แยกบัญชี)
   OTP ของบัญชีเดิม
        │
   เพิ่ม Provider ID
   เข้า Profile เดิม
   Merge ข้อมูล
```

**Account Linking Rules:**
1. **Auto-link by email:** ถ้า email จาก Provider ใหม่ตรงกับ email ที่ verified แล้วในระบบ → แนะนำให้เชื่อม
2. **Manual link:** ประชาชนสามารถเชื่อม provider เพิ่มเติมผ่านหน้า Settings
3. **Conflict resolution:** ถ้าข้อมูล (เช่น ชื่อ) ขัดแย้งกัน → ใช้ข้อมูลจาก provider ล่าสุด + แจ้งให้ประชาชนยืนยัน
4. **Unlink:** ประชาชนสามารถยกเลิกการเชื่อมได้ ยกเว้น provider สุดท้าย (ต้องมีอย่างน้อย 1 วิธี login)

---

### 4.3 Session Management

```
┌──────────────────────────────────────────────────┐
│              SESSION MANAGEMENT                   │
│                                                  │
│  Token Type:  JWT (JSON Web Token)               │
│  Storage:     httpOnly Secure Cookie             │
│  Duration:    Access Token = 15 นาที              │
│               Refresh Token = 30 วัน              │
│                                                  │
│  ┌──────────────────────────────────────┐        │
│  │         Token Payload                │        │
│  │  {                                   │        │
│  │    sub: "citizen_uuid",              │        │
│  │    type: "citizen",                  │        │
│  │    providers: ["line","google"],      │        │
│  │    iat: 1742108400,                  │        │
│  │    exp: 1742109300,                  │        │
│  │    jti: "unique_token_id"            │        │
│  │  }                                   │        │
│  └──────────────────────────────────────┘        │
└──────────────────────────────────────────────────┘
```

---

### 4.4 Token Refresh Flow

```
Client (Browser) ──▶ API Request
                         │
                    ┌────┴────┐
                    │ Access  │
                    │ Token   │
                    │ Valid?  │
                    └────┬────┘
                         │
                 ┌───────┴───────┐
                 │               │
              [Valid]        [Expired]
                 │               │
            Process          ┌───┴────┐
            Request          │Refresh │
                             │Token   │
                             │Valid?  │
                             └───┬────┘
                                 │
                         ┌───────┴───────┐
                         │               │
                      [Valid]        [Expired]
                         │               │
                    Issue New        Redirect to
                    Access Token     Login Page
                    + Continue       (Session Ended)
                    Request
                         │
                    Set New Cookie
                    (httpOnly, Secure,
                     SameSite=Lax)
```

---

## 5. 2FA Flow (Two-Factor Authentication)

### 5.1 เมื่อไหร่ที่ต้องใช้ 2FA

2FA ใช้สำหรับ sensitive operations เท่านั้น ไม่ใช่ทุกครั้งที่ login (เพื่อไม่ให้กระทบ UX)

```
┌─────────────────────────────────────────────────────┐
│           OPERATIONS ที่ TRIGGER 2FA                 │
│                                                     │
│  🔴 High Security (บังคับ 2FA):                      │
│  ├── แก้ไขข้อมูลส่วนบุคคลสำคัญ (เลขบัตร ปชช.)       │
│  ├── เปลี่ยนเบอร์โทรศัพท์                             │
│  ├── เปลี่ยนอีเมล                                    │
│  ├── ลบบัญชี (Delete Account)                        │
│  ├── ยกเลิกการเชื่อม Provider (Unlink)               │
│  └── ยื่นคำร้อง E-Service ที่มีความสำคัญสูง           │
│                                                     │
│  🟡 Medium Security (แนะนำ 2FA, ข้ามได้):             │
│  ├── แก้ไขชื่อ-นามสกุล                               │
│  ├── แก้ไขที่อยู่                                     │
│  └── ดูประวัติการใช้บริการทั้งหมด                       │
│                                                     │
│  🟢 Low Security (ไม่ต้อง 2FA):                      │
│  ├── ดูข้อมูลทั่วไป                                   │
│  ├── Bookmark ข่าว                                   │
│  ├── ส่งข้อความ                                      │
│  └── ใช้ AI Chat                                     │
└─────────────────────────────────────────────────────┘
```

---

### 5.2 2FA Methods

```
Method 1: SMS OTP
─────────────────
ประชาชน ──▶ ทำ Sensitive Operation
                │
                ▼
        ┌──────────────────┐
        │  ระบบส่ง OTP ไปที่ │
        │  เบอร์โทรที่ลงทะเบียน│
        │  08x-xxx-xx78    │
        │  (masked)        │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  กรอก OTP 6 หลัก  │
        │  ภายใน 5 นาที     │
        │  ลองได้สูงสุด 5 ครั้ง│
        └────────┬─────────┘
                 │
        ┌────────┴────────┐
        │                 │
    [ถูกต้อง]          [ผิด/หมดเวลา]
        │                 │
   ดำเนินการต่อ      แจ้งเตือน + ลองใหม่
                     (ถ้าเกิน 5 ครั้ง → lock 30 min)


Method 2: Email OTP
────────────────────
(เหมือน SMS OTP แต่ส่งไปที่ email)
OTP TTL: 10 นาที
Max attempts: 5 ครั้ง
```

---

### 5.3 2FA as Optional Security Enhancement

```
ประชาชน ──▶ หน้า Security Settings
                │
                ▼
        ┌──────────────────────────┐
        │  Two-Factor Authentication│
        │                          │
        │  สถานะ: [ปิด] / [เปิด]    │
        │                          │
        │  [เปิดใช้งาน 2FA]         │
        └────────┬─────────────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  เลือกวิธี 2FA:    │
        │                  │
        │  ○ SMS OTP       │
        │    (เบอร์: 08x...) │
        │                  │
        │  ○ Email OTP     │
        │    (email: s...) │
        └────────┬─────────┘
                 │
                 ▼
        ยืนยันด้วย OTP ที่เลือก
                 │
                 ▼
        เปิดใช้งาน 2FA สำเร็จ
        + แสดง Recovery Codes (สำรอง)
```

---

## 6. PDPA Compliance Flow

### พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562

---

### 6.1 Consent Collection Flow

```
ประชาชน ──▶ ครั้งแรกที่เข้าเว็บไซต์
                │
                ▼
        ┌──────────────────────────────────────┐
        │         COOKIE CONSENT BANNER         │
        │                                      │
        │  เว็บไซต์นี้ใช้คุกกี้เพื่อพัฒนาประสบการณ์ │
        │  การใช้งาน                             │
        │                                      │
        │  ○ คุกกี้ที่จำเป็น (ปิดไม่ได้)           │
        │  ○ คุกกี้วิเคราะห์ (Analytics)          │
        │  ○ คุกกี้การตลาด (Marketing)           │
        │                                      │
        │  [ยอมรับทั้งหมด]  [ตั้งค่า]  [ปฏิเสธ]   │
        └────────────────────┬─────────────────┘
                             │
                             ▼
                    บันทึก Consent Record
                    {
                      consentType: "cookie",
                      categories: ["necessary","analytics"],
                      timestamp: "2026-03-16T...",
                      ipAddress: "xxx.xxx.xxx.xxx",
                      userAgent: "...",
                      version: "1.0"
                    }

ประชาชน ──▶ Login ครั้งแรก (ไม่ว่าวิธีใด)
                │
                ▼
        ┌──────────────────────────────────────┐
        │         PDPA CONSENT FORM             │
        │                                      │
        │  นโยบายคุ้มครองข้อมูลส่วนบุคคล         │
        │  เทศบาล xxxxxxx                       │
        │                                      │
        │  ข้อมูลที่เก็บรวบรวม:                    │
        │  ☑ ข้อมูลจาก Social Login              │
        │    (ชื่อ, อีเมล, รูปโปรไฟล์)            │
        │  ☑ ข้อมูลการใช้บริการ                    │
        │    (ประวัติ, คำร้อง, ร้องเรียน)          │
        │  ☑ ข้อมูลการติดต่อ                      │
        │    (เบอร์โทร, อีเมล, ที่อยู่)            │
        │                                      │
        │  วัตถุประสงค์:                          │
        │  ☑ ให้บริการประชาชน (จำเป็น)            │
        │  ☐ ส่งข่าวสาร/ประกาศ (ทางเลือก)        │
        │  ☐ วิเคราะห์เพื่อปรับปรุงบริการ (ทางเลือก)│
        │                                      │
        │  [อ่านนโยบายฉบับเต็ม]                   │
        │                                      │
        │  [ยอมรับและดำเนินการต่อ]                 │
        └────────────────────┬─────────────────┘
                             │
                             ▼
                    บันทึก Consent Record (ละเอียด)
```

---

### 6.2 Data Subject Rights Implementation

ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล มาตรา 30-42

```
┌──────────────────────────────────────────────────────────┐
│              สิทธิของเจ้าของข้อมูล (Data Subject Rights)  │
│                                                          │
│  1. สิทธิในการเข้าถึง (Right of Access) — มาตรา 30       │
│     └─ หน้า Profile → "ดูข้อมูลของฉัน" → Export JSON/PDF │
│                                                          │
│  2. สิทธิในการแก้ไข (Right to Rectification) — มาตรา 36  │
│     └─ หน้า Profile → "แก้ไขข้อมูล" (ผ่าน 2FA)          │
│                                                          │
│  3. สิทธิในการลบ (Right to Erasure) — มาตรา 33           │
│     └─ หน้า Settings → "ลบบัญชี" (ผ่าน 2FA)             │
│     └─ ข้อยกเว้น: ข้อมูลที่ต้องเก็บตามกฎหมาย             │
│                                                          │
│  4. สิทธิในการระงับ (Right to Restrict) — มาตรา 34       │
│     └─ หน้า Settings → "ระงับการใช้ข้อมูล"                │
│                                                          │
│  5. สิทธิในการโอนย้าย (Right to Portability) — มาตรา 31  │
│     └─ หน้า Profile → "ส่งออกข้อมูล" → JSON/CSV         │
│                                                          │
│  6. สิทธิในการคัดค้าน (Right to Object) — มาตรา 32       │
│     └─ หน้า Settings → "ตั้งค่าความเป็นส่วนตัว"           │
│     └─ ปิดการใช้ข้อมูลเพื่อการตลาด/วิเคราะห์             │
│                                                          │
│  7. สิทธิในการถอนความยินยอม (Withdraw Consent) — มาตรา 19│
│     └─ หน้า Settings → "จัดการความยินยอม"                 │
│     └─ ถอนได้ทุกเมื่อ ไม่กระทบสิทธิ์ที่ได้รับก่อนหน้า      │
└──────────────────────────────────────────────────────────┘
```

**Data Subject Request Flow:**
```
ประชาชน ──▶ ส่งคำร้องสิทธิ (ผ่าน Profile / Contact)
                │
                ▼
        ┌──────────────────┐
        │  ยืนยันตัวตน      │
        │  (Login + 2FA)   │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  บันทึกคำร้อง     │
        │  + แจ้ง DPO      │
        │  (Data Protection│
        │   Officer)       │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  DPO ตรวจสอบ     │
        │  ภายใน 30 วัน     │
        │  (ตาม พ.ร.บ.)    │
        └────────┬─────────┘
                 │
        ┌────────┴────────┐
        │                 │
   [อนุมัติ]          [ปฏิเสธ]
        │              (พร้อมเหตุผล)
        │                 │
   ดำเนินการ          แจ้งประชาชน
   + แจ้งผล           + สิทธิอุทธรณ์
```

---

### 6.3 Data Retention Policy

```
┌────────────────────────┬─────────────────┬────────────────────┐
│     ประเภทข้อมูล       │   ระยะเวลาเก็บ   │   เหตุผลทางกฎหมาย  │
├────────────────────────┼─────────────────┼────────────────────┤
│ ข้อมูล Profile         │ ตลอดอายุบัญชี    │ สัญญาการใช้บริการ    │
│                        │ + 1 ปีหลังลบบัญชี │                    │
├────────────────────────┼─────────────────┼────────────────────┤
│ ข้อมูล E-Service       │ 10 ปี           │ พ.ร.บ. จัดเก็บเอกสาร│
│ (คำร้อง/ใบอนุญาต)      │                 │ ราชการ              │
├────────────────────────┼─────────────────┼────────────────────┤
│ ข้อมูลร้องเรียน         │ 5 ปี            │ พ.ร.บ. ร้องเรียน     │
├────────────────────────┼─────────────────┼────────────────────┤
│ Log การเข้าสู่ระบบ      │ 90 วัน          │ พ.ร.บ. คอมพิวเตอร์  │
├────────────────────────┼─────────────────┼────────────────────┤
│ ข้อมูล Analytics       │ 2 ปี            │ Legitimate Interest │
├────────────────────────┼─────────────────┼────────────────────┤
│ Chat History           │ 1 ปี            │ ปรับปรุงบริการ       │
├────────────────────────┼─────────────────┼────────────────────┤
│ Cookie Consent Records │ 3 ปี            │ หลักฐานความยินยอม    │
├────────────────────────┼─────────────────┼────────────────────┤
│ Audit Logs             │ 5 ปี            │ ตรวจสอบภายใน        │
└────────────────────────┴─────────────────┴────────────────────┘
```

---

### 6.4 Data Deletion / Anonymization Flow

```
ประชาชน ──▶ ร้องขอลบบัญชี
                │
                ▼
        ┌──────────────────┐
        │  ยืนยันตัวตน 2FA  │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │  แจ้งเตือน:       │
        │  "ข้อมูลต่อไปนี้   │
        │   จะถูกลบ..."     │
        │                  │
        │  ข้อมูลที่เก็บต่อ:  │
        │  "ข้อมูล E-Service │
        │   จะถูก           │
        │   anonymize       │
        │   แต่เก็บไว้ตาม   │
        │   กฎหมาย"        │
        └────────┬─────────┘
                 │
           ยืนยันลบ
                 │
                 ▼
        ┌──────────────────────────────┐
        │  Deletion Process:            │
        │                              │
        │  1. Soft delete Profile       │
        │     (grace period 30 วัน)     │
        │                              │
        │  2. ส่ง email/SMS ยืนยัน      │
        │     "ยกเลิกได้ภายใน 30 วัน"    │
        │                              │
        │  3. หลัง 30 วัน:              │
        │     a. ลบ Personal Data       │
        │     b. Unlink all Providers   │
        │     c. Anonymize E-Service    │
        │        records (แทนที่ชื่อ     │
        │        ด้วย hash)             │
        │     d. ลบ Chat History        │
        │     e. ลบ Bookmarks           │
        │     f. ลบ Search History      │
        │     g. เก็บ Audit Log         │
        │        (anonymized)           │
        └──────────────────────────────┘
```

---

### 6.5 Audit Trail

```
ทุก action ที่เกี่ยวกับข้อมูลส่วนบุคคลจะถูกบันทึกใน Audit Log

AuditLog {
  id            UUID
  citizenId     UUID?          (null ถ้า anonymized)
  action        String         (CREATE, READ, UPDATE, DELETE,
                                EXPORT, CONSENT_GRANT,
                                CONSENT_WITHDRAW, LOGIN, LOGOUT)
  resource      String         (profile, complaint, e-service, etc.)
  resourceId    String?
  details       JSON           (what changed, old/new values — masked)
  ipAddress     String
  userAgent     String
  timestamp     DateTime
  performedBy   String         (citizen / admin / system)
}

ตัวอย่าง:
{
  action: "UPDATE",
  resource: "profile",
  details: {
    field: "phone",
    old: "08x-xxx-xx34",    ← masked
    new: "08x-xxx-xx78",    ← masked
    twoFactorVerified: true
  },
  performedBy: "citizen"
}
```

---

## 7. CDP Integration Roadmap

### แผนงาน City Data Platform

CDP (City Data Platform) คือแพลตฟอร์มข้อมูลกลางของเทศบาล ที่รวมข้อมูลจากทุกระบบ เพื่อให้บริการประชาชนได้อย่างชาญฉลาด

---

### Phase 1: Basic Citizen Profiles + Activity Tracking (ปัจจุบัน)

**ระยะเวลา:** เดือนที่ 1-3
**เป้าหมาย:** สร้างฐานข้อมูลประชาชนจากการ Login และ Track พฤติกรรม

```
┌─────────────────────────────────────────────────┐
│                   PHASE 1                        │
│          Basic Citizen Data Platform              │
│                                                 │
│  ┌─────────────┐     ┌──────────────────┐       │
│  │  Auth System │────▶│  Citizen Profile  │       │
│  │  (LINE/Google│     │  Database         │       │
│  │  /FB/OTP)   │     │                  │       │
│  └─────────────┘     │  - Identity      │       │
│                      │  - Contact Info   │       │
│  ┌─────────────┐     │  - Preferences   │       │
│  │  Activity   │────▶│  - Activity Logs │       │
│  │  Tracking   │     │                  │       │
│  │  (Page views│     └──────────────────┘       │
│  │  Downloads  │              │                 │
│  │  Bookmarks) │              ▼                 │
│  └─────────────┘     ┌──────────────────┐       │
│                      │  Basic Dashboard  │       │
│                      │  - จำนวนประชาชน    │       │
│                      │  - Login stats   │       │
│                      │  - Popular pages │       │
│                      └──────────────────┘       │
└─────────────────────────────────────────────────┘

Deliverables:
├── Citizen Profile schema + database
├── Auth system (5 providers)
├── Activity tracking middleware
├── Basic admin dashboard (citizen count, login stats)
└── PDPA consent management
```

---

### Phase 2: Citizen Segmentation + Targeted Communications

**ระยะเวลา:** เดือนที่ 4-6
**เป้าหมาย:** แบ่งกลุ่มประชาชนและสื่อสารตรงกลุ่มเป้าหมาย

```
┌─────────────────────────────────────────────────┐
│                   PHASE 2                        │
│      Segmentation + Targeted Communications      │
│                                                 │
│  ┌──────────────────┐                           │
│  │  Citizen Profile  │                           │
│  │  + Activity Data  │                           │
│  └────────┬─────────┘                           │
│           │                                     │
│           ▼                                     │
│  ┌──────────────────┐    ┌──────────────────┐   │
│  │  Segmentation    │    │  Communication   │   │
│  │  Engine          │───▶│  Engine          │   │
│  │                  │    │                  │   │
│  │  กลุ่มตัวอย่าง:   │    │  Channels:       │   │
│  │  - ผู้สูงอายุ     │    │  - LINE Push     │   │
│  │  - ผู้ประกอบการ   │    │  - SMS          │   │
│  │  - นักเรียน/นศ.  │    │  - Email         │   │
│  │  - ผู้ใช้บ่อย     │    │  - In-app        │   │
│  │  - ผู้ใช้ใหม่     │    │                  │   │
│  └──────────────────┘    └──────────────────┘   │
│                                                 │
│  ตัวอย่าง Use Cases:                             │
│  ├── แจ้งเตือนชำระภาษี → กลุ่มผู้ประกอบการ        │
│  ├── ข่าวสวัสดิการผู้สูงอายุ → กลุ่มผู้สูงอายุ     │
│  ├── ประกาศรับสมัครงาน → กลุ่มวัยทำงาน           │
│  └── แจ้งปิดถนน → กลุ่มพื้นที่ที่ได้รับผลกระทบ     │
└─────────────────────────────────────────────────┘

Deliverables:
├── Segmentation engine (rule-based)
├── Targeted push notification system
├── Communication templates
├── A/B testing framework for messages
└── Unsubscribe management
```

---

### Phase 3: Predictive Analytics + Service Optimization

**ระยะเวลา:** เดือนที่ 7-12
**เป้าหมาย:** ใช้ AI/ML วิเคราะห์ข้อมูลเพื่อพัฒนาบริการ

```
┌─────────────────────────────────────────────────┐
│                   PHASE 3                        │
│       Predictive Analytics + Optimization        │
│                                                 │
│  ┌──────────────────┐                           │
│  │  CDP Data Lake    │                           │
│  │  (All citizen     │                           │
│  │   data + activity)│                           │
│  └────────┬─────────┘                           │
│           │                                     │
│           ▼                                     │
│  ┌──────────────────┐    ┌──────────────────┐   │
│  │  ML Models        │    │  Optimization    │   │
│  │                  │    │  Engine          │   │
│  │  - ทำนายความ     │    │                  │   │
│  │    ต้องการบริการ   │───▶│  - จัดลำดับ      │   │
│  │  - ทำนายปัญหา    │    │    ความสำคัญ      │   │
│  │    ร้องเรียน       │    │  - จัดสรร        │   │
│  │  - ทำนายการใช้    │    │    ทรัพยากร       │   │
│  │    ทรัพยากร       │    │  - แนะนำ         │   │
│  │  - Churn          │    │    บริการ         │   │
│  │    prediction     │    │                  │   │
│  └──────────────────┘    └──────────────────┘   │
│                                                 │
│  ตัวอย่าง:                                       │
│  ├── ทำนายจำนวนคำร้องเดือนหน้า → จัดคนรองรับ     │
│  ├── ทำนายพื้นที่ที่จะมีร้องเรียนน้ำท่วม → เตรียมการ │
│  ├── แนะนำบริการที่ประชาชนอาจต้องการ             │
│  └── ตรวจจับ anomaly ในการใช้บริการ              │
└─────────────────────────────────────────────────┘

Deliverables:
├── Data pipeline (ETL)
├── ML model training infrastructure
├── Prediction dashboard
├── Service recommendation engine
└── Anomaly detection alerts
```

---

### Phase 4: Cross-Department Data Integration

**ระยะเวลา:** ปีที่ 2 (เดือนที่ 13-18)
**เป้าหมาย:** เชื่อมข้อมูลข้ามหน่วยงานภายในเทศบาล

```
┌─────────────────────────────────────────────────────────┐
│                       PHASE 4                            │
│           Cross-Department Integration                   │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ สำนักปลัด │  │ กองคลัง   │  │ กองช่าง   │  │กองสาธาฯ │ │
│  │          │  │          │  │          │  │         │ │
│  │ ทะเบียน   │  │ ภาษี     │  │ ใบอนุญาต  │  │ สาธารณสุข│ │
│  │ ร้องเรียน  │  │ รายรับ    │  │ ก่อสร้าง   │  │ ขยะ     │ │
│  └─────┬────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│        │            │            │              │       │
│        └────────────┴─────┬──────┴──────────────┘       │
│                           │                             │
│                           ▼                             │
│                ┌──────────────────┐                     │
│                │  Data Integration │                     │
│                │  Hub (API Gateway)│                     │
│                └────────┬─────────┘                     │
│                         │                               │
│                         ▼                               │
│                ┌──────────────────┐                     │
│                │  Unified Citizen  │                     │
│                │  360° View       │                     │
│                │                  │                     │
│                │  ประชาชนคนเดียว    │                     │
│                │  ดูข้อมูลทั้งหมด    │                     │
│                │  จากทุกหน่วยงาน    │                     │
│                └──────────────────┘                     │
│                                                         │
│  ตัวอย่าง: ประชาชนยื่นขอใบอนุญาตก่อสร้าง                  │
│  → ระบบตรวจสอบอัตโนมัติ: ภาษีค้างชำระ? ที่ดินถูกต้อง?     │
│  → One-stop service ไม่ต้องไปหลายแผนก                    │
└─────────────────────────────────────────────────────────┘

Deliverables:
├── Department API Gateway
├── Data mapping & transformation layer
├── Citizen 360° view dashboard (admin)
├── Citizen portal (ประชาชนดูข้อมูลตนเองข้ามหน่วยงาน)
├── Cross-department workflow automation
└── Data quality monitoring
```

---

### Phase 5: Smart City Dashboard + AI-Driven Insights

**ระยะเวลา:** ปีที่ 2-3 (เดือนที่ 19-36)
**เป้าหมาย:** Dashboard ระดับเมืองและ AI ช่วยตัดสินใจ

```
┌─────────────────────────────────────────────────────────┐
│                       PHASE 5                            │
│          Smart City Dashboard + AI Insights               │
│                                                         │
│  ┌───────────────────────────────────────────────┐      │
│  │              SMART CITY DASHBOARD              │      │
│  │                                               │      │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────────┐ │      │
│  │  │ Real-   │  │ Service  │  │ Citizen      │ │      │
│  │  │ time    │  │ Quality  │  │ Satisfaction │ │      │
│  │  │ Metrics │  │ Index    │  │ Score        │ │      │
│  │  └─────────┘  └──────────┘  └──────────────┘ │      │
│  │                                               │      │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────────┐ │      │
│  │  │ Heatmap │  │ Trend    │  │ AI           │ │      │
│  │  │ ร้องเรียน│  │ Analysis │  │ Predictions  │ │      │
│  │  └─────────┘  └──────────┘  └──────────────┘ │      │
│  └───────────────────────────────────────────────┘      │
│                                                         │
│  AI-Driven Insights:                                    │
│  ├── "ร้องเรียนเรื่องน้ำท่วมเพิ่มขึ้น 300% ในโซน A     │
│  │    → แนะนำ: ส่งทีมสำรวจท่อระบายน้ำ"                  │
│  ├── "ประชาชน 45% ที่ขอใบอนุญาตก่อสร้างจะมาต่อ         │
│  │    ใบอนุญาตประกอบการภายใน 6 เดือน                     │
│  │    → แนะนำ: Proactive notification"                  │
│  ├── "ช่วงเดือน มี.ค.-เม.ย. มีการยื่นชำระภาษีสูงสุด     │
│  │    → แนะนำ: เพิ่มเจ้าหน้าที่ + ขยายเวลาบริการ"       │
│  └── "ความพึงพอใจลดลง 15% หลังเปลี่ยนกระบวนการ X        │
│       → แนะนำ: ทบทวนกระบวนการ"                          │
│                                                         │
│  Public Dashboard (เปิดให้ประชาชนดู):                     │
│  ├── สถิติบริการ (จำนวนคำร้อง, เวลาเฉลี่ย)               │
│  ├── งบประมาณ (รายรับ-รายจ่าย)                           │
│  ├── คุณภาพชีวิต Index                                   │
│  └── Feedback / Rating                                  │
└─────────────────────────────────────────────────────────┘

Deliverables:
├── Smart City Dashboard (executive + public)
├── AI recommendation engine for administrators
├── Citizen satisfaction measurement system
├── Open data portal
├── Performance benchmarking (เทียบกับเทศบาลอื่น)
└── Annual data report generator
```

---

### CDP Roadmap Timeline

```
ปีที่ 1                              ปีที่ 2                    ปีที่ 3
│                                    │                         │
├──Phase 1──┤──Phase 2──┤──Phase 3───┤──Phase 4──┤──Phase 5────┤
│ เดือน 1-3 │ เดือน 4-6 │ เดือน 7-12│ เดือน13-18│ เดือน 19-36 │
│           │           │           │           │             │
│ Profiles  │ Segment   │ ML/AI     │ Cross-Dept│ Smart City  │
│ + Track   │ + Comms   │ + Predict │ + 360°    │ + Dashboard │
│           │           │           │           │             │
│ ████████  │ ████████  │ ██████████│ ██████████│ █████████████│
```

---

## 8. Security Considerations

### การรักษาความปลอดภัย

---

### 8.1 Token Storage

```
┌──────────────────────────────────────────────────┐
│              TOKEN STORAGE STRATEGY               │
│                                                  │
│  Access Token:                                   │
│  ├── Storage: httpOnly Cookie                    │
│  ├── Flags: Secure, SameSite=Lax, Path=/         │
│  ├── TTL: 15 minutes                            │
│  ├── ❌ ไม่เก็บใน localStorage (XSS vulnerable)  │
│  └── ❌ ไม่เก็บใน sessionStorage                  │
│                                                  │
│  Refresh Token:                                  │
│  ├── Storage: httpOnly Cookie (separate)         │
│  ├── Flags: Secure, SameSite=Strict, Path=/api/  │
│  │          auth/refresh                         │
│  ├── TTL: 30 days                                │
│  ├── Rotation: ทุกครั้งที่ใช้ refresh จะ issue     │
│  │            token ใหม่ + invalidate เก่า        │
│  └── Family detection: ถ้า reuse detected        │
│                        → revoke ทั้ง family       │
│                                                  │
│  OTP Codes:                                      │
│  ├── Storage: Server-side only (Redis/DB)        │
│  ├── Hashed: bcrypt before storing               │
│  ├── TTL: 5 min (SMS) / 10 min (Email)          │
│  └── Single use: invalidate หลังใช้               │
└──────────────────────────────────────────────────┘
```

---

### 8.2 CSRF Protection

```
┌──────────────────────────────────────────────────┐
│               CSRF PROTECTION                     │
│                                                  │
│  Strategy: Double Submit Cookie + SameSite        │
│                                                  │
│  1. SameSite Cookie Attribute:                   │
│     ├── Access Token: SameSite=Lax               │
│     │   (ป้องกัน CSRF จาก cross-site POST)        │
│     └── Refresh Token: SameSite=Strict           │
│         (ป้องกัน CSRF ทุกรูปแบบ)                   │
│                                                  │
│  2. CSRF Token (สำหรับ State-Changing Actions):   │
│     ├── Generate: crypto.randomUUID()             │
│     ├── Store: ใน session (server-side)           │
│     ├── Send: ใน custom header                   │
│     │         X-CSRF-Token: <token>              │
│     └── Verify: เทียบ header กับ session          │
│                                                  │
│  3. OAuth State Parameter:                       │
│     ├── Generate: random state ก่อน redirect     │
│     ├── Store: ใน httpOnly cookie (short TTL)    │
│     ├── Verify: เทียบ state จาก callback         │
│     └── ป้องกัน: CSRF + Login CSRF attack        │
│                                                  │
│  4. Origin/Referer Check:                        │
│     └── API middleware ตรวจ Origin header         │
│         ต้องตรงกับ allowed origins               │
└──────────────────────────────────────────────────┘
```

---

### 8.3 Rate Limiting on OTP

```
┌──────────────────────────────────────────────────┐
│              OTP RATE LIMITING                    │
│                                                  │
│  Per Phone Number:                               │
│  ├── Max OTP requests: 5 ครั้ง / ชั่วโมง          │
│  ├── Min interval: 60 วินาที ระหว่างครั้ง          │
│  ├── Max verify attempts: 5 ครั้ง / OTP          │
│  └── Cooldown after max: 30 นาที                 │
│                                                  │
│  Per Email:                                      │
│  ├── Max OTP requests: 5 ครั้ง / ชั่วโมง          │
│  ├── Min interval: 60 วินาที ระหว่างครั้ง          │
│  ├── Max verify attempts: 5 ครั้ง / OTP          │
│  └── Cooldown after max: 30 นาที                 │
│                                                  │
│  Per IP Address:                                 │
│  ├── Max OTP requests: 10 ครั้ง / ชั่วโมง         │
│  ├── Applies to: ALL phone+email combined        │
│  └── Cooldown: 1 ชั่วโมง                         │
│                                                  │
│  Global:                                         │
│  ├── Max SMS/hour: 1000 (ป้องกัน SMS bombing)    │
│  ├── Max Email/hour: 5000                        │
│  └── Alert: แจ้ง admin เมื่อถึง 80% threshold    │
│                                                  │
│  Implementation:                                 │
│  ├── Redis: sliding window counter               │
│  ├── Key format: ratelimit:otp:{type}:{value}    │
│  └── Response: HTTP 429 Too Many Requests        │
│       + Retry-After header                       │
└──────────────────────────────────────────────────┘
```

---

### 8.4 Brute Force Protection

```
┌──────────────────────────────────────────────────┐
│            BRUTE FORCE PROTECTION                 │
│                                                  │
│  Login Attempts:                                 │
│  ├── Track: failed login per account             │
│  ├── Threshold: 10 failed attempts               │
│  ├── Action: Temporary lock (30 min)             │
│  ├── Progressive delay:                          │
│  │   ├── 1-3 attempts: ไม่มี delay               │
│  │   ├── 4-6 attempts: 5 sec delay               │
│  │   ├── 7-9 attempts: 15 sec delay              │
│  │   └── 10+: Account locked 30 min             │
│  └── Notification: แจ้งเจ้าของบัญชี              │
│                                                  │
│  OTP Verification:                               │
│  ├── Track: failed OTP per session               │
│  ├── Max attempts: 5 per OTP                     │
│  ├── Action: Invalidate OTP + require new        │
│  └── After 3 consecutive OTP failures:           │
│      Lock OTP for 30 minutes                     │
│                                                  │
│  API Rate Limiting:                              │
│  ├── General API: 100 req/min per IP             │
│  ├── Auth endpoints: 20 req/min per IP           │
│  ├── E-Service: 30 req/min per citizen           │
│  └── Implementation: Token bucket algorithm      │
│                                                  │
│  Bot Detection:                                  │
│  ├── CAPTCHA: หลังจาก failed attempt ครั้งที่ 3   │
│  │   (hCaptcha / Turnstile — GDPR compliant)     │
│  ├── Fingerprinting: device + browser info       │
│  └── Anomaly: geographic impossibility check     │
│      (login จาก กรุงเทพ แล้ว 5 นาทีต่อมา         │
│       จาก ต่างประเทศ → flag + require 2FA)        │
└──────────────────────────────────────────────────┘
```

---

### 8.5 Data Encryption at Rest

```
┌──────────────────────────────────────────────────┐
│           DATA ENCRYPTION AT REST                 │
│                                                  │
│  Database Level:                                 │
│  ├── Engine: PostgreSQL with TDE                 │
│  │   (Transparent Data Encryption)               │
│  ├── Algorithm: AES-256                          │
│  └── Key management: Cloud KMS                   │
│      (AWS KMS / GCP KMS / Azure Key Vault)       │
│                                                  │
│  Application Level (Sensitive Fields):           │
│  ├── เลขบัตรประชาชน (National ID):               │
│  │   ├── Encryption: AES-256-GCM                 │
│  │   ├── Key: Per-tenant envelope encryption     │
│  │   ├── Display: Masked (x-xxxx-xxxxx-xx-x)    │
│  │   └── Search: Encrypted index (blind index)   │
│  │                                               │
│  ├── เบอร์โทรศัพท์ (Phone):                       │
│  │   ├── Encryption: AES-256-GCM                 │
│  │   ├── Display: Masked (08x-xxx-xx78)          │
│  │   └── Search: Last 4 digits hash              │
│  │                                               │
│  ├── OTP Codes:                                  │
│  │   ├── Hash: bcrypt (cost factor 12)           │
│  │   └── Never stored in plaintext               │
│  │                                               │
│  └── ที่อยู่ (Address):                           │
│      ├── Encryption: AES-256-GCM                 │
│      └── Searchable: Province/District only      │
│                                                  │
│  File Storage:                                   │
│  ├── เอกสารแนบ: Encrypted at rest (S3 SSE-KMS)   │
│  ├── รูปภาพร้องเรียน: Encrypted + access control │
│  └── Export files: Encrypted + TTL (auto-delete) │
│                                                  │
│  Backup:                                         │
│  ├── Database backups: Encrypted                 │
│  ├── Retention: 30 days                          │
│  └── Cross-region: Optional (for DR)             │
│                                                  │
│  Transport:                                      │
│  ├── TLS 1.3 (HTTPS only)                       │
│  ├── HSTS enabled                                │
│  ├── Certificate pinning (mobile apps)           │
│  └── API: mTLS for service-to-service            │
└──────────────────────────────────────────────────┘
```

---

### 8.6 Security Headers

```
ทุก Response จะมี Security Headers:

Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}';
    style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;
    connect-src 'self' https://api.line.me https://accounts.google.com;
    frame-ancestors 'none'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 0
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```

---

## สรุป (Summary)

```
┌─────────────────────────────────────────────────────────────┐
│                     ARCHITECTURE OVERVIEW                    │
│                                                             │
│                      ┌─────────────┐                        │
│                      │  ประชาชน     │                        │
│                      │  (Citizen)  │                        │
│                      └──────┬──────┘                        │
│                             │                               │
│                      ┌──────▼──────┐                        │
│                      │  Browser /  │                        │
│                      │  LINE App   │                        │
│                      └──────┬──────┘                        │
│                             │ HTTPS                         │
│                      ┌──────▼──────┐                        │
│                      │  Next.js    │                        │
│                      │  Frontend   │                        │
│                      └──────┬──────┘                        │
│                             │                               │
│              ┌──────────────┼──────────────┐                │
│              │              │              │                │
│       ┌──────▼────┐  ┌─────▼─────┐  ┌────▼──────┐         │
│       │ Auth API  │  │ Content   │  │ E-Service │         │
│       │           │  │ API       │  │ API       │         │
│       │ - LINE    │  │ - News    │  │ - Forms   │         │
│       │ - Google  │  │ - Announce│  │ - Status  │         │
│       │ - Facebook│  │ - Download│  │ - History │         │
│       │ - Phone   │  │ - Gallery │  │           │         │
│       │ - Email   │  │ - Search  │  │           │         │
│       └──────┬────┘  └─────┬─────┘  └────┬──────┘         │
│              │             │             │                  │
│              └─────────────┼─────────────┘                  │
│                            │                                │
│                     ┌──────▼──────┐                         │
│                     │  Prisma ORM │                         │
│                     └──────┬──────┘                         │
│                            │                                │
│              ┌─────────────┼─────────────┐                  │
│              │             │             │                  │
│       ┌──────▼────┐  ┌────▼─────┐  ┌───▼──────┐           │
│       │PostgreSQL │  │  Redis   │  │  S3/Blob │           │
│       │(Encrypted)│  │(Sessions │  │(Files    │           │
│       │           │  │ OTP,Rate)│  │Encrypted)│           │
│       └───────────┘  └──────────┘  └──────────┘           │
│                                                             │
│                     ┌──────────────┐                        │
│                     │   CDP Layer  │                        │
│                     │  (Phase 1-5) │                        │
│                     └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

---

**เอกสารนี้ครอบคลุม:**
- 12 หน้าเว็บไซต์ พร้อม Auth Requirement และ User Flow ของแต่ละหน้า
- 5 วิธีการ Login พร้อม Flow Diagram และ Data Collected
- 16 Data Collection Touchpoints พร้อม PDPA categorization
- SSO + Account Linking logic
- 2FA สำหรับ Sensitive Operations
- PDPA Compliance ครบถ้วน (Consent, Rights, Retention, Deletion, Audit)
- CDP Roadmap 5 เฟส (36 เดือน)
- Security: Token Storage, CSRF, Rate Limiting, Brute Force, Encryption

> ปรับปรุงล่าสุด: 2026-03-16
