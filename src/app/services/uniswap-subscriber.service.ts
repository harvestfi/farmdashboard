import {Injectable} from '@angular/core';
import {WebsocketService} from '../services/websocket.service';
import {NGXLogger} from 'ngx-logger';
import {WsConsumer} from "./ws-consumer";
import {UniswapDto} from "../models/uniswap-dto";
import {Observable, Subscriber} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UniswapSubscriberService implements WsConsumer {
    subscribed = false;
    private $subscribers: Subscriber<UniswapDto>[] = [];

    constructor(private ws: WebsocketService, private log: NGXLogger) {
        if (this.ws.registerConsumer(this) && !this.subscribed) {
            this.subscribeToTopic();
        }
    }

    setSubscribed(s: boolean): void {
        this.subscribed = s;
    }

    isSubscribed(): boolean {
        return this.subscribed;
    }

    subscribeToTopic(): void {
        this.ws.onMessage('/topic/transactions', (m => UniswapDto.fromJson(m.body)))
            ?.subscribe(tx => this.$subscribers.forEach(_ => _.next(tx)));
    }

    subscribeToUniswapEvents(): Observable<UniswapDto> {
        return new Observable(subscriber => {
            this.$subscribers.push(subscriber);
        });
    }

}
