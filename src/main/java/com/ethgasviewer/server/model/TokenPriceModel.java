package com.ethgasviewer.server.model;

import lombok.Data;

@Data
public class TokenPriceModel {
    private long acquired;
    private double price;
    private double volume;
}
