import { extendObservable } from 'mobx';


const bareRange = (
    rangeJSON = {}
) => ({
    frequency: parseInt(rangeJSON.frequency),
    get periodCount() {
        return this.periods.length;
    },
    get currentPeriod() {
        if ([1, 2, 8].includes(this.frequency)) {
            return null;
        }
        return this.periods.filter(period => period.past).length - 1;
    },
    getLabel(period) {
        if ([3, 4, 5, 6].includes(this.frequency)) {
            return `${period.name} (${period.label})`;
        }
        if (this.frequency == 7) {
            return period.name;
        }
    },
    get options() {
        return this.periods.map((period, index) => ({value: index, label: this.getLabel(period), year: period.year}));
    }
});

export const getPeriodDateRange = (
    ...rangeConstructors
) => (rangeJSON) => {
    return [bareRange, ...rangeConstructors].reduce(
        (acc, fn) => extendObservable(acc, fn(rangeJSON)), {});
}
