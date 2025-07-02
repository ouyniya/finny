## แผนผังโครงสร้างโดยรวม

```bash
[SearchPage Component]  
│  
├── useSearchFunds() [Custom Hook]  
│   ├── useReducer() จัดการ state ทั้งหมด  
│   ├── เรียก API ด้วย FundSearchService  
│   ├── handleSearch / handlePageChange / clearFilters ฯลฯ  
│  
├── FundSearchService (Singleton Class)  
│   ├── getFundTypes() ดึงข้อมูลประเภทกองทุน  
│   ├── getCompanies() ดึงข้อมูลบริษัท  
│   ├── searchFunds() ค้นหากองทุน  
│   └── ระบบ Cache ลดการยิง API ซ้ำ  
│  
├── SearchBox (UI ค้นหา)  
│   ├── ช่องค้นหาตามชื่อ  
│   ├── Dropdown ค้นหาบริษัท  
│   ├── ประเภทกองทุน (Marquee และ Dropdown)  
│   ├── ปุ่มล้างตัวกรอง  
│  
├── แสดงผลลัพธ์กองทุน (ผลลัพธ์จาก API)   
│   ├── รายการกองทุน (Fund Card)  
│   ├── แสดงระดับความเสี่ยง  
│   ├── ลิงก์เปิด Fund Factsheet  
│  
├── PaginationComponent  
│   └── ระบบเปลี่ยนหน้า พร้อมคำนวณหน้าปัจจุบัน  
│  
└── หมายเหตุ และ ข้อมูลเพิ่มเติม  
```

## ภาพรวม

```bash
[URL Params] ──► [SearchPage] ──► [useSearchFunds Hook] ──► [FundSearchService]
      ▲                   │                           │
      └────  อัปเดต URL ◄──┴──    รับผลลัพธ์จาก API    ◄──┘
```

## ขั้นตอน

1. โหลดหน้าเว็บ SearchPage
    - รับ searchParams จาก URL
    - เตรียม initialParams จาก searchParams
    - เรียก useSearchFunds(initialParams) เพื่อจัดการระบบค้นหา

2. Custom Hook useSearchFunds  
    มี state หลัก เช่น  
    - ประเภทกองทุน
    - บริษัท
    - ผลการค้นหา
    - ตัวกรองที่กรอก
    - สถานะ Loading/Error
    - ใช้ FundSearchService เรียก API

    มีฟังก์ชัน  
    - handleSearch() ค้นหาใหม่
    - clearFilters() ล้างตัวกรอง
    - handlePageChange() เปลี่ยนหน้า
    - updateSearchInput() อัปเดตตัวกรอง

3. FundSearchService (Singleton + Cache)
    - มีระบบ Cache 5 นาที
    - ช่วยลด API ที่ยิงซ้ำ
    - ดึงข้อมูล
        - /api/fund/fund-type
        - /api/fund/company
        - /api/fund/search

4. SearchBox (ช่องค้นหา)
    - กรอกชื่อกองทุน
    - เลือกบริษัทจาก dropdown
    - เลือกประเภทกองทุนจาก Marquee หรือ dropdown
    - ปุ่มค้นหา
    - ปุ่มล้างตัวกรอง

5. แสดงผลลัพธ์
    - ถ้ามีข้อมูล แสดง list กองทุน
    - แต่ละรายการ
    - แสดงชื่อย่อ ชื่อเต็ม
    - ไอคอนธง ถ้ามีความเสี่ยงต่างประเทศ
    - ระดับความเสี่ยง พร้อมสีพื้นหลังตามระดับ
    - คลิกเพื่อดู Factsheet

6. Pagination
    - กดเปลี่ยนหน้า
    - อัปเดต URL
    - ยิง API ใหม่

7. หมายเหตุ  

