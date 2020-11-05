package com.ethgasviewer.server.controllers;

import com.ethgasviewer.server.model.HarvestDTO;
import com.ethgasviewer.server.model.UniswapDTO;
import com.ethgasviewer.server.service.HarvestDBService;
import com.ethgasviewer.server.service.UniswapDBService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TransactionsController {
    private final UniswapDBService uniswapDBService;
    private final HarvestDBService harvestDBService;

    public TransactionsController(UniswapDBService uniswapDBService, HarvestDBService harvestDBService) {
        this.uniswapDBService = uniswapDBService;
        this.harvestDBService = harvestDBService;
    }

    @RequestMapping(value = "api/transactions/history/uni", method = RequestMethod.GET)
    public Iterable<UniswapDTO> uniswapHistoryData() {
        return uniswapDBService.fetchAllForLastDay();
    }

    @RequestMapping(value = "api/transactions/history/harvest", method = RequestMethod.GET)
    public Iterable<HarvestDTO> harvestHistoryData() {
        return harvestDBService.fetchAllForLastDay();
    }
}
