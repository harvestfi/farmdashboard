package xyz.farmdashboard.server.dto;

import lombok.Data;
import xyz.farmdashboard.server.entity.IncomeEntity;

@Data
public class IncomeDTO {
    private long timestamp;
    private double amount;
    private double amountUsd;
    private double amountSum;
    private double amountSumUsd;
    private double psTvl;
    private double psTvlUsd;
    private double perc;
    private double weekPerc;

    public static IncomeDTO fromEntity(IncomeEntity entity) {
        IncomeDTO dto = new IncomeDTO();

        dto.setTimestamp(entity.getTimestamp());
        dto.setAmount(entity.getAmount());
        dto.setAmountUsd(entity.getAmountUsd());
        dto.setAmountSum(entity.getAmountSum());
        dto.setAmountSumUsd(entity.getAmountSumUsd());
        dto.setPsTvl(entity.getPsTvl());
        dto.setPsTvlUsd(entity.getPsTvlUsd());
        dto.setPerc(entity.getPerc());
        dto.setWeekPerc(entity.getWeekPerc());

        return dto;
    }
}
