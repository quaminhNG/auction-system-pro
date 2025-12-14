package com.auction.server.modules.auction;

public enum AuctionStatus {
    DRAFT,      // Nháp (Người bán đang soạn, chưa public)
    UPCOMING,   // Sắp diễn ra (Đã public nhưng chưa đến giờ bắt đầu)
    ACTIVE,     // Đang diễn ra (Mọi người được phép bid)
    ENDED,      // Đã kết thúc (Chờ thanh toán)
    CANCELLED   // Bị hủy (Do vi phạm hoặc lỗi)
}