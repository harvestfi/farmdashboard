package com.ethgasviewer.server.controllers;

import com.ethgasviewer.server.Utils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
public class CustomErrorController implements ErrorController {
    private static final String PATH = "/error";
    private static final Logger log = LogManager.getRootLogger();
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String getErrorPath() {
        return PATH;
    }

//    @RequestMapping("/error")
    public void handleError(HttpServletRequest request, HttpServletResponse response, Exception e) throws IOException {
        log.info("Handle error " + e.getMessage()
                + " \n" + Utils.requestToString(request)
        );
        if (Utils.requestUrl(request).equals("/error")) {
            response.sendRedirect("/");
            return;
        }
        Utils.writeInResponse(response, e, objectMapper, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
    }

}
