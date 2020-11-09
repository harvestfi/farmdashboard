package xyz.farmdashboard.server.dto;

import lombok.Data;

@Data
public class TokenPriceDTO {
    private long acquired;
    private double price;
    private double volume;
}
