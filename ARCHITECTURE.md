# Cấu trúc và giới hạn

- `src/core.js`: XML/ZIP, định danh, băm nội dung, chống trùng/xung đột, ghi tệp và đọc lại xác minh.
- `src/bridge.js`: kiểm cổng, popup/MessageChannel, xác minh nonce/cửa sổ/origin, request và heartbeat sau ghép nối.
- `src/app.js`: hai workspace độc lập; tự đọc nguồn sau chọn đích; MST hai chiều mặc định, MST một chiều tùy chọn; xác nhận trước ghi; sắp xếp/tải PDF, tiến trình/lỗi/báo cáo, xem trước.
- `src/page.html`, `src/style.css`: giao diện tiếng Việt, tên gọi chung, bố cục thích ứng.
- `tools/build.cjs`: cùng nguồn cho web và HTML ngoại tuyến, nhúng JSZip/CSS/JS. Không tải CDN.

Sắp xếp giữ nguyên byte XML và nguồn, chỉ sao chép sau khi xác nhận. Phân chiều dựa MST trong XML; không dựa tên tệp hoặc tên đơn vị. Kho đích được đối chiếu trước khi ghi; bản khác nội dung được tách ngoài vùng tự nhập. Nguồn được chốt trước ghi để tránh quét lại đầu ra. Giới hạn: 16 MB/XML, 128 MB/ZIP, 3 lớp ZIP, 20.000 mục ZIP, 512 MB XML và giải nén mỗi lượt.

PDF riêng không ghi XML. Khi nhiều MST đã chọn cùng liên quan một hóa đơn, PDF riêng chỉ tải một bản cho cùng định danh/nội dung. XML cùng định danh khác nội dung không được tải. PDF chỉ đánh dấu đã lưu sau khi ghi/đọc lại xác minh; ACK đến bộ tải sau đó. Xem trước đọc tệp đã xác minh, dùng blob application/pdf trong trình duyệt, thu hồi URL sau đóng. Không giữ một blob cho mỗi PDF trong bộ nhớ.

Kiểm kết nối ban đầu chỉ GET `/api/companion/capabilities` trên cổng đã nhớ hoặc mặc định, không mở session/đọc dữ liệu/MST/khóa và không quét cổng. Chỉ endpoint này có CORS cho origin công cụ và file ngoại tuyến; không mở CORS cho API tải hoặc API ứng dụng. Quyền mạng cục bộ của trình duyệt vẫn áp dụng.

Khi người dùng xác nhận tải, cửa sổ relay giữ mã phiên riêng của lượt, kiểm đúng opener/nonce/origin; máy chủ kiểm ticket dùng một lần, quyền MST/mã bổ sung, manifest/hash và XML. HTML không có cookie/khóa phiên chính. Cầu nối, adapter và bản quyền nằm trong ứng dụng riêng, không có trong repo công khai. Không coi đường dẫn GitHub Pages là ranh giới origin: các project của cùng tài khoản chia sẻ origin. Đây không phải biện pháp ngăn chương trình đã chạy dưới cùng tài khoản Windows.

Kiểm công khai gồm unit/build và Chrome với tệp/thư mục sandbox, bộ tải/PDF mẫu, đường lỗi thiếu mã, kết nối chậm, chống trùng/xung đột, hủy xác nhận, PDF riêng/xem trước và màn hình rộng/hẹp. Kiểm bridge native bổ sung chạy trong dự án ứng dụng. Không coi các kiểm fixture là chứng minh mọi cổng nhà cung cấp hoặc EXE đã phát hành hoạt động.

Đối với HTTPS, kiểm quyền granular `loopback-network` an toàn trước khi dò: granted thì tự kết nối, prompt/denied thì giải thích và chờ thao tác người dùng. Không truy vấn permission tên cũ có thể lỗi trên Chrome cũ. Fetch khai báo `targetAddressSpace: loopback`; không tắt kiểm bảo mật mạng trong trình duyệt. Browser test HTTPS mô phỏng người dùng cấp quyền bằng CDP trong profile tạm, không sửa quyền trình duyệt người dùng.
