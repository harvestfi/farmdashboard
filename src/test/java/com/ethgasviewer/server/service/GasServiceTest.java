package com.ethgasviewer.server.service;

import com.ethgasviewer.server.Application;
import com.ethgasviewer.server.model.GasModel;
import junit.framework.TestCase;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.Assert;

import java.io.IOException;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
public class GasServiceTest extends TestCase {

    @Autowired
    private GasService gasService;

    @Test
    public void testGatheringGas() throws IOException {
        GasModel gas = gasService.grabGasInfo();
        Assert.notNull(gas, "Return should be not null");
    }
}
