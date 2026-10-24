# Sắp xếp hóa đơn XML / ZIP

1. Mở `CNTaxTools-PhanLoai.html` bằng Chrome hoặc Edge trên máy tính.
2. Chọn **Quét thư mục** hoặc **Nhập XML / ZIP**, rồi chọn **thư mục kho CNTaxTools**.
3. Bấm **Đọc XML và ZIP**. Chọn các hồ sơ MST bạn quản lý; không cần chọn tất cả nhà cung cấp/khách hàng.
4. Bấm **Phân loại vào kho**. XML/ZIP nguồn vẫn được giữ nguyên. Hóa đơn đã có được bỏ qua; bản khác nội dung được tách vào thư mục cần kiểm tra.
5. Muốn có PDF gốc, bật **Tự tải PDF gốc sau khi phân loại**. Mở CNTaxTools và xác nhận yêu cầu kết nối trong cửa sổ ứng dụng.

**Lưu ý về phiên bản:** EXE 1.8.3 đã phát hành chưa hỗ trợ kết nối này. Phân loại XML/ZIP dùng được ngay; tải PDF qua HTML cần CNTaxTools có cầu nối mới. Tải lại bộ 1.8.3 cũ không bổ sung cầu nối.

Mã tra cứu thiếu: chọn **Bổ sung / thử lại**. Cổng cần thao tác: dừng lượt PDF, **Mở cổng xác minh**, thực hiện trên trang nhà cung cấp rồi **Nhận PDF sau xác minh**. Một số hóa đơn/nhà cung cấp vẫn cần xử lý thủ công.

Chọn **Dừng** để ngưng hoặc **Tải báo cáo CSV** để xem lại kết quả. Không chạy hai cửa sổ phân loại vào cùng một kho. Sau khi thêm hồ sơ mới, chọn/thêm đúng MST và kho trong CNTaxTools để ứng dụng đọc các XML đã sắp xếp.

Mỗi MST chỉ hiển thị một hồ sơ, gom cả vai trò người bán/người mua và không tách theo tên đơn vị. Ngay dưới MST có số hóa đơn bán ra/mua vào (không đếm lặp XML cùng định danh) và thư mục chung. Ví dụ MST `001234567890` là người bán ở hóa đơn A, người mua ở hóa đơn B: cả hai vào `MST-001234567890`, lần lượt trong `Ban_ra/xml` và `Mua_vao/xml`. Nếu hai bên cùng thuộc một hồ sơ trong cùng hóa đơn, công cụ yêu cầu kiểm tra thay vì tự chọn chiều.

Chỉ tự đề xuất hồ sơ mới nếu MST có cả XML bán ra và XML mua vào trong nguồn. MST chỉ xuất hiện một chiều (nhà cung cấp/khách hàng) không tự được đề xuất. Hồ sơ MST đã có trong kho vẫn được giữ để nhập bổ sung một chiều. Không dùng một XML có hai bên cùng MST để chứng minh đủ hai chiều.
