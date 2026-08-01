package com.erebix.core.service;

import com.erebix.core.dto.PortfolioSummary;
import com.erebix.core.dto.TradeRequest;
import com.erebix.core.model.Holding;
import com.erebix.core.model.Portfolio;
import com.erebix.core.model.TradeHistory;
import com.erebix.core.repository.HoldingRepository;
import com.erebix.core.repository.PortfolioRepository;
import com.erebix.core.repository.TradeHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final HoldingRepository holdingRepository;
    private final TradeHistoryRepository tradeHistoryRepository;

    private static final BigDecimal INITIAL_CASH = new BigDecimal("100000.00");

    public PortfolioService(PortfolioRepository portfolioRepository,
                            HoldingRepository holdingRepository,
                            TradeHistoryRepository tradeHistoryRepository) {
        this.portfolioRepository = portfolioRepository;
        this.holdingRepository = holdingRepository;
        this.tradeHistoryRepository = tradeHistoryRepository;
    }

    @Transactional
    public Portfolio getOrCreatePortfolio(Long userId) {
        return portfolioRepository.findByUserId(userId)
                .orElseGet(() -> portfolioRepository.save(new Portfolio(userId, INITIAL_CASH)));
    }

    @Transactional(readOnly = true)
    public PortfolioSummary getPortfolioSummary(Long userId) {
        Portfolio portfolio = getOrCreatePortfolio(userId);
        List<Holding> holdings = holdingRepository.findByPortfolioId(portfolio.getId());
        return new PortfolioSummary(
                portfolio.getId(),
                portfolio.getUserId(),
                portfolio.getCashBalance(),
                portfolio.getTotalValue(),
                holdings
        );
    }

    @Transactional
    public PortfolioSummary executeBuy(TradeRequest request) {
        Portfolio portfolio = getOrCreatePortfolio(request.getUserId());
        String symbol = request.getSymbol().toUpperCase().trim();
        BigDecimal totalCost = request.getPrice().multiply(new BigDecimal(request.getQuantity()));

        if (portfolio.getCashBalance().compareTo(totalCost) < 0) {
            throw new IllegalArgumentException("Insufficient cash balance to execute BUY order.");
        }

        // Deduct cash
        portfolio.setCashBalance(portfolio.getCashBalance().subtract(totalCost));
        portfolio.setUpdatedAt(LocalDateTime.now());
        portfolioRepository.save(portfolio);

        // Update holding
        Optional<Holding> existingOpt = holdingRepository.findByPortfolioIdAndSymbol(portfolio.getId(), symbol);
        if (existingOpt.isPresent()) {
            Holding h = existingOpt.get();
            int newQty = h.getQuantity() + request.getQuantity();
            BigDecimal totalOldValue = h.getAverageCost().multiply(new BigDecimal(h.getQuantity()));
            BigDecimal newAvgCost = totalOldValue.add(totalCost).divide(new BigDecimal(newQty), 2, RoundingMode.HALF_UP);
            h.setQuantity(newQty);
            h.setAverageCost(newAvgCost);
            holdingRepository.save(h);
        } else {
            holdingRepository.save(new Holding(portfolio.getId(), symbol, request.getQuantity(), request.getPrice()));
        }

        // Record trade log
        tradeHistoryRepository.save(new TradeHistory(
                portfolio.getId(),
                symbol,
                "BUY",
                request.getQuantity(),
                request.getPrice()
        ));

        return getPortfolioSummary(request.getUserId());
    }

    @Transactional
    public PortfolioSummary executeSell(TradeRequest request) {
        Portfolio portfolio = getOrCreatePortfolio(request.getUserId());
        String symbol = request.getSymbol().toUpperCase().trim();
        BigDecimal totalProceeds = request.getPrice().multiply(new BigDecimal(request.getQuantity()));

        Holding holding = holdingRepository.findByPortfolioIdAndSymbol(portfolio.getId(), symbol)
                .orElseThrow(() -> new IllegalArgumentException("No existing holding found for symbol: " + symbol));

        if (holding.getQuantity() < request.getQuantity()) {
            throw new IllegalArgumentException("Insufficient quantity in holding to execute SELL order.");
        }

        // Add cash
        portfolio.setCashBalance(portfolio.getCashBalance().add(totalProceeds));
        portfolio.setUpdatedAt(LocalDateTime.now());
        portfolioRepository.save(portfolio);

        // Reduce or remove holding
        int remainingQty = holding.getQuantity() - request.getQuantity();
        if (remainingQty == 0) {
            holdingRepository.delete(holding);
        } else {
            holding.setQuantity(remainingQty);
            holdingRepository.save(holding);
        }

        // Record trade log
        tradeHistoryRepository.save(new TradeHistory(
                portfolio.getId(),
                symbol,
                "SELL",
                request.getQuantity(),
                request.getPrice()
        ));

        return getPortfolioSummary(request.getUserId());
    }

    @Transactional(readOnly = true)
    public List<TradeHistory> getTradeHistory(Long userId) {
        Portfolio portfolio = getOrCreatePortfolio(userId);
        return tradeHistoryRepository.findByPortfolioIdOrderByTimestampDesc(portfolio.getId());
    }
}
