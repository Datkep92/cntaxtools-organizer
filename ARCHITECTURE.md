# Cấu trúc và giới hạn

- `src/core.js`: đọc XML/ZIP, định danh, so nội dung, kiểm và ghi tệp.
- `src/app.js`: chọn nguồn/kho/hồ sơ, phân loại, kết nối cầu nối PDF.
- `src/page.html`, `src/style.css`: giao diện tiếng Việt.
- `tools/build.cjs`: nhúng thư viện và mã vào một HTML; dùng cùng mã cho web và ngoại tuyến.
- Cầu nối máy cục bộ và adapter PDF thuộc CNTaxTools, không nằm trong repository này.

Nguồn được chốt trước khi ghi. Mã người bán/người mua quyết định chiều mua/bán, không dựa tên tệp. SHA-256 so nội dung XML; cùng định danh nhưng khác nội dung được tách ngoài vùng ứng dụng nhập tự động. Chỉ chọn các hồ sơ thực sự quản lý.

Giới hạn: XML 16 MB/tệp, ZIP 128 MB/tệp, tối đa 3 lớp ZIP, 20.000 mục ZIP, tối đa 512 MB XML và dung lượng giải nén mỗi lượt. ZIP mã hóa, ZIP64/nhiều phần được báo riêng. Không chạy hai cửa sổ phân loại vào cùng kho. Thư mục nguồn được chốt trước ghi; đầu ra có sẵn được đối chiếu để chống trùng.

Cầu nối chỉ trao đổi qua cửa sổ cục bộ và MessageChannel; kiểm cửa sổ, mã lượt ngẫu nhiên và nguồn gửi. Không giữ cookie/khóa phiên chính trong trang web. Cần duyệt từng hồ sơ và danh sách hóa đơn trong giao diện ứng dụng đã xác thực. Không bật CORS chung hoặc quyền API tùy ý cho website.

Kiểm tự động repository công khai xác nhận build tự chứa và vài bất biến xử lý. Kiểm tích hợp trong dự án CNTaxTools riêng kiểm XML/ZIP, sandbox thư mục trình duyệt, trùng/xung đột, relay/duyệt quyền và PDF mẫu. Không coi PDF mẫu là đã thử mọi cổng nhà cung cấp hoặc EXE phát hành.
