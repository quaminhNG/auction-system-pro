package com.auction.server.modules.auth;

import com.auction.server.config.JwtUtils;
import com.auction.server.modules.auth.dto.AuthResponse;
import com.auction.server.modules.auth.dto.LoginRequest;
import com.auction.server.modules.auth.dto.RegisterRequest;
import com.auction.server.modules.user.User;
import com.auction.server.modules.user.UserRepository;
import com.auction.server.modules.user.UserRole;
import com.auction.server.modules.user.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor // Tự động inject Repository và PasswordEncoder (thay vì dùng @Autowired)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public void register(RegisterRequest request) {
        // 1. Kiểm tra xem email đã tồn tại chưa
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists"); // Sau này mình sẽ làm Custom Exception xịn hơn
        }

        // 2. Tạo User Entity từ Request
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // Quan trọng: Mã hóa password
                .role(UserRole.MEMBER)
                .status(UserStatus.ACTIVE) // Tạm thời để ACTIVE luôn cho dễ test
                .balance(java.math.BigDecimal.ZERO) // Số dư ban đầu = 0
                .build();

        // 3. Lưu xuống Database
        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        // 1. Tìm User. Không thấy -> Ném lỗi luôn.
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Check Password.
        // Logic: Nếu KHÔNG khớp (!) -> Ném lỗi luôn.
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        // 3. Đến đây nghĩa là Login thành công.
        // Tạo Token (Cấp thẻ ra vào)
        String token = jwtUtils.generateToken(user);

        // 4. Đóng gói Token vào hộp AuthResponse và trả về
        return AuthResponse.builder()
                .token(token)
                .build();
    }
}