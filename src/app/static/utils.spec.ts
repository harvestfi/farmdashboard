import {Utils} from './utils';

describe('Utils', () => {

    describe('isAutoStakeVault', () => {
        it('should filter anything that looks like a vault name', () => {
            expect(Utils.isAutoStakeVault(`PS`)).toBe(true);
        });
    });
});
