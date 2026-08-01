package com.erebix.core.controller;

import com.erebix.core.service.MarketGatewayService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/market")
public class MarketGatewayController {

    private final MarketGatewayService marketGatewayService;

    public MarketGatewayController(MarketGatewayService marketGatewayService) {
        this.marketGatewayService = marketGatewayService;
    }

    @GetMapping(value = "/{ticker}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getMarketData(@PathVariable String ticker) {
        String sanitized = ticker.trim().toUpperCase();
        if (!sanitized.matches("^[A-Z0-9.\\-]{1,15}$")) {
            return ResponseEntity.badRequest().body("{\"error\":\"Invalid ticker symbol format\"}");
        }
        return marketGatewayService.getMarketData(sanitized);
    }

    @GetMapping(value = "/predict/{ticker}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getMarketPrediction(@PathVariable String ticker) {
        String sanitized = ticker.trim().toUpperCase();
        if (!sanitized.matches("^[A-Z0-9.\\-]{1,15}$")) {
            return ResponseEntity.badRequest().body("{\"error\":\"Invalid ticker symbol format\"}");
        }
        return marketGatewayService.getMarketPrediction(sanitized);
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> searchStocks(@RequestParam("q") String query) {
        String trimmed = query.trim();
        if (trimmed.length() > 64) {
            trimmed = trimmed.substring(0, 64);
        }
        // Remove potentially harmful SQL/script injection characters while preserving international names
        String sanitized = trimmed.replaceAll("[';--<>%]", "");
        return marketGatewayService.searchStocks(sanitized);
    }
}
