package com.ethgasviewer.server.service;

import com.ethgasviewer.server.model.TokenInfoModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class TokenInfoGrabber {
    private static final Logger log = LoggerFactory.getLogger(TokenInfoGrabber.class);

    private final TokenInfoService tokenInfoService;

    public TokenInfoGrabber(TokenInfoService tokenInfoService) {
        this.tokenInfoService = tokenInfoService;
    }

    @Scheduled(fixedDelayString = "${egv.grab-delay-ms}")
    private void grabTokenInfo() {
        try {
            TokenInfoModel model = tokenInfoService.getTokenInfo();
            tokenInfoService.saveTokenInfo(model);
            log.info("Price info grabbed: " + model.getPrice());
        } catch (Exception e) {
            log.error("Error while grab token info", e);
        }
    }
}
