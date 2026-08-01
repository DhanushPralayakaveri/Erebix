package com.erebix.core.controller;

import com.erebix.core.service.WatchlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/watchlist")
public class WatchlistController {

    private final WatchlistService watchlistService;
    private static final Long DEFAULT_USER_ID = 1L; // Institutional Demo User session

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping
    public ResponseEntity<List<String>> getWatchlist(@RequestParam(required = false, defaultValue = "1") Long userId) {
        return ResponseEntity.ok(watchlistService.getWatchlistSymbols(userId));
    }

    @PostMapping("/{symbol}")
    public ResponseEntity<List<String>> addSymbol(
            @PathVariable String symbol,
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        return ResponseEntity.ok(watchlistService.addSymbol(userId, symbol));
    }

    @DeleteMapping("/{symbol}")
    public ResponseEntity<List<String>> removeSymbol(
            @PathVariable String symbol,
            @RequestParam(required = false, defaultValue = "1") Long userId) {
        return ResponseEntity.ok(watchlistService.removeSymbol(userId, symbol));
    }
}
