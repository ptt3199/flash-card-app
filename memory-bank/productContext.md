# Product Context - Flashcard Learning App

## Tại sao dự án này tồn tại?

### Bối cảnh học từ vựng hiện tại
- **Vấn đề**: Học từ vựng tiếng Anh thường nhàm chán, thiếu tương tác
- **Nhu cầu**: Cần tool đơn giản, hiệu quả để ôn tập từ vựng mọi lúc mọi nơi
- **Gap**: Các app hiện tại thường phức tạp, cần đăng ký, hoặc trả phí

### Người dùng mục tiêu
- **Học sinh/sinh viên** học tiếng Anh
- **Người đi làm** muốn cải thiện English vocabulary
- **Self-learners** thích tự học, tự quản lý progress
- **Mobile-first users** thường học trên điện thoại

## Vấn đề chúng ta giải quyết

### 🎯 Pain Points hiện tại
1. **Tạo flashcard mất thời gian**: Phải tự tra từ điển, copy-paste
2. **Thiếu context**: Chỉ có nghĩa, không có ví dụ, phiên âm
3. **Không linh hoạt**: Không thể thêm ghi chú cá nhân
4. **Truy cập khó khăn**: Cần internet, đăng nhập, sync
5. **UX kém**: Interface phức tạp, không intuitive

### ✅ Giải pháp chúng ta cung cấp
1. **Auto-populate data**: API tự động lấy nghĩa, phiên âm, ví dụ
2. **Rich content**: Đầy đủ thông tin từ đồng/trái nghĩa đến audio
3. **Personal notes**: Chỗ để ghi chú riêng bằng tiếng Việt
4. **Offline-first**: Hoạt động mà không cần internet sau khi load
5. **Intuitive UX**: Keyboard shortcuts, touch gestures

## Trải nghiệm người dùng mong muốn

### User Journey - Người dùng mới
1. **Mở app** → Thấy giao diện clean, không overwhelm
2. **Thêm từ đầu tiên** → Điền từ "amazing", system tự động lấy thông tin
3. **Xem flashcard** → Thấy từ, click để xem nghĩa, phiên âm, ví dụ
4. **Thêm ghi chú** → "Từ này dùng khi muốn nói 'tuyệt vời'"
5. **Học tập** → Space để lật, arrow keys để chuyển thẻ
6. **Quay lại** → Escape để về management mode

### User Journey - Người dùng quen thuộc
1. **Mở app** → Vào thẳng study mode với thẻ cuối cùng
2. **Ôn tập nhanh** → Dùng keyboard shortcuts để browse
3. **Thêm từ mới** → Quick add với auto-complete
4. **Mobile learning** → Swipe gestures trên điện thoại
5. **Offline usage** → Học mà không cần internet

## Unique Value Proposition

### 🏆 Điểm khác biệt chính
- **Zero-setup**: Không cần đăng ký, tạo account
- **Auto-enrichment**: AI/API tự động làm phong phú nội dung
- **Bilingual notes**: Hỗ trợ ghi chú tiếng Việt cho người Việt
- **Keyboard-first**: Thiết kế cho productivity với shortcuts
- **Mobile-optimized**: Touch gestures như native app

### 📊 So sánh với competitors
| Feature | Our App | Anki | Quizlet | Duolingo |
|---------|---------|------|---------|----------|
| Setup time | 0 min | 30 min | 5 min | 10 min |
| Auto-populate | ✅ | ❌ | ❌ | ❌ |
| Offline | ✅ | ✅ | ❌ | ❌ |
| Free | ✅ | ✅ | Freemium | Freemium |
| Mobile UX | ✅ | ❌ | ✅ | ✅ |

## Success Metrics

### 📈 Engagement Metrics
- **Time to first flashcard**: < 30 seconds
- **Cards created per session**: Average 5+
- **Return rate**: 70% sau 1 tuần
- **Mobile usage**: 60% traffic từ mobile

### 💡 User Satisfaction
- **Ease of use**: 4.5/5 stars
- **Feature completeness**: No critical missing features
- **Performance**: < 2s load time trên mobile
- **Retention**: 40% active sau 1 tháng

### 🎯 Business Goals
- **User acquisition**: Organic growth through word-of-mouth
- **Cost efficiency**: Minimal server costs (static hosting)
- **Scalability**: Handle 10k+ concurrent users
- **Maintainability**: Clean code, easy to add features 