package com.ethgasviewer.server;

import com.ethgasviewer.server.security.CustomAuthenticationEntryPoint;
import com.ethgasviewer.server.security.CustomLogoutSuccessHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.rest.RepositoryRestMvcAutoConfiguration;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.filter.CommonsRequestLoggingFilter;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;
import java.util.Properties;

@SpringBootApplication
public class Application {
    private static final Logger log = LogManager.getRootLogger();

    public static void main(String[] args) {
        log.info("start");
        SpringApplication.run(Application.class, args);
    }

    @Configuration
    @EnableTransactionManagement
    @EnableScheduling
    @EnableAspectJAutoProxy
    @EnableAutoConfiguration(exclude = RepositoryRestMvcAutoConfiguration.class)
    @EnableConfigurationProperties({
            AppProperties.class
    })
    @EnableGlobalMethodSecurity(securedEnabled = true)
    @Order(SecurityProperties.BASIC_AUTH_ORDER - 2)
    protected static class SecurityConfiguration extends WebSecurityConfigurerAdapter {

        @Bean
        public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }

        @Bean
        public LogoutSuccessHandler logoutSuccessHandler() {
            return new CustomLogoutSuccessHandler();
        }

        @Bean
        public AuthenticationEntryPoint authenticationEntryPoint() {
            return new CustomAuthenticationEntryPoint();
        }

        @Bean
        public AuthenticationManager authenticationManagerBean() throws Exception {
            return super.authenticationManagerBean();
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                    .httpBasic()
                    .and()
                    .exceptionHandling()
//                    .authenticationEntryPoint(authenticationEntryPoint())
                    .and()
                    .authorizeRequests()
                    .antMatchers(
                            "/", "/favicon.ico", "/*.js", "/*.css",
                            "/assets/**", "/assets/images/**",
                            "/login", "/auth", "/api/**", "/api/posting/status", "/registration/**"
                    ).permitAll()
//                    .anyRequest().authenticated()
//                    .antMatchers("/api/admin/**").hasRole("ADMIN")
                    .and().logout().logoutSuccessHandler(logoutSuccessHandler())
                    .and().csrf().disable()
//                    .and().csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            ;

//            http.requiresChannel().anyRequest().requiresSecure();
        }
    }

    @Configuration
    protected static class WebMvcConfig implements WebMvcConfigurer {
        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {

            registry.addResourceHandler("/**/*")
                    .addResourceLocations("classpath:/static/")
                    .resourceChain(true)
                    .addResolver(new PathResourceResolver() {
                        @Override
                        protected Resource getResource(String resourcePath,
                                                       Resource location) throws IOException {
                            Resource requestedResource = location.createRelative(resourcePath);
                            return requestedResource.exists() && requestedResource.isReadable() ? requestedResource
                                    : new ClassPathResource("/static/index.html");
                        }
                    });
        }
    }

    @Bean
    public SchedulerFactoryBean schedulerFactoryBean() {
        SchedulerFactoryBean scheduler = new SchedulerFactoryBean();
        Properties quartzProperties = new Properties();
        quartzProperties.put("org.quartz.threadPool.threadCount", "1");
        scheduler.setQuartzProperties(quartzProperties);
        return scheduler;
    }

    @Bean
    public CommonsRequestLoggingFilter requestLoggingFilter() {
        CommonsRequestLoggingFilter loggingFilter = new CommonsRequestLoggingFilter();
        loggingFilter.setIncludeClientInfo(true);
        loggingFilter.setIncludeQueryString(false);
        loggingFilter.setIncludePayload(false);
        loggingFilter.setMaxPayloadLength(64000);
        return loggingFilter;
    }

}
