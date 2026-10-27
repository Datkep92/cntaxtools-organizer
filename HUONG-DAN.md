# Sắp xếp & tải hóa đơn

Mở bằng Chrome/Edge trên máy tính. Trang PDF tự kiểm tra bộ tải trên máy; không kết nối được thì có thể nhập lại cổng hoặc bấm **Bỏ qua**. Chỉ sắp xếp XML/ZIP thì không cần bộ tải. Cổng thành công được nhớ cho lần sau, không quét các cổng khác.

## Sắp xếp XML / ZIP

1. **Thư mục cần sắp xếp → Chọn thư mục.** Gồm XML và ZIP trong các thư mục con.
2. **Thư mục lưu dữ liệu → Chọn thư mục.** Công cụ tự đọc dữ liệu khi đã có đủ nguồn và nơi lưu.
3. MST có cả mua vào và bán ra được chọn sẵn. Mở danh sách MST một chiều để chọn thêm nếu nguồn còn thiếu dữ liệu. Không chọn tất cả nhà cung cấp/khách hàng nếu bạn không quản lý các MST đó.
4. Bấm **Phân loại**. Kiểm tra nguồn, nơi lưu và số MST. Bấm **Đồng ý, sắp xếp** để bắt đầu. Bấm **Để sau** chưa ghi tệp nào.
5. Theo dõi danh sách. Tệp nguồn giữ nguyên, XML trùng được bỏ qua, bản khác nội dung được tách để kiểm tra. XML nằm ở `MST-…/Mua_vao/xml` hoặc `MST-…/Ban_ra/xml`. PDF dùng trang riêng.

## Tải PDF gốc riêng

1. Mở trực tiếp [Tải PDF gốc](https://datkep92.github.io/cntaxtools-landing/tai-hoa-don-goc/). Không cần mở trang phân loại.
2. Chọn thư mục XML hoặc **Nhập nhiều XML**; chọn thư mục để lưu PDF.
3. Bấm **Tải PDF gốc** để chạy ngay cho toàn bộ XML hợp lệ. Không chọn MST, không phân loại và không sao chép XML.
4. PDF lưu trực tiếp vào thư mục PDF đã chọn. Không sao chép/phân loại lại XML. PDF hợp lệ đã có được bỏ qua.
5. Bấm **Xem PDF** trên dòng đã lưu để mở bản gốc, hoặc tải riêng tệp đó. Các dòng thiếu mã/cần xác minh có nút bổ sung hoặc mở cổng nhà cung cấp. Có thể lọc **Cần kiểm tra**, tải báo cáo và thử lại.

**Dừng** sẽ ngưng lượt, giữ tệp đã lưu. Giữ cửa sổ bộ tải mở trong khi tải PDF; đóng trang/cửa sổ kết nối thì lượt dừng. Trình duyệt có thể hỏi quyền đọc/ghi thư mục, mạng cục bộ hoặc cửa sổ bật lên; công cụ không tự bỏ các giới hạn này.

## Lưu ý

- Nếu Downloads không cho ghi, tạo và chọn thư mục con, ví dụ `Downloads/KhoHoaDon`. Nguồn dùng cách chọn thư mục chỉ đọc; cũng có thể nhập XML trực tiếp trong phần PDF.
- Trình duyệt chỉ cho biết tên thư mục đã chọn, không cung cấp đầy đủ đường dẫn Windows. Hộp xác nhận hiển thị tên nguồn/nơi lưu và cấu trúc dự kiến, không đoán đường dẫn tuyệt đối.
- Giữ số 0 đầu của MST/CCCD. Chỉ thêm mã bổ sung khi chắc chắn cùng hồ sơ. Hai bên cùng thuộc một hồ sơ trong một hóa đơn được tách để kiểm tra.
- Không chạy hai cửa sổ ghi vào cùng một thư mục. HTML không tạo tài khoản MST hoặc sửa cơ sở dữ liệu của ứng dụng bộ tải.
- PDF cần bộ tải có cầu nối mới. EXE 1.8.3 cũ chưa có cầu nối; cài lại bộ cũ không bổ sung chức năng. Chạy mã nguồn mới phải khởi động lại máy chủ để có bước tự kiểm tra kết nối mới.
- Thiếu mã tra cứu/nguồn chưa hỗ trợ không được thay bằng PDF tự dựng.

**Quyền của trình duyệt:** Nếu Chrome/Edge chưa cho trang kết nối vào thiết bị, bấm **Kết nối lại** rồi chọn **Cho phép** khi trình duyệt hỏi. Sau khi đã lưu quyền, trang tự kết nối ở lần mở sau. Nếu đã chọn chặn, bật mạng cục bộ / loopback trong Cài đặt trang rồi thử lại. Đây là quyền của trình duyệt, không phải xác nhận từng lượt trong ứng dụng. Xem [tài liệu Chrome](https://developer.chrome.com/blog/local-network-access).
