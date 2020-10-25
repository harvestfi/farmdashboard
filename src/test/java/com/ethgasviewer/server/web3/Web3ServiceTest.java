package com.ethgasviewer.server.web3;

import com.ethgasviewer.server.GrabberApplication;
import com.ethgasviewer.server.Web3Application;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import static com.ethgasviewer.server.Web3Application.WEB3_PROFILE;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Web3Application.class)
@ActiveProfiles({"test", WEB3_PROFILE})
public class Web3ServiceTest {


    @Autowired
    private Web3Service web3Service;

    @Test
    public void test() throws InterruptedException {
        Thread.sleep(1000000000);
    }
}
