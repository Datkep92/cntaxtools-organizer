# CNTaxTools — Sắp xếp hóa đơn

**Dùng trên web:** https://datkep92.github.io/cntaxtools-organizer/

**Bản ngoại tuyến:** [Tải HTML](https://datkep92.github.io/cntaxtools-organizer/CNTaxTools-PhanLoai.html) (bấm chuột phải → Lưu liên kết thành…), sau đó mở bằng Chrome hoặc Edge trên máy tính.

Quét cả thư mục con hoặc nhập nhiều XML/ZIP, chọn kho, chọn hồ sơ MST quản lý rồi phân loại. Giữ nguyên tệp nguồn và nội dung XML; chống trùng, tách bản xung đột để kiểm tra, không ghi đè. Chấp nhận CCCD 12 số, giữ số 0 đầu. Chỉ gộp các mã vào cùng hồ sơ khi người dùng xác nhận.

Đích tương thích CNTaxTools: `MST-…/Mua_vao/xml` và `MST-…/Ban_ra/xml`. Không tự thêm tài khoản hoặc sửa dữ liệu trong ứng dụng.

## Quyền và dữ liệu

Cần Chrome/Edge trên máy tính và quyền đọc/ghi thư mục do bạn chọn. XML/ZIP được xử lý trên máy trong trình duyệt, không tải lên GitHub. Trang không dùng CDN, quảng cáo hoặc công cụ theo dõi. Khi dùng web, GitHub vẫn phục vụ trang và có thể ghi nhật ký truy cập theo chính sách của GitHub.

## PDF gốc

Tùy chọn này mặc định tắt. Cần CNTaxTools đang chạy **bản hỗ trợ cầu nối mới**, xác nhận trong ứng dụng và quyền của từng MST. **Bản EXE 1.8.3 đã phát hành chưa hỗ trợ.** Phân loại XML/ZIP vẫn dùng độc lập. Không yêu cầu cài lại 1.8.3 để bật PDF. Dự án công khai này không chứa bộ tải nhà cung cấp hoặc mã bản quyền của CNTaxTools.

## Phát triển / triển khai

Node.js 20 trở lên:

```
npm ci --ignore-scripts
npm run build
npm test
```

Đầu ra `dist/`: trang `index.html`, bản HTML ngoại tuyến, hướng dẫn và mã kiểm SHA-256. CSS/JS/JSZip được nhúng để bản tải về hoạt động ngoại tuyến. Push nhánh `main` sẽ kiểm thử và cập nhật GitHub Pages qua workflow. Bật Pages với nguồn **GitHub Actions** trong cài đặt repository.

Xem [hướng dẫn sử dụng](HUONG-DAN.md), [cấu trúc và giới hạn](ARCHITECTURE.md), [thư viện bên thứ ba](THIRD_PARTY_NOTICES.md).

Mã được công khai để tham khảo; repository chưa cấp thêm giấy phép sử dụng/phân phối mã riêng. Giấy phép của thư viện bên thứ ba được giữ riêng.
