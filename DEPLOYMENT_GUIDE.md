# คู่มือการติดตั้ง Iucrative บน Shared Hosting (cPanel)

เนื่องจากโปรเจกต์นี้พัฒนาด้วย **Next.js**, **Prisma** และ **Supabase** ขั้นตอนการติดตั้งบน Shared Hosting จะแตกต่างจากเว็บไซต์ PHP ทั่วไป โดยมีขั้นตอนดังนี้:

## 1. การเตรียมความพร้อมของ Hosting
- Hosting ของคุณต้องรองรับ **Node.js** (ส่วนใหญ่จะมีเมนู "Setup Node.js App" ใน cPanel หรือ DirectAdmin)
- เวอร์ชั่น Node.js ที่แนะนำ: **18.x** หรือ **20.x**

## 2. ขั้นตอนการ Build โปรเจกต์ (ทำที่เครื่องตนเอง)
ก่อนอัปโหลด คุณต้องทำการ Build ไฟล์ให้พร้อมใช้งานก่อน:
1. เปิด Terminal ในโฟลเดอร์โปรเจกต์
2. รันคำสั่ง:
   ```bash
   npm run build
   ```
3. เมื่อ Build เสร็จ จะได้โฟลเดอร์ `.next/standalone` ซึ่งเป็นโฟลเดอร์ที่รวมไฟล์จำเป็นสำหรับการรันบน Server ไว้แล้ว

## 3. การเตรียมไฟล์สำหรับอัปโหลด
ให้รวมไฟล์และโฟลเดอร์ต่อไปนี้เข้าด้วยกัน (แนะนำให้ Zip):
- **ไฟล์และโฟลเดอร์ทั้งหมด** ที่อยู่ใน `.next/standalone` (จะมีไฟล์ `server.js` ที่ระบบสร้างให้แล้ว)
- โฟลเดอร์ `public` (ให้ก๊อปปี้จากโปรเจกต์หลัก ไปวางทับในโฟลเดอร์ `standalone/public`)
- โฟลเดอร์ `.next/static` (ให้ก๊อปปี้จากโปรเจกต์หลัก `.next/static` ไปวางใน `standalone/.next/static`)
- ไฟล์ `.env` (ตรวจสอบว่า Database URL เป็นของ Production)
**(สำคัญ) ห้ามใช้ไฟล์ `server.js` เดิมที่อยู่ที่ Root ของโปรเจกต์ เพราะไฟล์ใน standalone ได้รับการปรับแต่งมาเพื่อ Deployment แล้ว**

## 4. การตั้งค่าใน cPanel (Node.js Selector)
1. เข้าเมนู **Setup Node.js App**
2. คลิก **Create Application**
3. ตั้งค่าดังนี้:
   - **Node.js version**: เลือกเวอร์ชั่น 18 หรือ 20
   - **Application mode**: Production
   - **Application root**: พาธที่อัปโหลดไฟล์ขึ้นไป (เช่น `public_html/iucrative`)
   - **Application URL**: โดเมนของคุณ
   - **Application startup file**: `server.js`
4. คลิก **Create** และกด **Run JS script** เพื่อเริ่มทำงาน

## 5. การจัดการฐานข้อมูล (Prisma)
หากมีการอัปเดต Schema ของฐานข้อมูล:
1. ตรวจสอบว่าไฟล์ `.env` มี `DATABASE_URL` ที่ถูกต้อง (Supabase)
2. หาก Hosting มี Terminal ให้รัน:
   ```bash
   npx prisma db push
   ```
   *หมายเหตุ: ส่วนใหญ่แนะนำให้รัน prisma push จากเครื่องตนเองมาที่ DB บน Supabase ก่อนอัปโหลด*

## 6. ตั้งค่า Environment Variables (ใน cPanel)
ในเมนู Node.js App ให้เพิ่มค่าจากไฟล์ `.env` เข้าไปในหัวข้อ **Environment variables** (เช่น NEXT_PUBLIC_SUPABASE_URL, DATABASE_URL ฯลฯ)

---
**หากติดปัญหาในขั้นตอนใด สามารถสอบถามเพิ่มเติมได้ครับ!**
