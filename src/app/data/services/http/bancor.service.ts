import { Injectable } from '@angular/core';
import { WsConsumer } from '@data/services/ws-consumer';
import { WebsocketService } from '@data/services/websocket.service';
import { Observable, Subscriber } from 'rxjs';
import { BancorDto } from '@data/models/bancor-dto';


@Injectable({
    providedIn: 'root'
})
export class BancorService implements WsConsumer {
    subscribed = false;
    private $subscribers: Subscriber<BancorDto>[] = [];

    constructor(private ws: WebsocketService) {
        this.ws.registerConsumer(this);
    }

    /**
     * DON'T USE! for parent class only
     */
    isSubscribed(): boolean {
        return this.subscribed;
    }

    /**
     * DON'T USE! for parent class only
     */
    setSubscribed(s: boolean): void {
        this.subscribed = s;
    }

    /**
     * DON'T USE! for parent class only
     */
    subscribeToTopic(): void {
        this.ws.onMessage('/topic/bancor_transactions', (m => BancorDto.fromJson(m.body)))
        ?.subscribe(tx => this.$subscribers.forEach(_ => _.next(tx)));
    }

    /**
     * ONLY FOR DATA SERVICE
     */
    public subscribeToBancor(): Observable<BancorDto> {
        return new Observable(subscriber => {
            this.$subscribers.push(subscriber);
        });
    }
}
