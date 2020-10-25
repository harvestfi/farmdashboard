package com.ethgasviewer.server;

import com.ethgasviewer.server.web3.Web3Service;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.web.WebApplicationInitializer;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;

@SpringBootApplication
public class Web3Application {
    public static final String WEB3_PROFILE = "web3";

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(Web3Application.class, args);
//        context.getBean(ConfigurableEnvironment.class).setActiveProfiles(WEB3_PROFILE);
//        context.getBean(Web3Service.class).subscribe();
    }

}
