package xyz.farmdashboard.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import xyz.farmdashboard.server.repositories.UniswapTxRepository;

@Data
public class OhlcDTO implements UniswapTxRepository.OhlcProjection {
    private long timestamp;
    private double open;
    private double high;
    private double low;
    private double close;
    private double volume;
}
