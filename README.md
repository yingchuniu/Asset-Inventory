<img width="1505" height="803" alt="截圖 2026-03-12 晚上10 57 35" src="https://github.com/user-attachments/assets/24115fc1-852d-442b-85e3-a0604d83454f" /># 資訊資產管理系統

系統採前後端分離架構

- Frontend：Angular
- Backend：Node.js / Express
- Database：MySQL

---

# 系統架構

## 前端

- 框架：Angular
- UI：HTML / SCSS
- HTTP Client：Angular HttpClient
- 表單管理：Reactive Form

### 主要功能

- 資產列表
- 搜尋資產
- 新增資產
- 編輯資產
- 刪除資產
- 欄位排序

---

## 後端

- Runtime：Node.js
- Framework：Express.js
- Database：MySQL
- API：RESTful API

### 後端負責

- 資料存取
- API 提供
- 資產代碼自動生成

---

# 系統功能

## 1. 資產管理

### 功能

- 新增資產
- 修改資產
- 查詢資產
- 刪除資產
- 關鍵字搜尋

### 資產欄位

| 欄位 | 說明 |
|-----|-----|
| asset_code | 資產代碼 |
| category | 資產分類 |
| asset_name | 資產名稱 |
| confidentiality | 機密性 |
| integrity | 完整性 |
| availability | 可用性 |
| asset_value | 資產價值 |
| asset_level | 價值等級 |
| security_level | 機密等級 |
| owner | 資產擁有者 |

---

## 2. CIA 評估

每個項目評分範圍：1 ~ 5
資產價值計算方式：
asset_value = C + I + A


---

## 3. 風險評鑑

每個資產可對應 **2 筆風險資料**

### 風險欄位

| 欄位 | 說明 |
|-----|-----|
| threat | 威脅 |
| vulnerability | 脆弱點 |
| description | 威脅說明 |
| c_impact | 機密性影響 |
| i_impact | 完整性影響 |
| a_impact | 可用性影響 |
| impact_level | 衝擊程度 |
| likelihood | 可能性 |
| risk_value | 風險值 |

### 風險值計算

風險值 = 衝擊程度 × 可能性


---

# 資料庫設計

## assets

| 欄位 | 型態 |
|-----|-----|
| id | int (PK) |
| asset_code | varchar |
| category | varchar |
| asset_name | varchar |
| confidentiality | int |
| integrity | int |
| availability | int |
| asset_value | int |
| asset_level | int |
| security_level | int |
| owner | varchar |

---

## risk_assessments

| 欄位 | 型態 |
|-----|-----|
| id | int (PK) |
| asset_id | int (FK) |
| risk_no | int |
| threat | varchar |
| vulnerability | varchar |
| description | varchar |
| c_impact | tinyint |
| i_impact | tinyint |
| a_impact | tinyint |
| impact_level | int |
| likelihood | int |
| risk_value | int |

---

## 資料表關聯
assets
│
│ 1
│
└─── risk_assessments


# API 設計

## 1. 取得資產列表


GET /api/assets

### 搜尋


GET /api/assets?keyword=xxx


---

## 2. 取得單一資產


GET /api/assets/:id


---

## 3. 新增資產


POST /api/assets


後端流程：

1. 新增資產
2. 自動產生 asset_code
3. 新增風險資料

---

## 4. 修改資產
PUT /api/assets/:id


---

## 5. 刪除資產


DELETE /api/assets/:id


刪除流程：

1. 刪除 risk_assessments
2. 刪除 assets

---

# 系統架構圖


Angular (Frontend)
│
│ REST API
│
Express / Node.js (Backend)
│
│
MySQL


---

# 系統啟動方式

## 1. 安裝套件


npm install


---

## 2. 啟動後端


npm start 或 node server.js


---

## 3. 啟動前端

ng serve

---

# 系統位置

Frontend
http://localhost:4200


Backend API
http://localhost:3000

# 截圖
<img width="1505" height="803" alt="截圖 2026-03-12 晚上10 57 35" src="https://github.com/user-attachments/assets/189ff98b-1590-4750-b786-b65a5377e4eb" />


<img width="1511" height="780" alt="截圖 2026-03-12 晚上10 57 12" src="https://github.com/user-attachments/assets/8d415764-7f78-43c3-bd80-b5487531d727" />





