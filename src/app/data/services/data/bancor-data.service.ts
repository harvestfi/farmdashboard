import { Injectable } from '@angular/core';
import { StaticValues } from '@data/static/static-values';
import { BancorDto } from '@data/models/bancor-dto';
import { NGXLogger } from 'ngx-logger';
import { BancorService } from '@data/services/http/bancor.service';

@Injectable({
    providedIn: 'root'
})
export class BancorDataService {

    private bancorTransactions = new Map<string, Map<string, BancorDto>>(
        Array.from(StaticValues.NETWORKS.keys()).map(name => [name, new Map()])
    );

    constructor(
        private bancorService: BancorService,
        private log: NGXLogger
    ) {
        this.load();
    }

    private load(): void {
        this.bancorService.subscribeToBancor().subscribe(this.handle.bind(this));
    }

    private handle(dto: BancorDto): void {
        console.log(dto);
    }
}