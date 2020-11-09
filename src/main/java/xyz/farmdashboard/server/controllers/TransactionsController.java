package xyz.farmdashboard.server.controllers;

import org.springframework.web.bind.annotation.PathVariable;
import xyz.farmdashboard.server.dto.OhlcDTO;
import xyz.farmdashboard.server.dto.TvlHistoryDTO;
import xyz.farmdashboard.server.entity.HarvestTvlEntity;
import xyz.farmdashboard.server.entity.HarvestTxEntity;
import xyz.farmdashboard.server.entity.UniswapTxEntity;
import xyz.farmdashboard.server.repositories.HarvestTvlRepository;
import xyz.farmdashboard.server.repositories.UniswapTxRepository;
import xyz.farmdashboard.server.service.HarvestDBService;
import xyz.farmdashboard.server.service.UniswapDBService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TransactionsController {
    private final UniswapDBService uniswapDBService;
    private final HarvestDBService harvestDBService;
    private final HarvestTvlRepository harvestTvlRepository;

    public TransactionsController(UniswapDBService uniswapDBService, HarvestDBService harvestDBService, HarvestTvlRepository harvestTvlRepository) {
        this.uniswapDBService = uniswapDBService;
        this.harvestDBService = harvestDBService;
        this.harvestTvlRepository = harvestTvlRepository;
    }

    @RequestMapping(value = "api/transactions/history/uni", method = RequestMethod.GET)
    public Iterable<UniswapTxEntity> uniswapHistoryData() {
        return uniswapDBService.fetchAllForLastDay();
    }

    @RequestMapping(value = "api/transactions/history/harvest", method = RequestMethod.GET)
    public Iterable<HarvestTxEntity> harvestHistoryData() {
        return harvestDBService.fetchAllForLastDay();
    }

    @RequestMapping(value = "api/transactions/history/alltvl", method = RequestMethod.GET)
    public Iterable<HarvestTvlEntity> allTvlHistoryData() {
        return harvestTvlRepository.getHistoryOfAllTvl();
    }

    @RequestMapping(value = "api/transactions/history/uni/ohcl", method = RequestMethod.GET)
    public Iterable<UniswapTxRepository.OhlcProjection> ohclUniswapTx() {
        return uniswapDBService.ohclUniswapTx();
    }

    @RequestMapping(value = "api/transactions/history/tvl/{name}", method = RequestMethod.GET)
    public Iterable<TvlHistoryDTO> tvlHistoryByVault(@PathVariable("name") String name) {
        return harvestDBService.fetchTvlByVault(name);
    }
}
