package com.ethgasviewer.server.service;

import com.ethgasviewer.server.Application;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
@ActiveProfiles("test")
public class NotificationServiceTest {

    @Autowired
    private NotificationService notificationService;

    @Test
    public void shouldCreatePriceBigMoveMessage() {
        notificationService.priceNotification(1.0);
        String msg = notificationService.priceNotification(100.0);
        assertEquals("Big move price from 1,00 to 100,00 (9900%)", msg);
        msg = notificationService.priceNotification(98.0);
        assertEquals("Big move price from 100,00 to 98,00 (-2%)", msg);
    }
}
