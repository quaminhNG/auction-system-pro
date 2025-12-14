package com.auction.server.modules.auction;

import com.auction.server.modules.auction.dto.CreateAuctionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/auctions")
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionService auctionService;

    @PostMapping
    public ResponseEntity<AuctionItem> createAuction(
            @RequestBody CreateAuctionRequest request,
            Principal principal // <-- Chứa thông tin user từ Token
    ) {
        // principal.getName() sẽ trả về Email (do ta đã config ở UserDetails)
        String email = principal.getName();

        return ResponseEntity.ok(auctionService.createAuction(request, email));
    }
}