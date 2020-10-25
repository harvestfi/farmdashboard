package com.ethgasviewer.server.grabber;

import com.ethgasviewer.server.GrabberApplication;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.Instant;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = GrabberApplication.class)
@ActiveProfiles("test")
public class TelegramBotServiceTest {

    @Autowired
    private TelegramBotService bot;

    @Test
    @Ignore
    public void shouldSendMessage() throws InterruptedException {
        Thread.sleep(10000);
        bot.sendMessageToAll("test msg " + Instant.now());
        Thread.sleep(10000);
    }
}
