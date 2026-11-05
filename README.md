# 馬可福音30日讀經挑戰

30日完成馬可福音（和合本）的讀經 Web 應用程式。

## 經文、查經與分享備註

- **和合本版本**：Bible Gateway 經典繁體和合本，version id **`CUV`**（不是 CUVMPT / RCUV / 修訂版）。例：`https://www.biblegateway.com/passage/?search=Mark+1%3A1-20&version=CUV`
- **WhatsApp 今日分享**：訊息含當日日期、馬可福音段落、靜態打包的 CUV 經文（過長則截斷並附 CUV 連結），以及 app URL。經文來源：`lib/data/mark-cuv.json`（Bible Gateway CUV，bundled for share）。
- **WhatsApp 開啟方式**：使用 `https://api.whatsapp.com/send?text=`（一般 WhatsApp），避免 Business 專用 deep link；詳見 PR 說明。
- **查經信息**：按當日 passage 的馬可章節對應 playlist，見 [`docs/sermon-mapping.md`](docs/sermon-mapping.md)。

## 背景圖片致謝

Login 與登入後頁面背景為明亮藍天白雲照片：

- Photo by [HUI Mandy](https://unsplash.com/@mandyhui) on [Unsplash](https://unsplash.com/photos/bright-blue-sky-and-fluffy-white-clouds-__AMAxRbwMU)
- License: [Unsplash License](https://unsplash.com/license)
- Local file: `public/images/sky-bg.jpg`（1920×1280，`w=1920&q=80`）

## 功能特色

- 🔐 **Google 登入** - 安全便捷的身份驗證
- 📖 **30日讀經計劃** - 按故事段落切分，每日 12-35 節
- ✅ **進度追蹤** - 標記已讀、查看完成度、連續天數
- 💪 **溫柔鼓勵** - 完成時給予聖經味的正面回饋
- 📱 **手機優先** - 響應式設計，適合手機閱讀
- 🎯 **受難週焦點** - 第21-30日特別跟隨主最後一週的腳蹤

## 技術架構

- **框架**: Next.js 15 (App Router)
- **語言**: TypeScript
- **認證**: Auth.js (NextAuth) + Google OAuth
- **資料庫**: PostgreSQL
- **ORM**: Prisma
- **部署**: Render (新加坡區域)

## 本地開發

### 環境需求

- Node.js 18+
- PostgreSQL 資料庫

### 設定步驟

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **設定環境變數**
   ```bash
   cp .env.example .env
   ```
   
   填寫 `.env` 檔案：
   - `DATABASE_URL`: PostgreSQL 連線字串
   - `AUTH_SECRET`: 執行 `openssl rand -base64 32` 生成
   - `AUTH_URL`: 本地開發用 `http://localhost:3000`
   - `AUTH_GOOGLE_ID`: Google OAuth Client ID
   - `AUTH_GOOGLE_SECRET`: Google OAuth Client Secret

3. **設定 Google OAuth**
   
   前往 [Google Cloud Console](https://console.cloud.google.com/)：
   - 建立新專案或選擇現有專案
   - 啟用 Google+ API
   - 建立 OAuth 2.0 憑證
   - 新增授權重新導向 URI：
     - 本地: `http://localhost:3000/api/auth/callback/google`
     - 正式: `https://your-service.onrender.com/api/auth/callback/google`

4. **初始化資料庫**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

6. **開啟瀏覽器**
   
   前往 `http://localhost:3000`

## 部署到 Render

### 方式一：使用 Blueprint（推薦）

1. 將此專案推送到 GitHub
2. 前往 [Render Dashboard](https://dashboard.render.com/)
3. 點選 "New" → "Blueprint"
4. 連結你的 GitHub 倉庫
5. Render 會自動偵測 `render.yaml` 並建立服務
6. 在 Render Dashboard 設定以下環境變數：
   - `AUTH_SECRET`
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`
   - `AUTH_URL` (例如: `https://your-service.onrender.com`)

### 方式二：手動建立

1. 建立 PostgreSQL 資料庫（新加坡區域，免費方案）
2. 建立 Web Service：
   - Runtime: Node
   - Build Command: `npm ci && npx prisma generate && npm run build`
   - Start Command: `npx prisma migrate deploy && npm run db:seed && npm start`
   - 設定環境變數（同上）

## 資料庫架構

### 核心資料表

- `users` - 使用者資料（來自 Google OAuth）
- `plan_days` - 30日讀經計劃（靜態種子資料）
- `progress` - 使用者讀經進度

### 關聯

- 一個使用者可以有多筆進度記錄
- 進度記錄關聯到特定的讀經日

## 專案結構

```
├── app/
│   ├── api/              # API 路由
│   ├── dashboard/        # 主要頁面（今日、讀經表、我的）
│   ├── login/            # 登入頁
│   ├── layout.tsx        # 根佈局
│   └── page.tsx          # 首頁（重新導向）
├── components/           # React 元件
├── prisma/
│   ├── schema.prisma     # 資料庫模型
│   └── seed.ts           # 種子資料
├── types/                # TypeScript 型別定義
├── auth.ts               # Auth.js 設定
├── auth.config.ts        # Auth.js 配置
├── middleware.ts         # Next.js 中介軟體
└── render.yaml           # Render 部署配置
```

## 讀經計劃詳情

30日計劃涵蓋馬可福音全書（共678節）：
- 第1-20日：從序言到第十章
- 第21-30日：受難週特別行程
  - 騎驢進京（棕枝主日）
  - 聖殿衝突與教導
  - 橄欖山講論
  - 最後晚餐
  - 客西馬尼禱告
  - 審判與釘十字架
  - 復活

## 授權

MIT License

## 聯絡

如有問題或建議，歡迎開 Issue 討論。

---

願主的話成為你腳前的燈、路上的光。🕯️
