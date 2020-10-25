package com.ethgasviewer.server.web3;

import com.ethgasviewer.server.model.UniswapTx;
import org.junit.Test;
import org.web3j.protocol.core.methods.response.Transaction;

import static org.junit.Assert.assertEquals;

public class UniswapEventDecoderTest {

    UniswapEventDecoder uniswapEventDecoder = new UniswapEventDecoder();

    @Test
    public void decodeInputDataTest() {
        Transaction transaction = new Transaction();
        transaction.setFrom("from");
        transaction.setBlockHash("block_hash");
        transaction.setInput("0x18cbafe5000000000000000000000000000000000000000000000001fe45e5de966594d000000000000000000000000000000000000000000000000041d365d0a1b5e40000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000006f12fe9b19e1227842c4587364aa77088d1fc6be000000000000000000000000000000000000000000000000000000005f9581bb00000000000000000000000000000000000000000000000000000000000000020000000000000000000000009ceb84f92a0561fa3cc4132ab9c0b76a59787544000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
        UniswapTx uniswapTx = uniswapEventDecoder.decodeInputData(transaction);
        assertEquals("", ""); //todo
    }
}
