package com.ethgasviewer.server.controllers;

import com.ethgasviewer.server.model.GasModel;
import com.ethgasviewer.server.service.GasService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GasController {

    private final GasService gasService;

    public GasController(GasService gasService) {
        this.gasService = gasService;
    }

    @RequestMapping(value = "api/gas/history", method = RequestMethod.GET)
    public Iterable<GasModel> historyData() {
        return gasService.loadHistory();
    }

    @RequestMapping(value = "api/gas/last/{fromDate}", method = RequestMethod.GET)
    public Iterable<GasModel> lastData(@PathVariable("fromDate") long fromDate) {
        return gasService.loadLastData(fromDate);
    }

}
