package com.ethgasviewer.server;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "egv")
@Getter
@Setter
@ToString
public class AppProperties {
    private String ethgasstationApi = "";
    private boolean useApiKey = false;
    private int provideLastDays = 30;


    private String ethplorerApiKey = "freekey";
    private String tokenAddress = "0xa0246c9032bC3A600820415aE600c6388619A14D";

    private double priceBigMovePercent = 0.3;

    private String telegramBotToken = "";
}
