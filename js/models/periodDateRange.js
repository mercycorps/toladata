import { extendObservable } from 'mobx';


const bareRange = (
    rangeJSON = {}
) => ({
    frequency: parseInt(rangeJSON.frequency),
    periods: rangeJSON.periods,
    get periodCount() {
        return this.periods.length;
    },
    get currentPeriod() {
        if ([1, 2, 8].indexOf(this.frequency) !== -1) {
            return null;
        }
        return this.periods.filter(period => period.past).length - 1;
    }
});

export const getPeriodDateRange = (
    ...rangeConstructors
) => (rangeJSON) => {
    return [bareRange, ...rangeConstructors].reduce(
        (acc, fn) => extendObservable(acc, fn(rangeJSON)), {});
}
