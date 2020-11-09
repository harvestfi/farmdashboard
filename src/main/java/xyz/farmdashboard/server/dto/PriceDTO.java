package xyz.farmdashboard.server.dto;

import lombok.Data;

@Data
public class PriceDTO {
    private String rate;
    private String currency;
    private String diff;
    private String diff7d;
    private String diff30d;
    private String marketCapUsd;
    private String availableSupply;
    private String volume24h;
    private String ts;
}
