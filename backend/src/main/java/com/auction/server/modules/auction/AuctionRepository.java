package com.auction.server.modules.auction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AuctionRepository extends JpaRepository<AuctionItem, UUID> {
    // Sau này sẽ viết thêm hàm tìm kiếm (Search) ở đây
}