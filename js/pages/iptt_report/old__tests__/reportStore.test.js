import ReportStore from '../models/reportStore';


describe('ReportStore', () =>{
    it('instances without crashing', () =>{
        let instance = new ReportStore({});
        expect(instance).toBeDefined();
    });
    describe('instanced Report Store', () => {
        var instance;
        var mockFilterStore = {
            program: {
                name: 'Program Name'
            },
            periods: {
                periodRange(start, end) {
                    return ['p0', 'p1', 'p2', 'p3', 'p4'].slice(start, end+1);
                }
            }
        };
        beforeEach(() => {
            instance = new ReportStore(mockFilterStore);
        });
        it('displays program name correctly', () => {
            expect(instance.programName).toEqual('Program Name');
        });
        it('reports level style correctly', () => {
            mockFilterStore.oldLevels = true;
            expect(instance.levelColumn).toBeTruthy();
        });
        it('reports level style correctly', () => {
            mockFilterStore.oldLevels = false;
            expect(instance.levelColumn).toBeFalsy();
        });
        it('reports filtered periods correctly', () => {
            mockFilterStore.startPeriod = 0;
            mockFilterStore.endPeriod = 4;
            expect(instance.reportPeriods.length).toEqual(5);
            mockFilterStore.startPeriod = 4;
            expect(instance.reportPeriods.length).toEqual(1);
            mockFilterStore.startPeriod = 2;
            mockFilterStore.endPeriod = 4;
            expect(instance.reportPeriods.length).toEqual(3);
        });
    });
});