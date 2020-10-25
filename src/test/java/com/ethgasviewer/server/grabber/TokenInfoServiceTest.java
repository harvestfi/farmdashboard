package com.ethgasviewer.server.grabber;

import com.ethgasviewer.server.GrabberApplication;
import com.ethgasviewer.server.model.TokenInfoModel;
import junit.framework.TestCase;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = GrabberApplication.class)
@ActiveProfiles("test")
public class TokenInfoServiceTest extends TestCase {
    @Autowired
    TokenInfoService tokenInfoService;

    @Test
    public void test() throws IOException {
        TokenInfoModel r = tokenInfoService.getTokenInfo();
        System.out.println(r);
    }


}
