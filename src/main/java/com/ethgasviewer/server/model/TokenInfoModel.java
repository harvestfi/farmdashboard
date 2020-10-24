package com.ethgasviewer.server.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TokenInfoModel {
    private String address;
    private String totalSupply;
    private String name;
    private String symbol;
    private String decimals;
    private PriceModel price;
    private String owner;
    private String countOps;
    private String totalIn;
    private String totalOut;
    private String transfersCount;
    private String ethTransfersCount;
    private String holdersCount;
    private String issuancesCount;
    private String image;
    private String description;
    private String website;
    private String lastUpdated;
    private String twitter;
    private String coingecko;

}
