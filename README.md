# 🏺 Craftique Shop

<div align="center">

![Craftique Logo](public/favicon.svg)

**Nghệ thuật gốm sứ truyền thống**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-purple.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📖 Giới thiệu

**Craftique Shop** là một nền tảng thương mại điện tử chuyên về gốm sứ thủ công mỹ nghệ Việt Nam. Website được xây dựng với công nghệ hiện đại, giao diện đẹp mắt và trải nghiệm người dùng tối ưu.

### ✨ Tính năng nổi bật

- 🛍️ **Mua sắm trực tuyến** - Giao diện thân thiện, dễ sử dụng
- 🎨 **Sản phẩm thủ công** - Gốm sứ chất lượng cao, độc đáo
- 🔧 **Sản phẩm Custom** - Tùy chỉnh theo yêu cầu khách hàng
- 📱 **Responsive Design** - Tương thích mọi thiết bị
- 🔐 **Bảo mật thanh toán** - Hệ thống thanh toán an toàn
- 📦 **Quản lý đơn hàng** - Theo dõi trạng thái đơn hàng
- 📝 **Blog gốm sứ** - Chia sẻ kiến thức và câu chuyện về gốm

## 🚀 Công nghệ sử dụng

### Frontend
- **React 18** - Thư viện UI hiện đại
- **Vite** - Build tool nhanh chóng
- **React Router** - Điều hướng trang
- **CSS3** - Styling và animations
- **Firebase** - Authentication và backend services

### UI/UX
- **Responsive Design** - Mobile-first approach
- **Modern UI** - Thiết kế hiện đại, tối giản
- **Smooth Animations** - Hiệu ứng mượt mà
- **Accessibility** - Hỗ trợ người khuyết tật

## 📦 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone https://github.com/your-username/craftique-fe-customer.git
cd craftique-fe-customer
```

### Bước 2: Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### Bước 3: Chạy dự án
```bash
npm run dev
# hoặc
yarn dev
```

Truy cập: `http://localhost:5173`

## 🏗️ Cấu trúc dự án

```
craftique-fe-customer/
├── public/                 # Static files
│   ├── favicon.svg        # Logo website
│   └── vite.svg
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # UI components
│   │   ├── layout/       # Layout components
│   │   └── features/     # Feature components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   ├── assets/           # Images, icons
│   ├── App.jsx           # Main App component
│   └── main.jsx          # Entry point
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Tính năng chính

### 🛍️ E-commerce
- **Danh mục sản phẩm** - Phân loại rõ ràng
- **Tìm kiếm sản phẩm** - Tìm kiếm nhanh chóng
- **Giỏ hàng** - Quản lý đơn hàng
- **Thanh toán** - Nhiều phương thức thanh toán

### 🎨 Custom Products
- **Tùy chỉnh sản phẩm** - Theo yêu cầu khách hàng
- **Upload file thiết kế** - Hỗ trợ nhiều định dạng
- **Xem trước sản phẩm** - 3D preview

### 👤 User Management
- **Đăng ký/Đăng nhập** - Tài khoản cá nhân
- **Quản lý profile** - Thông tin cá nhân
- **Lịch sử đơn hàng** - Theo dõi mua hàng

### 📝 Content Management
- **Blog gốm sứ** - Bài viết chuyên môn
- **Workshop** - Sự kiện và khóa học
- **Newsletter** - Đăng ký nhận tin

## 🎨 Design System

### Color Palette
- **Primary**: `#8B4513` (Brown)
- **Secondary**: `#F5E6D3` (Cream)
- **Accent**: `#b46b3d` (Warm Brown)
- **Background**: `#FFF8DC` (Light Cream)

### Typography
- **Font Family**: Montserrat
- **Weights**: 400, 500, 600, 700

### Components
- **Logo**: Chữ "C" màu nâu trên nền trắng
- **Buttons**: Rounded corners, hover effects
- **Cards**: Shadow effects, smooth transitions

## 📱 Responsive Design

Website được thiết kế responsive với các breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔧 Scripts

```bash
# Development
npm run dev          # Chạy development server
npm run build        # Build production
npm run preview      # Preview production build
npm run lint         # Kiểm tra code style

# Testing
npm run test         # Chạy tests
npm run test:coverage # Test coverage
```

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🤝 Đóng góp

Chúng tôi rất hoan nghênh mọi đóng góp! Hãy:

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Liên hệ

- **Website**: [craftique.com]([https://craftique.com](https://craftique-shop.vercel.app/))
- **Email**: craftique68@gmail.com
- **Phone**: 0987654321 / 0123456789
- **Address**: Việt Nam

---
<div align="center">
**Made with ❤️ by Craftique Team**
</div>
