package xyz.farmdashboard.server.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import xyz.farmdashboard.server.Application;
import xyz.farmdashboard.server.entity.HarvestTxEntity;
import xyz.farmdashboard.server.repositories.HarvestTxRepository;

import java.util.List;

import static org.junit.Assert.assertNotNull;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
@ActiveProfiles("test")
public class HarvestDBServiceTest {
    @Autowired
    private HarvestDBService harvestDBService;

    @Test
    public void fetchLastTvl() {
        List<HarvestTxEntity> dtos = harvestDBService.fetchLastTvl();
        assertNotNull(dtos);
    }
}
