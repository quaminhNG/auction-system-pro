package com.auction.server.modules.auction.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CreateAuctionRequest {
    private String title;
    private String description;
    private BigDecimal startPrice;
    private BigDecimal stepPrice;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    // Không cần gửi status (Server tự tính)
    // Không cần gửi sellerId (Lấy từ Token)
}