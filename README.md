# Sắp xếp & tải hóa đơn

**[Mở công cụ trên web](https://datkep92.github.io/cntaxtools-organizer/)** · **[Tải HTML ngoại tuyến](https://datkep92.github.io/cntaxtools-organizer/CNTaxTools-PhanLoai.html)**

Hai trang độc lập, dùng Chrome/Edge trên máy tính:

- **Sắp xếp XML / ZIP:** chọn thư mục nguồn và thư mục lưu, tự đọc dữ liệu; MST có cả mua vào/bán ra được chọn sẵn, MST một chiều có thể chọn thêm. Xác nhận nguồn → đích trước khi ghi.
- **Tải PDF gốc:** chọn thư mục XML hoặc nhập nhiều XML, chọn thư mục lưu PDF, bấm Tải PDF gốc; tự lấy toàn bộ XML hợp lệ, không yêu cầu chọn MST hoặc chạy phân loại. Có tiến trình từng hóa đơn, lỗi cụ thể, bộ lọc và nút xem trước PDF đã lưu.

Nguồn được giữ nguyên; chống trùng, tách xung đột, không ghi đè bản khác nội dung. Mỗi MST dùng một thư mục `MST-…`, bên trong có `Mua_vao/xml` và `Ban_ra/xml`. PDF nằm trực tiếp trong thư mục lưu PDF bạn chọn.

## Kết nối bộ tải

Trang PDF tự kiểm tra bộ tải trên thiết bị một lần khi mở, dùng cổng đã nhớ hoặc mặc định 28122. Không quét các cổng khác. Khi không kết nối được, ô nhập cổng xuất hiện; có thể bỏ qua và chỉ sắp xếp XML. Bộ tải và trình duyệt có thể yêu cầu quyền mạng cục bộ hoặc mở cửa sổ.

Phần sắp xếp chạy độc lập. PDF cần ứng dụng trên máy có **cầu nối phiên bản mới**, không yêu cầu thêm hồ sơ MST vào ứng dụng; quyền sử dụng vẫn được kiểm tra. EXE 1.8.3 đã phát hành chưa có cầu nối. Dự án này không công khai bộ tải nhà cung cấp, mã bản quyền hoặc dữ liệu người dùng.

XML/ZIP không được tải lên GitHub. Thư viện được nhúng, không dùng CDN/quảng cáo/theo dõi; khi dùng web GitHub vẫn phục vụ trang và có thể ghi nhật ký truy cập theo chính sách GitHub. Kết nối mạng của trang chỉ dành cho địa chỉ loopback trên máy. PDF truyền qua cửa sổ relay có phạm vi từng lượt.

## Phát triển

Node.js 20 trở lên:

```
npm ci --ignore-scripts
npm run build
npm test
npm run test:browser
```

Kiểm trình duyệt cần Chrome/Edge; đặt `CHROME_BIN` nếu không ở đường dẫn thông thường. `test:browser` dùng thư mục sandbox và bộ tải giả lập/PDF mẫu, không truy cập dữ liệu người dùng hoặc cổng nhà cung cấp. Kiểm cầu nối native được thực hiện riêng trong dự án ứng dụng.

Push nhánh `main` sẽ build, kiểm và triển khai GitHub Pages. `dist/` chứa trang web, HTML ngoại tuyến, hướng dẫn và SHA-256. Xem [hướng dẫn](HUONG-DAN.md), [kiến trúc](ARCHITECTURE.md), [thư viện bên thứ ba](THIRD_PARTY_NOTICES.md).

Mã được công khai để tham khảo; repository chưa cấp thêm giấy phép sử dụng/phân phối mã riêng. Giấy phép thư viện bên thứ ba được giữ riêng.

**Quyền của trình duyệt:** Nếu Chrome/Edge chưa cho trang kết nối vào thiết bị, bấm **Kết nối lại** rồi chọn **Cho phép** khi trình duyệt hỏi. Sau khi đã lưu quyền, trang tự kết nối ở lần mở sau. Nếu đã chọn chặn, bật mạng cục bộ / loopback trong Cài đặt trang rồi thử lại. Đây là quyền của trình duyệt, không phải xác nhận từng lượt trong ứng dụng. Xem [tài liệu Chrome](https://developer.chrome.com/blog/local-network-access).

Trang landing: [Phân loại XML/ZIP](https://datkep92.github.io/cntaxtools-landing/phan-loai-hoa-don/) · [Tải PDF gốc](https://datkep92.github.io/cntaxtools-landing/tai-pdf/). Hai đường dẫn không dùng trạng thái của nhau.
