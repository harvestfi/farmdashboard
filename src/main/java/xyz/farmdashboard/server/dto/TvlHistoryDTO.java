package xyz.farmdashboard.server.dto;

import lombok.Data;

@Data
public class TvlHistoryDTO {
    private long calculateTime;
    private double lastTvl;
    private double sharePrice;
    private int lastOwnersCount;
    private double lastPrice;
    private double lastTvlNative;
}
