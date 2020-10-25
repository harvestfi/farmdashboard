package com.ethgasviewer.server;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.ConfigurableEnvironment;

@SpringBootApplication
public class GrabberApplication {
    public static final String GRAB_PROFILE = "grab";

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(GrabberApplication.class, args);
        context.getBean(ConfigurableEnvironment .class).setActiveProfiles(GRAB_PROFILE);
    }




}
