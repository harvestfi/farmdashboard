package com.ethgasviewer.server.service;

import com.ethgasviewer.server.model.TokenInfoModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Profile("!test")
public class TokenInfoGrabber {
    private static final Logger log = LoggerFactory.getLogger(TokenInfoGrabber.class);

    private final TokenInfoService tokenInfoService;
    private final TelegramBotService botService;
    private final NotificationService notificationService;

    public TokenInfoGrabber(TokenInfoService tokenInfoService, TelegramBotService botService, NotificationService notificationService) {
        this.tokenInfoService = tokenInfoService;
        this.botService = botService;
        this.notificationService = notificationService;
    }

    @Scheduled(fixedDelayString = "${egv.grab.grab-delay-ms}")
    private void grabTokenInfo() {
        try {
            TokenInfoModel model = tokenInfoService.getTokenInfo();
            tokenInfoService.saveTokenInfo(model);
            if (model != null && model.getPrice() != null) {
                log.info("Price info grabbed: " + model.getPrice().getRate());
                String msg = notificationService.priceNotification(Double.parseDouble(model.getPrice().getRate()));
                if (msg != null) {
                    botService.sendMessageToAll(msg);
                }
            }
        } catch (Exception e) {
            log.error("Error while grab token info", e);
        }
    }
}
