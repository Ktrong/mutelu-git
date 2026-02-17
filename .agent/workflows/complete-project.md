---
description: ขั้นตอนการพัฒนาโปรเจกต์ Iucrative (แอปพลิเคชันวอลเปเปอร์สายมู)
---

# ขั้นตอนการทำงาน (Workflow)

// turbo-all

1. **การตั้งค่าโครงสร้างพื้นฐาน (Infrastructure & Auth)**
   - ตั้งค่า Supabase สำหรับฐานข้อมูลและการตรวจสอบสิทธิ์ (Authentication)
   - สร้างหน้า Login และ Register (รองรับ Email และ Google)

2. **ระบบเลือกวอลเปเปอร์ตามวันเกิด (Astrology Engine)**
   - สร้างโมเดลข้อมูลสำหรับคู่สีมงคลตามวันเกิดและราศี
   - พัฒนา UI ให้ผู้ใช้กรอกข้อมูล วัน/เดือน/ปี/เวลา เกิด

3. **ระบบปรับแต่งวอลเปเปอร์ (Personalized Editor)**
   - พัฒนาหน้า Canvas สำหรับเลือกธีม (Theme) และใส่ชื่อ/ข้อความมงคล
   - ระบบ Preview บน iPhone Mockup แบบ Real-time

4. **ระบบชำระเงิน (Payments & Credits)**
   - เชื่อมต่อระบบ PromptPay QR Code หรือ Stripe
   - ระบบ Credit สำหรับการดาวน์โหลดภาพความละเอียดสูง (HD/4K)

5. **หน้าหลักและการนำทาง (Main UI & Navigation)**
   - ปรับปรุงหน้า Landing Page ให้สมบูรณ์
   - เพิ่มระบบ Category Grid และ New Products
   - ระบบ Profile และ Dashboard สำหรับดูวอลเปเปอร์ที่ซื้อแล้ว

6. **ระบบจัดการหลังบ้าน (Admin Dashboard)**
   - ระบบอัปโหลดวอลเปเปอร์ใหม่โดย Admin
   - ระบบดูรายงานยอดขายและการใช้งาน
