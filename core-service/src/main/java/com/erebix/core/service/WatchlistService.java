package com.erebix.core.service;

import com.erebix.core.model.WatchlistItem;
import com.erebix.core.repository.WatchlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;

    public WatchlistService(WatchlistRepository watchlistRepository) {
        this.watchlistRepository = watchlistRepository;
    }

    public List<String> getWatchlistSymbols(Long userId) {
        return watchlistRepository.findByUserIdOrderByAddedAtDesc(userId)
                .stream()
                .map(WatchlistItem::getSymbol)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<String> addSymbol(Long userId, String symbol) {
        String upperSymbol = symbol.toUpperCase().trim();
        if (watchlistRepository.findByUserIdAndSymbol(userId, upperSymbol).isEmpty()) {
            watchlistRepository.save(new WatchlistItem(userId, upperSymbol));
        }
        return getWatchlistSymbols(userId);
    }

    @Transactional
    public List<String> removeSymbol(Long userId, String symbol) {
        String upperSymbol = symbol.toUpperCase().trim();
        watchlistRepository.deleteByUserIdAndSymbol(userId, upperSymbol);
        return getWatchlistSymbols(userId);
    }
}
