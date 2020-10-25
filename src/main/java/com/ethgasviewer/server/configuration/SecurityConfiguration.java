package com.ethgasviewer.server.configuration;

import com.ethgasviewer.server.properties.GrabProperties;
import com.ethgasviewer.server.properties.Web3Properties;
import com.ethgasviewer.server.security.CustomAuthenticationEntryPoint;
import com.ethgasviewer.server.security.CustomLogoutSuccessHandler;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.rest.RepositoryRestMvcAutoConfiguration;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.core.annotation.Order;
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

import java.util.Properties;

@Configuration
@EnableTransactionManagement
@EnableScheduling
@EnableAspectJAutoProxy
@EnableAutoConfiguration(exclude = RepositoryRestMvcAutoConfiguration.class)
@EnableConfigurationProperties({
    GrabProperties.class,
    Web3Properties.class
})
@EnableGlobalMethodSecurity(securedEnabled = true)
@Order(SecurityProperties.BASIC_AUTH_ORDER - 2)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
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
