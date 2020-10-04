package com.ethgasviewer.server.service;

import com.ethgasviewer.server.AppProperties;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    private static final String PRICE_MSG = "Big move price from %.2f to %.2f (%.1f%%)";

    private final AppProperties properties;

    private double lastPrice = 0.0;


    public NotificationService(AppProperties properties) {
        this.properties = properties;
    }


    public String priceNotification(double currentPrice) {
        if (lastPrice == 0.0 || currentPrice <= 0.0) {
            lastPrice = currentPrice;
            return null;
        }

        double diff = currentPrice - lastPrice;
        double percentDiff = (diff / lastPrice) * 100;

        String message = null;
        if (Math.abs(percentDiff) > properties.getPriceBigMovePercent()) {
            message = String.format(PRICE_MSG, lastPrice, currentPrice, percentDiff);
        }
        lastPrice = currentPrice;
        return message;

    }

}
