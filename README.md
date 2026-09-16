# 🏥 ระบบบันทึกและติดตามผลการทดสอบ POCT (Point-of-Care Testing)
**โรงพยาบาลพุทธชินราช พิษณุโลก**

ระบบบริหารจัดการและควบคุมคุณภาพเครื่องตรวจ POCT ที่กระจายอยู่ตามหอผู้ป่วย เพื่อให้เป็นไปตามมาตรฐานงานเทคนิคการแพทย์ (สภาเทคนิคการแพทย์ ฉบับ พ.ศ. 2565) และมาตรฐาน ISO 15189/22870

## ✨ คุณสมบัติหลัก (Key Features)

- 📊 **Dashboard**: สรุปจำนวนเครื่องมือ และแจ้งเตือนรายการที่เลยกำหนดสอบเทียบหรือผล IQC ที่ผิดปกติ
- 🛠️ **ทะเบียนเครื่องมือ (Equipment Registry)**: จัดการข้อมูลเครื่องมือ, คำนวณรอบสอบเทียบ (Calibration) และติดตามสถานะการใช้งาน
- 🧪 **บันทึกควบคุมคุณภาพภายใน (IQC Log)**: บันทึกผล QC รายวัน พร้อมระบบประเมินผลตามกฎ Westgard Rules
- 📉 **การประเมินคุณภาพภายนอก (EQA Log)**: ติดตามผลการทดสอบความชำนาญจากหน่วยงานภายนอก และบันทึกการแก้ไข (Corrective Action)
- 🎓 **ประเมินสมรรถนะผู้ปฏิบัติงาน (Competency)**: บันทึกการฝึกอบรมและประเมินความสามารถของผู้ใช้เครื่องรายปี
- 🔧 **บำรุงรักษาเชิงป้องกัน (Maintenance)**: บันทึกการทำ PM และติดตามกำหนดการบำรุงรักษาเครื่องมือ
- 📋 **ระบบรายงาน (Reports)**: สรุปสถิติประจำเดือน/ไตรมาส เพื่อนำเสนอคณะกรรมการ POCT
- 🔐 **ระบบสิทธิ์ผู้ใช้ (RBAC)**: แบ่งระดับการเข้าถึงข้อมูลตามบทบาท (Admin, Lab Staff, Ward User, Viewer)
- 🔔 **ระบบแจ้งเตือน (In-app Notifications)**: แจ้งเตือนรายการที่ต้องดำเนินการด่วนผ่านกระดิ่งแจ้งเตือน

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend**: [Next.js](https://nextjs.org/) (React), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Google Apps Script](https://developers.google.com/apps-script) (Web App API)
- **Database**: [Google Sheets](https://sheets.google.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 วิธีการติดตั้งและใช้งาน (Setup Guide)

### 1. การตั้งค่า Google Sheets (Database)
สร้าง Google Sheet และสร้างแท็บ (Sheets) ดังนี้:
- `EquipmentMaster`: เก็บข้อมูลทะเบียนเครื่องมือ
- `IQCLog`: เก็บข้อมูลผลควบคุมคุณภาพภายใน
- `EQALog`: เก็บข้อมูลการประเมินคุณภาพภายนอก
- `MaintenanceLog`: เก็บข้อมูลการบำรุงรักษา
- `CompetencyLog`: เก็บข้อมูลการประเมินสมรรถนะ
- `Users`: เก็บข้อมูลผู้ใช้งานและสิทธิ์การเข้าถึง

### 2. การตั้งค่า Backend (Google Apps Script)
1. ไปที่เมนู **Extensions** $\rightarrow$ **Apps Script** ใน Google Sheets ของคุณ
2. คัดลอกโค้ดจากไฟล์ `Code.gs` ในโปรเจกต์นี้ไปวางใน Apps Script
3. กด **Deploy** $\rightarrow$ **New Deployment**
4. เลือกประเภทเป็น **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. คัดลอก **Web App URL** ที่ได้เพื่อนำไปใช้ใน Frontend

### 3. การตั้งค่า Frontend (Next.js)
1. สร้างไฟล์ `.env.local` ใน root directory
2. เพิ่ม URL ของ Apps Script:
   ```env
   NEXT_PUBLIC_APPS_SCRIPT_URL=your_apps_script_url_here
   ```
3. รันโปรเจกต์ในเครื่อง:
   ```bash
   npm install
   npm run dev
   ```

### 4. การ Deploy บน Vercel
1. เชื่อมต่อ GitHub Repository กับ Vercel
2. ในขั้นตอนตั้งค่า ให้เพิ่ม **Environment Variable**:
   - Key: `NEXT_PUBLIC_APPS_SCRIPT_URL`
   - Value: `(URL จากขั้นตอนที่ 2)`
3. กด **Deploy**

## 👥 ระดับสิทธิ์ผู้ใช้งาน (User Roles)

| บทบาท (Role) | ความสามารถ |
| :--- | :--- |
| **Admin** | จัดการได้ทุกส่วนของระบบ, แก้ไขทะเบียนเครื่อง, ดูรายงานทั้งหมด |
| **Lab Staff** | บันทึก IQC/EQA/Competency และจัดการทะเบียนเครื่องมือ |
| **Ward User** | บันทึกผล IQC ของเครื่องในหน่วยงานตนเองได้เท่านั้น |
| **Viewer** | ดูข้อมูลและรายงานได้อย่างเดียว ไม่สามารถแก้ไขข้อมูลได้ |

---
Developed for Buddhachinaraj Phitsanulok Hospital.
