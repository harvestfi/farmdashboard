package com.ethgasviewer.server.controllers;

import com.ethgasviewer.server.model.TransactionDTO;
import com.ethgasviewer.server.service.TransactionsService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TransactionsController {
    private final TransactionsService transactionsService;

    public TransactionsController(TransactionsService transactionsService) {
        this.transactionsService = transactionsService;
    }

    @RequestMapping(value = "api/transactions/history", method = RequestMethod.GET)
    public Iterable<TransactionDTO> historyData() {
        return transactionsService.fetchAllForLastDay();
    }
}
