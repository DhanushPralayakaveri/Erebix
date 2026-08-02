package com.erebix.core.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class MarketGatewayService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ml.service.url:http://127.0.0.1:8000}")
    private String mlServiceUrl;

    public ResponseEntity<String> getMarketData(String ticker) {
        String url = UriComponentsBuilder.fromHttpUrl(mlServiceUrl)
                .path("/api/v1/market/")
                .path(ticker)
                .toUriString();
        return restTemplate.getForEntity(url, String.class);
    }

    public ResponseEntity<String> getMarketPrediction(String ticker) {
        String url = UriComponentsBuilder.fromHttpUrl(mlServiceUrl)
                .path("/api/v1/market/predict/")
                .path(ticker)
                .toUriString();
        return restTemplate.getForEntity(url, String.class);
    }

    public ResponseEntity<String> searchStocks(String query) {
        String url = UriComponentsBuilder.fromHttpUrl(mlServiceUrl)
                .path("/api/v1/market/search")
                .queryParam("q", query)
                .toUriString();
        return restTemplate.getForEntity(url, String.class);
    }
}
