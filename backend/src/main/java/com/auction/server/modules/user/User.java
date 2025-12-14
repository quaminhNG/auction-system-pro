package com.auction.server.modules.user;

import com.auction.server.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users") // Tên bảng trong DB
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder // Design pattern Builder giúp tạo object gọn gàng
public class User extends BaseEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Sẽ mã hóa bằng BCrypt

    @Column(name = "full_name", nullable = false)
    private String fullName;

    // Số dư ví - CỰC KỲ QUAN TRỌNG: Dùng BigDecimal cho tiền tệ
    @Column(precision = 19, scale = 4) // Hỗ trợ số rất lớn
    private BigDecimal balance;

    @Enumerated(EnumType.STRING)
    private UserRole role; // MEMBER, ADMIN

    @Enumerated(EnumType.STRING)
    private UserStatus status; // ACTIVE, BANNED, UNVERIFIED

    // Dùng cho OAuth2 (Google/Facebook) sau này
    private String provider;
    private String providerId;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Trả về quyền hạn của User (ADMIN hay MEMBER)
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email; // Spring Security dùng Username, nhưng app mình dùng Email
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}