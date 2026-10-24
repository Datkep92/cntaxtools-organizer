# Sắp xếp hóa đơn XML / ZIP

1. Mở `CNTaxTools-PhanLoai.html` bằng Chrome hoặc Edge trên máy tính.
2. Chọn **Quét thư mục** hoặc **Nhập XML / ZIP**, rồi chọn **thư mục kho CNTaxTools**.
3. Bấm **Đọc XML và ZIP**. Chọn các hồ sơ MST bạn quản lý; không cần chọn tất cả nhà cung cấp/khách hàng.
4. Bấm **Phân loại vào kho**. XML/ZIP nguồn vẫn được giữ nguyên. Hóa đơn đã có được bỏ qua; bản khác nội dung được tách vào thư mục cần kiểm tra.
5. Muốn có PDF gốc, mở CNTaxTools có cầu nối mới. Bấm **Kết nối và tải PDF** sau khi phân loại: công cụ tự kiểm quyền MST và bắt đầu tải, không hỏi xác nhận từng lượt. Hoặc bật **Tự kết nối và tải PDF gốc sau khi phân loại** để chạy liền sau bước phân loại.

**Lưu ý về phiên bản:** EXE 1.8.3 đã phát hành chưa hỗ trợ kết nối này. Phân loại XML/ZIP dùng được ngay; tải PDF qua HTML cần CNTaxTools có cầu nối mới. Tải lại bộ 1.8.3 cũ không bổ sung cầu nối.

Mã tra cứu thiếu: chọn **Bổ sung / thử lại**. Cổng cần thao tác: dừng lượt PDF, **Mở cổng xác minh**, thực hiện trên trang nhà cung cấp rồi **Nhận PDF sau xác minh**. Một số hóa đơn/nhà cung cấp vẫn cần xử lý thủ công.

Chọn **Dừng** để ngưng hoặc **Tải báo cáo CSV** để xem lại kết quả. Không chạy hai cửa sổ phân loại vào cùng một kho. Sau khi thêm hồ sơ mới, chọn/thêm đúng MST và kho trong CNTaxTools để ứng dụng đọc các XML đã sắp xếp.

Mỗi MST chỉ hiển thị một hồ sơ, gom cả vai trò người bán/người mua và không tách theo tên đơn vị. Ngay dưới MST có số hóa đơn bán ra/mua vào (không đếm lặp XML cùng định danh) và thư mục chung. Ví dụ MST `001234567890` là người bán ở hóa đơn A, người mua ở hóa đơn B: cả hai vào `MST-001234567890`, lần lượt trong `Ban_ra/xml` và `Mua_vao/xml`. Nếu hai bên cùng thuộc một hồ sơ trong cùng hóa đơn, công cụ yêu cầu kiểm tra thay vì tự chọn chiều.

Chỉ tự đề xuất hồ sơ mới nếu MST có cả XML bán ra và XML mua vào trong nguồn. MST chỉ xuất hiện một chiều (nhà cung cấp/khách hàng) không tự được đề xuất. Hồ sơ MST đã có trong kho vẫn được giữ để nhập bổ sung một chiều. Không dùng một XML có hai bên cùng MST để chứng minh đủ hai chiều.

## Chọn Downloads hoặc thư mục bị trình duyệt hạn chế

- Với **nguồn**: bấm **Chọn thư mục chỉ đọc**, chọn Downloads và xác nhận cho trình duyệt đọc các tệp. XML/ZIP trong thư mục con được lấy; các tệp khác được bỏ qua. Nếu trình duyệt vẫn không cho chọn thư mục, dùng **Nhập XML / ZIP** để chọn nhiều tệp.
- Với **kho đích cần ghi**: website không thể tự bỏ hạn chế của trình duyệt. Tạo thư mục con, ví dụ `Downloads/KhoHoaDon`, rồi chọn thư mục này; hoặc chọn một kho khác bạn có quyền ghi.
- Nếu đang mở trong trình duyệt nhúng mà không chọn/ghi được thư mục, mở địa chỉ web bằng Chrome/Edge trên máy tính. Hủy hộp chọn không xóa dữ liệu đã chọn trước đó. Cách chọn nguồn chỉ đọc không cấp quyền ghi; vẫn phải chọn kho đích riêng.

Cổng ứng dụng được nhớ sau lần kết nối thành công; có thể nhập lại trong **Kết nối và cài đặt**. Đang chạy mã nguồn cũ trong Node thì dừng bằng Ctrl+C và chạy lại `node src/server.js` để nạp cầu nối mới. Không cần cấp lại quyền cho từng lượt. Cửa sổ kết nối vẫn phải mở để tải; trình duyệt có thể hỏi quyền thư mục hoặc cho phép mở cửa sổ.

Nếu kiểm quyền MST mất vài giây, công cụ sẽ chờ hoàn tất ghép nối rồi mới kiểm tra nhịp kết nối; không tự ngắt vì bước này chưa xong. Khi mất kết nối thật, giao diện hiển thị thêm nguyên nhân. Sau khi có bản sửa, tải lại trang để nạp mã mới.
