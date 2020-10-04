package com.ethgasviewer.server.controllers;

import com.ethgasviewer.server.dto.WebErrorDTO;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LogController {
    private static final Logger log = LogManager.getRootLogger();

    @RequestMapping(value = "api/logs", method = RequestMethod.POST)
    public ResponseEntity<String> postingStatus(@RequestBody WebErrorDTO error) {
        log.info("Web error:" + error);

        return ResponseEntity.ok().build();
    }
}
