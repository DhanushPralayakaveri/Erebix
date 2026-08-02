package com.erebix.core.repository;

import com.erebix.core.model.TradeHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TradeHistoryRepository extends JpaRepository<TradeHistory, Long> {
    List<TradeHistory> findByPortfolioIdOrderByTimestampDesc(Long portfolioId);
}
