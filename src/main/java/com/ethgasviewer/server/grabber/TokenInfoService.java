package com.ethgasviewer.server.grabber;


import com.ethgasviewer.server.properties.GrabProperties;
import com.ethgasviewer.server.entity.TokenEntity;
import com.ethgasviewer.server.model.TokenEnum;
import com.ethgasviewer.server.model.TokenInfoModel;
import com.ethgasviewer.server.model.TokenPriceModel;
import com.ethgasviewer.server.repositories.TokenRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import static com.ethgasviewer.server.GrabberApplication.GRAB_PROFILE;


@Service
@Profile({GRAB_PROFILE})
public class TokenInfoService {
    private static final Logger log = LoggerFactory.getLogger(TokenInfoService.class);
    private static final RestTemplate REST_TEMPLATE = new RestTemplate();
    private static final ObjectMapper mapper = new ObjectMapper();
    private static final String URI = "https://api.ethplorer.io/";
    private final String uriTokenInfo;

    private final GrabProperties prop;
    private final TokenRepository tokenRepository;

    public TokenInfoService(GrabProperties prop, TokenRepository tokenRepository) {
        this.prop = prop;
        this.tokenRepository = tokenRepository;
        this.uriTokenInfo = URI + "getTokenInfo/" + prop.getTokenAddress() + "?apiKey=" + prop.getEthplorerApiKey();
    }

    public TokenInfoModel getTokenInfo() throws IOException {
        log.info("Use URI " + uriTokenInfo);
        String result = REST_TEMPLATE.getForObject(uriTokenInfo, String.class);
        return mapper.readValue(result, TokenInfoModel.class);
    }

    public void saveTokenInfo(TokenInfoModel model) {
        tokenRepository.save(modelToEntity(model));
    }

    public List<TokenPriceModel> loadHistory(String name) {
        long lastDate = Instant.now().minus(prop.getProvideLastDays(), ChronoUnit.DAYS).toEpochMilli();
        return loadLastData(lastDate, name);
    }

    public List<TokenPriceModel> loadLastData(long lastDate, String name) {
        TokenEnum tokenEnum = TokenEnum.valueOf(name);
        List<TokenEntity> r = tokenRepository.getFromDate(lastDate, tokenEnum.getId());
        List<TokenPriceModel> result = new ArrayList<>();
        for (TokenEntity e : r) {
            TokenPriceModel model = entityToModel(e);
            result.add(model);
        }
        return result;
    }

    private static TokenEntity modelToEntity(TokenInfoModel model) {
        TokenEntity entity = new TokenEntity();
        entity.setAcquired(Instant.now().toEpochMilli());
        entity.setNameId(TokenEnum.valueOf(model.getSymbol()).getId());
        entity.setPrice(Double.parseDouble(model.getPrice().getRate()));
        entity.setVolume(Double.parseDouble(model.getPrice().getVolume24h()));
        return entity;
    }

    private static TokenPriceModel entityToModel(TokenEntity entity) {
        TokenPriceModel model = new TokenPriceModel();
        model.setAcquired(entity.getAcquired());
        model.setPrice(entity.getPrice());
        model.setVolume(entity.getVolume());
        return model;
    }

}
