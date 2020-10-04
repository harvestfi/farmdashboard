package com.ethgasviewer.server.security;


import com.ethgasviewer.server.Utils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private static final Logger log = LogManager.getRootLogger();

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final ArrayList<String> JUST_REDIRECT = new ArrayList<>(Arrays.asList("/login"));

    @Override
    public void commence(
            final HttpServletRequest request,
            final HttpServletResponse response,
            final AuthenticationException e) throws IOException {
        String url = Utils.requestUrl(request);

        if (JUST_REDIRECT.contains(url)) {
            response.sendRedirect("/");
            return;
        }

        log.warn(url + " " + e);

        Utils.writeInResponse(response, e, objectMapper, HttpServletResponse.SC_FORBIDDEN);
    }

    @ExceptionHandler(value = {AccessDeniedException.class})
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AccessDeniedException e) throws IOException {
        log.warn(Utils.requestUrl(request) + " " + e);
        packData(response, e, HttpServletResponse.SC_FORBIDDEN);
    }

    @ExceptionHandler(value = {Exception.class})
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         Exception e) throws IOException {
        log.error(Utils.requestUrl(request) + " " + e.getMessage(), e);
        packData(response, e, 520);
    }

    private void packData(HttpServletResponse response, Throwable e, int status) throws IOException {
        Map<String, Object> data = new HashMap<>();
        data.put("error", e.getMessage());
        response.setStatus(status);
        response.getOutputStream().println(objectMapper.writeValueAsString(data));
    }
}
