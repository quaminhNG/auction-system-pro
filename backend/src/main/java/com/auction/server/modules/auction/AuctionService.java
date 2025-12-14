package com.auction.server.modules.auction;

import com.auction.server.modules.auction.dto.CreateAuctionRequest;
import com.auction.server.modules.user.User;
import com.auction.server.modules.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuctionService {

    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;

    // Hàm tạo phiên đấu giá
    public AuctionItem createAuction(CreateAuctionRequest request, String sellerEmail) {
        // 1. Tìm Seller từ Email (Dùng userRepository)
        // Nếu không thấy -> throw RuntimeException("User not found")
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Map dữ liệu từ Request sang Entity
        AuctionItem item = AuctionItem.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startPrice(request.getStartPrice())
                .stepPrice(request.getStepPrice())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())

                // --- CÁC TRƯỜNG MẶC ĐỊNH (Quan trọng) ---
                .currentPrice(request.getStartPrice()) // Giá hiện tại = Giá khởi điểm
                .status(AuctionStatus.UPCOMING)        // Mặc định là Sắp diễn ra
                .seller(seller)                        // Gán người bán
                .build();

        // 3. Lưu xuống DB và trả về kết quả
        return auctionRepository.save(item);
    }
}