package com.ethgasviewer.server.service;


import com.ethgasviewer.server.AppProperties;
import com.ethgasviewer.server.entity.GasEntity;
import com.ethgasviewer.server.model.GasModel;
import com.ethgasviewer.server.repositories.GasRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;


@Service
public class GasService {
    private static final Logger log = LoggerFactory.getLogger(GasService.class);
    private final AppProperties prop;

    private static final ObjectMapper mapper = new ObjectMapper();
    private final String URI;

    private final GasRepository gasRepository;

    public GasService(AppProperties prop, GasRepository gasRepository) {
        this.prop = prop;
        if(prop.isUseApiKey()) {
            URI = "https://ethgasstation.info/api/ethgasAPI.json?api-key=" + prop.getEthgasstationApi();
        } else {
            URI = "https://ethgasstation.info/api/ethgasAPI.json";
        }
        this.gasRepository = gasRepository;
    }


    public GasModel grabGasInfo() throws IOException {
        RestTemplate restTemplate = new RestTemplate();
        log.info("Use URI " + URI);
        String result = restTemplate.getForObject(URI, String.class);
        return mapper.readValue(result, GasModel.class);
    }

    public void saveGasModel(GasModel gasModel) {
        GasEntity gasEntity = mapToEntity(gasModel);
        gasRepository.save(gasEntity);
    }

    public List<GasModel> loadHistory() {
        long lastDate = Instant.now().minus(prop.getProvideLastDays(), ChronoUnit.DAYS).toEpochMilli();
        return loadLastData(lastDate);
    }

    public List<GasModel> loadLastData(long lastDate) {
        List<GasEntity> r = gasRepository.getFromDate(lastDate);
        List<GasModel> result = new ArrayList<>();
        for (GasEntity e : r) {
            GasModel gasModel = mapToModel(e);
            result.add(gasModel);
        }
        return result;
    }

    public static GasEntity mapToEntity(GasModel gasModel) {
        GasEntity gasEntity = new GasEntity();
        gasEntity.setAcquired(Instant.now().toEpochMilli());
        gasEntity.setFastest(gasModel.getFastest());
        gasEntity.setFast(gasModel.getFast());
        gasEntity.setAverage(gasModel.getAverage());
        gasEntity.setSafeLow(gasModel.getSafeLow());
        gasEntity.setBlockTime(gasModel.getBlock_time());
        gasEntity.setBlockNum(gasModel.getBlockNum());
        gasEntity.setSpeed(gasModel.getSpeed());
        return gasEntity;
    }

    public static GasModel mapToModel(GasEntity e) {
        GasModel gasModel = new GasModel();
        gasModel.setAcquired(e.getAcquired());
        gasModel.setFastest(e.getFastest());
        gasModel.setFast(e.getFast());
        gasModel.setAverage(e.getAverage());
        gasModel.setSafeLow(e.getSafeLow());
        gasModel.setBlock_time(e.getBlockTime());
        ;
        gasModel.setBlockNum(e.getBlockNum());
        gasModel.setSpeed(e.getSpeed());
        return gasModel;
    }

}
