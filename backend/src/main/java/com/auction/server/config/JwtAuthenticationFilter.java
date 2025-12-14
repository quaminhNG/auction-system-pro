package com.auction.server.config;

import com.auction.server.modules.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository; // Dùng repo trực tiếp cho nhanh

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Lấy Header Authorization ra
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 2. Nếu không có Header hoặc không bắt đầu bằng "Bearer " -> Cho qua (để Spring Security chặn sau)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Lấy Token (Bỏ chữ "Bearer " ở đầu)
        jwt = authHeader.substring(7);

        // 4. Trích xuất Email từ Token
        try {
            userEmail = jwtUtils.extractUsername(jwt);

            // 5. Nếu có Email và chưa được xác thực trong Context hiện tại
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Lấy thông tin User từ DB
                UserDetails userDetails = userRepository.findByEmail(userEmail)
                        .orElseThrow(() -> new RuntimeException("User not found")); // Tạm thời throw lỗi

                // 6. Kiểm tra Token có hợp lệ với User này không
                if (jwtUtils.isTokenValid(jwt, userDetails)) {

                    // 7. Tạo đối tượng Authentication và set vào Context (ĐÓNG DẤU: ĐÃ DUYỆT)
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Đây là bước quan trọng nhất: Báo cho Spring biết User này đã đăng nhập
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Nếu Token lỗi thì cứ cho qua, Spring Security sẽ chặn ở bước sau
            System.out.println("Error JWT Filter: " + e.getMessage());
        }

        // 8. Cho phép request đi tiếp
        filterChain.doFilter(request, response);
    }
}