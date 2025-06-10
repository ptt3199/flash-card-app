# Project Brief - Flashcard Learning App

## Tổng quan dự án
Xây dựng ứng dụng học từ vựng flashcard với React + Vite + TypeScript, deploy lên Vercel.

## Mục tiêu chính
1. **Học từ vựng hiệu quả**: Cung cấp trải nghiệm học flashcard trực quan, dễ sử dụng
2. **Tự động hóa**: Tích hợp API từ điển để tự động lấy thông tin từ vựng
3. **Cá nhân hóa**: Cho phép người dùng thêm ghi chú riêng
4. **Đa nền tảng**: Responsive design hoạt động trên cả desktop và mobile
5. **Offline-first**: Lưu trữ dữ liệu local, không cần đăng nhập

## Tính năng cốt lõi

### Chế độ Học (Study Mode)
- Hiển thị từ vựng tiếng Anh ở mặt trước
- Click hoặc Space để lật thẻ xem nghĩa
- Arrow keys để điều hướng giữa các thẻ
- Nút thoát về chế độ quản lý

### Chế độ Quản lý (Management Mode)
- Xem danh sách tất cả flashcards
- Thêm/sửa/xóa flashcards
- Form thêm từ mới tự động gọi API dictionary

### Tích hợp API
- **Free Dictionary API** (primary): Miễn phí, không cần key
- **Gemini API** (fallback): Khi dictionary API không có kết quả
- Tự động lấy: định nghĩa, phiên âm IPA, loại từ, đồng/trái nghĩa, ví dụ

### Text-to-Speech
- Nút phát âm với Web Speech API
- Hỗ trợ nhiều giọng (English UK/US)
- Fallback cho âm thanh từ API

### Keyboard Shortcuts
- **Space**: Lật thẻ
- **Arrow Left/Right**: Chuyển thẻ
- **Escape**: Thoát study mode

## Yêu cầu kỹ thuật
- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: TailwindCSS
- **State Management**: React hooks + localStorage
- **API Integration**: Fetch API
- **Deployment**: Vercel (static site)
- **Mobile**: Touch gestures support

## Tiêu chí thành công
1. Người dùng có thể học flashcard mượt mà trên mọi thiết bị
2. Tự động hóa việc tạo flashcard với API dictionary
3. Trải nghiệm UX trực quan, không cần hướng dẫn
4. Performance tốt, load nhanh
5. Offline capability với localStorage

## Phạm vi v1.0
- Study mode với keyboard shortcuts
- Management mode với CRUD operations
- Dictionary API integration  
- Responsive design
- Text-to-speech functionality
- Local storage persistence

## Ngoài phạm vi v1.0
- User authentication
- Cloud sync
- Spaced repetition algorithm
- Progress tracking/analytics
- Export/import functionality
- Multiple languages support 