import {EventEmitter, Inject, Injectable, OnDestroy} from '@angular/core';
import {APP_CONFIG, AppConfig} from 'src/app.config';
import {NGXLogger} from 'ngx-logger';

@Injectable({
    providedIn: 'root'
})
export class HttpMetricsService {

    private bufferSize = 0;
    private totalCompleted = 0;
    public events = new EventEmitter<boolean>();
    private callCounter = 0;

    constructor(@Inject(APP_CONFIG) public config: AppConfig,
                private log: NGXLogger) {
    }

    register(buffer): void {
        this.bufferSize += buffer;
        console.log(`===> Buffer is ${this.bufferSize}`);
        this.events.emit(this.isBuffering());
        console.log(`===> is buffer`, this.isBuffering());
    }

    completed(amount: number) {
        this.totalCompleted += amount;
        this.callCounter += 1;
        console.log(`Call counter`, this.callCounter, amount);
        console.log(`===> Completed is ${this.bufferSize}`);
        this.events.emit(this.isBuffering());
        console.log(`===> is buffer`, this.isBuffering());
    }

    private isBuffering(): boolean {
        return this.totalCompleted < this.bufferSize;
    }

}
