package com.ethgasviewer.server.service;

import com.ethgasviewer.server.AppProperties;
import com.ethgasviewer.server.entity.TgEntity;
import com.ethgasviewer.server.repositories.TgRepository;
import com.pengrad.telegrambot.Callback;
import com.pengrad.telegrambot.TelegramBot;
import com.pengrad.telegrambot.UpdatesListener;
import com.pengrad.telegrambot.model.Update;
import com.pengrad.telegrambot.request.BaseRequest;
import com.pengrad.telegrambot.request.GetUpdates;
import com.pengrad.telegrambot.request.SendMessage;
import com.pengrad.telegrambot.response.BaseResponse;
import com.pengrad.telegrambot.response.GetUpdatesResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import static com.pengrad.telegrambot.UpdatesListener.CONFIRMED_UPDATES_ALL;

@Service
public class TelegramBotService {
    private static final Logger log = LoggerFactory.getLogger(TelegramBotService.class);
    private static final String WELCOME_MESSAGE = "Welcome to ethgasviewer notification bot!";
    private final TgRepository tgRepository;
    private final TelegramBot bot;

    private final Callback callback = new Callback() {
        @Override
        public void onResponse(BaseRequest request, BaseResponse response) {
            log.info("Bot response for " + request.toWebhookResponse()
                    + " " + response.errorCode()
                    + " " + response.description());
        }

        @Override
        public void onFailure(BaseRequest request, IOException e) {
            log.error("Bot Error for " + request.toWebhookResponse(), e);
        }
    };

    public TelegramBotService(AppProperties properties, TgRepository tgRepository) {
        this.tgRepository = tgRepository;
        this.bot = new TelegramBot(properties.getTelegramBotToken());
        bot.setUpdatesListener(this::updatesListener);
    }

    public void sendMessageToAll(String message) {
        for (long id : findAllChats()) {
            bot.execute(new SendMessage(id, message), callback);
        }
    }

    public void sendMessage(String message, long chatId) {
        bot.execute(new SendMessage(chatId, message), callback);
    }

    private int updatesListener(List<Update> updates) {
        for (Update u : updates) {
            long chatId = u.message().chat().id();
            if(!isKnownChatId(chatId)) {
                log.info("Chat added " + chatId);
                sendMessage(WELCOME_MESSAGE, chatId);
                tgRepository.save(new TgEntity(chatId));
            }
        }
        return CONFIRMED_UPDATES_ALL;
    }

    private List<Long> findAllChats() {
        return tgRepository.findAll().stream()
                .map(TgEntity::getChat)
                .collect(Collectors.toList());
    }

    private boolean isKnownChatId(long id) {
        return tgRepository.findById(id).isPresent();
    }

}
