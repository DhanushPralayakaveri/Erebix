package com.erebix.core.controller;

import com.erebix.core.dto.PortfolioSummary;
import com.erebix.core.dto.TradeRequest;
import com.erebix.core.model.TradeHistory;
import com.erebix.core.service.PortfolioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping
    public ResponseEntity<PortfolioSummary> getPortfolioSummary(
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        return ResponseEntity.ok(portfolioService.getPortfolioSummary(userId));
    }

    @PostMapping("/buy")
    public ResponseEntity<PortfolioSummary> executeBuy(@Valid @RequestBody TradeRequest request) {
        return ResponseEntity.ok(portfolioService.executeBuy(request));
    }

    @PostMapping("/sell")
    public ResponseEntity<PortfolioSummary> executeSell(@Valid @RequestBody TradeRequest request) {
        return ResponseEntity.ok(portfolioService.executeSell(request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<TradeHistory>> getTradeHistory(
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        return ResponseEntity.ok(portfolioService.getTradeHistory(userId));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
