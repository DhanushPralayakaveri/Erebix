package com.erebix.core.dto;

import com.erebix.core.model.Holding;
import java.math.BigDecimal;
import java.util.List;

public class PortfolioSummary {

    private Long portfolioId;
    private Long userId;
    private BigDecimal cashBalance;
    private BigDecimal totalValue;
    private List<Holding> holdings;

    public PortfolioSummary() {}

    public PortfolioSummary(Long portfolioId, Long userId, BigDecimal cashBalance, BigDecimal totalValue, List<Holding> holdings) {
        this.portfolioId = portfolioId;
        this.userId = userId;
        this.cashBalance = cashBalance;
        this.totalValue = totalValue;
        this.holdings = holdings;
    }

    public Long getPortfolioId() {
        return portfolioId;
    }

    public void setPortfolioId(Long portfolioId) {
        this.portfolioId = portfolioId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public BigDecimal getCashBalance() {
        return cashBalance;
    }

    public void setCashBalance(BigDecimal cashBalance) {
        this.cashBalance = cashBalance;
    }

    public BigDecimal getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(BigDecimal totalValue) {
        this.totalValue = totalValue;
    }

    public List<Holding> getHoldings() {
        return holdings;
    }

    public void setHoldings(List<Holding> holdings) {
        this.holdings = holdings;
    }
}
