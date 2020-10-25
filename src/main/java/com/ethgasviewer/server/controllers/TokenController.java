package com.ethgasviewer.server.controllers;

import com.ethgasviewer.server.model.TokenPriceModel;
import com.ethgasviewer.server.grabber.TokenInfoService;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Profile("grab")
public class TokenController {
    private final TokenInfoService tokenInfoService;

    public TokenController(TokenInfoService tokenInfoService) {
        this.tokenInfoService = tokenInfoService;
    }

    @RequestMapping(value = "api/token/history/{name}", method = RequestMethod.GET)
    public Iterable<TokenPriceModel> historyData(@PathVariable("name") String name) {
        return tokenInfoService.loadHistory(name);
    }

    @RequestMapping(value = "api/token/last/{name}/{fromDate}", method = RequestMethod.GET)
    public Iterable<TokenPriceModel> lastData(
            @PathVariable("name") String name,
            @PathVariable("fromDate") long fromDate) {
        return tokenInfoService.loadLastData(fromDate, name);
    }
}
