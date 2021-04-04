import {Pipe, PipeTransform} from '@angular/core';
import {RewardDto} from '../../models/reward-dto';

@Pipe({
    name: 'vaultFilter',
    pure: false
})
export class VaultFilterPipe implements PipeTransform {

    transform(dtos: RewardDto[], vault: string): RewardDto[] {
        if (vault !== '') {
            return dtos.filter(_ => _.vault === vault);
        }
        return dtos;
    }

}
