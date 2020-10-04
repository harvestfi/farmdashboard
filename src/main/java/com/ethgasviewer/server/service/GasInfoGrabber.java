package com.ethgasviewer.server.service;

import com.ethgasviewer.server.model.GasModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Profile("!test")
public class GasInfoGrabber {
    private static final Logger log = LoggerFactory.getLogger(GasInfoGrabber.class);

    private final GasService gasService;

    public GasInfoGrabber(GasService gasService) {
        this.gasService = gasService;
    }

    @Scheduled(fixedDelayString = "${egv.price-grab-delay-ms}")
    private void grabGasInfo() {
        try {
            log.info("Start gas info grab");
            GasModel gasModel = gasService.grabGasInfo();
            gasService.saveGasModel(gasModel);
            log.info("Gas info grabbed: " + gasModel.getSafeLow());
        } catch (Exception e) {
            log.info("Error while gas have grabbed", e);
        }
    }

}
