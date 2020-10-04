package com.ethgasviewer.server;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

public class Utils {
    public static final String ACTIVE_STATUS = "Active";
    public static final String BLOCKED_STATUS = "Blocked";

    public static String requestUrl(HttpServletRequest request) {
        String url = request.getRequestURL().toString();
        int i = url.indexOf("/", 9);
        if (i == -1) {
            url = "/";
        } else {
            url = url.substring(i);
        }
        StringBuilder requestURL = new StringBuilder(url);
        String queryString = request.getQueryString();
        if (queryString == null) {
            return requestURL.toString();
        } else {
            return requestURL.append('?').append(queryString).toString();
        }
    }

    public static String requestInputStream(HttpServletRequest request) {

        ServletInputStream mServletInputStream;
        try {
            mServletInputStream = request.getInputStream();
            if (request.getContentLength() < 0) return "";
            byte[] httpInData = new byte[request.getContentLength()];
            int retVal;
            StringBuilder stringBuilder = new StringBuilder();
            while ((retVal = mServletInputStream.read(httpInData)) != -1) {
                for (int i = 0; i < retVal; i++) {
                    stringBuilder.append(Character.toString((char) httpInData[i]));
                }
            }
            return stringBuilder.toString();
        } catch (IOException e) {
            return "error parse " + e.getMessage();
        }
    }

    public static String requestHeaders(HttpServletRequest request) {
        StringBuilder out = new StringBuilder();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            out.append(headerName).append(":").append(request.getHeader(headerName)).append("\n");
        }
        return out.toString();
    }

    public static String requestParameters(HttpServletRequest request) {
        StringBuilder p = new StringBuilder();
        for (String key : request.getParameterMap().keySet()) {
            p.append(key).append(":").append(request.getParameter(key));
        }
        return p.toString();
    }

    public static String requestToString(HttpServletRequest request) {
        return Utils.requestUrl(request) + "\n"
                + Utils.requestHeaders(request) + "\n"
                + Utils.requestParameters(request) + "\n"
                + Utils.requestInputStream(request);
    }

    public static String getErrorString(BindingResult bindingResult) {
        StringBuilder result = new StringBuilder();
        for (ObjectError error : bindingResult.getAllErrors()) {
            if (error instanceof FieldError) {
                FieldError fe = (FieldError) error;
                result.append("Error with field ").append(fe.getField()).append("; ");
            }
        }
        result.setLength(result.length() - 1);
        return result.toString();
    }

    public static void writeInResponse(HttpServletResponse response, Exception e, ObjectMapper objectMapper, int code) throws IOException {
        Map<String, Object> data = new HashMap<>();
        data.put("message", e.getMessage());
        response.setStatus(code);
        response.getOutputStream().println(objectMapper.writeValueAsString(data));
    }

    public static boolean isEmpty(String s) {
        return (s == null || s.trim().isEmpty());
    }

    public static String doubleToString(Double d, int decimals) {
        if (d == null) return "";
        if (d == 0) return "0,00";
        DecimalFormatSymbols decimalFormatSymbols = new DecimalFormatSymbols();
        decimalFormatSymbols.setDecimalSeparator(',');
        decimalFormatSymbols.setGroupingSeparator(' ');
        StringBuilder zeros = new StringBuilder();
        for (int i = 0; i < decimals; i++) {
            zeros.append("0");
        }
        DecimalFormat decimalFormat = new DecimalFormat("#,##0." + zeros, decimalFormatSymbols);
        decimalFormat.setGroupingUsed(false);
        return decimalFormat.format(d);
    }

    public static String toLikeTerm(String s) {
        if (s != null && !s.trim().isEmpty())
            return "%" + s + "%";
        else
            return "%%";
    }
}
