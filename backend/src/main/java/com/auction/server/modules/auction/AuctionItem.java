package com.auction.server.modules.auction;

import com.auction.server.common.BaseEntity;
import com.auction.server.modules.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "auction_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title; // Tên sản phẩm (VD: iPhone 15 Pro Max)

    @Column(columnDefinition = "TEXT")
    private String description; // Mô tả chi tiết (TEXT lưu được đoạn văn dài)

    private String imageUrl; // Link ảnh (Sau này sẽ upload lên Cloud)

    // --- CẤU HÌNH GIÁ ---
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal startPrice; // Giá khởi điểm

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal stepPrice; // Bước giá (Mỗi lần tăng tối thiểu bao nhiêu)

    @Column(precision = 19, scale = 4)
    private BigDecimal currentPrice; // Giá cao nhất hiện tại (Cập nhật liên tục)

    // --- CẤU HÌNH THỜI GIAN ---
    @Column(nullable = false)
    private LocalDateTime startTime; // Giờ mở bán

    @Column(nullable = false)
    private LocalDateTime endTime; // Giờ kết thúc

    // --- QUẢN LÝ ---
    @Enumerated(EnumType.STRING)
    private AuctionStatus status; // Trạng thái

    // --- LIÊN KẾT ---
    @ManyToOne(fetch = FetchType.LAZY) // Nhiều sản phẩm thuộc về 1 người bán
    @JoinColumn(name = "seller_id")
    private User seller; // Ai là người bán món này?

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_id")
    private User winner; // Ai là người thắng cuộc (Lúc đầu sẽ là null)

    // Optimistic Locking (Chống tranh chấp khi nhiều người đặt giá cùng lúc)
    @Version
    private Long version;
}