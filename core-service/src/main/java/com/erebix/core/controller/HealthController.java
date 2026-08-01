package com.erebix.core.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @Value("${ml.service.url:http://127.0.0.1:8000}")
    private String mlServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "Erebix Core Gateway (Java Spring Boot)");
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now().toString());

        boolean mlServiceReachable = false;
        try {
            // Check reachability of the Python ML engine
            restTemplate.getForEntity(mlServiceUrl + "/docs", String.class);
            mlServiceReachable = true;
        } catch (Exception ignored) {
            // ML service might be offline or starting up
        }
        status.put("mlServiceConnected", mlServiceReachable);
        status.put("mlServiceUrl", mlServiceUrl);

        return ResponseEntity.ok(status);
    }
}
