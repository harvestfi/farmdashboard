package xyz.farmdashboard.server.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GasDTO {
    //{"fast":1760,"fastest":2000,"safeLow":1160,"average":1290,"block_time":12.166666666666666,"blockNum":10762046,"speed":0.9988506180250818,"safeLowWait":17.5,"avgWait":4,"fastWait":0.4,"fastestWait":0.4,"gasPriceRange":{"4":202.8,"6":202.8,"8":202.8,"10":202.8,"20":202.8,"30":202.8,"40":202.8,"50":202.8,"60":202.8,"70":202.8,"80":202.8,"90":202.8,"100":202.8,"110":202.8,"120":202.8,"130":202.8,"140":202.8,"150":202.8,"160":202.8,"170":202.8,"180":202.8,"190":202.8,"200":202.8,"220":202.8,"240":202.8,"260":202.8,"280":202.8,"300":202.8,"320":202.8,"340":202.8,"360":202.8,"380":202.8,"400":202.8,"420":202.8,"440":202.8,"460":202.8,"480":202.8,"500":202.8,"520":202.8,"540":202.8,"560":202.8,"580":202.8,"600":202.8,"620":202.8,"640":202.8,"660":202.8,"680":202.8,"700":202.8,"720":202.8,"740":202.8,"760":202.8,"780":202.8,"800":202.8,"820":202.8,"840":202.8,"860":202.8,"880":202.8,"900":202.8,"920":202.8,"940":202.8,"960":202.8,"980":202.8,"1000":202.8,"1020":202.8,"1040":202.8,"1060":23.2,"1080":21.6,"1100":20.1,"1120":20.1,"1140":20.1,"1160":17.5,"1180":14.1,"1200":11.4,"1220":11.4,"1240":11.4,"1260":11.4,"1280":4.9,"1290":4,"1300":3.4,"1320":3,"1340":2,"1360":2,"1380":1.6,"1400":1.4,"1420":1.4,"1440":1.3,"1460":1,"1480":1,"1500":0.8,"1520":0.7,"1540":0.7,"1560":0.7,"1580":0.6,"1600":0.6,"1620":0.5,"1640":0.5,"1660":0.5,"1680":0.5,"1700":0.5,"1720":0.4,"1740":0.4,"1760":0.4,"1780":0.4,"1800":0.4,"1820":0.4,"1840":0.4,"1860":0.4,"1880":0.4,"1900":0.4,"1920":0.4,"1940":0.4,"1960":0.4,"1980":0.4,"2000":0.4}}
    private long id;
    private long acquired;
    //fast: Recommended fast(expected to be mined in < 2 minutes) gas price in x10 Gwei(divite by 10 to convert it to gwei)
    private long fast;
    //fastest: Recommended fastest(expected to be mined in < 30 seconds) gas price in x10 Gwei(divite by 10 to convert it to gwei)
    private long fastest;
    //safeLow: Recommended safe(expected to be mined in < 30 minutes) gas price in x10 Gwei(divite by 10 to convert it to gwei)
    private long safeLow;
    //average: Recommended average(expected to be mined in < 5 minutes) gas price in x10 Gwei(divite by 10 to convert it to gwei)
    private long average;
    //block_time: Average time(in seconds) to mine one single block
    private long block_time;
    //blockNum: Latest block number
    private long blockNum;
    //speed: Smallest value of (gasUsed / gaslimit) from last 10 blocks
    private long speed;
    //safeLowWait: Waiting time(in minutes) for safeLow gas price
    private long safeLowWait;
    //avgWait: Waiting time(in minutes) for average gas price
    private long avgWait;
    //fastWait: Waiting time(in minutes) for fast gas price
    private long fastWait;
    //fastestWait: Waiting time(in minutes) for fastest gas price
    private long fastestWait;
}
