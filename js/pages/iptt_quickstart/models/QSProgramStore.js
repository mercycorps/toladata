import QSProgram from './ipttQSProgram';


export default class QSProgramStore  {
    constructor(rootStore, programsJSON) {
        this.rootStore = rootStore;
        this.programs = new Map((programsJSON || []).map(programJSON => {
            let program = new QSProgram(programJSON);
            return [program.pk, program];
        }).sort(
            (a, b) => {
                return a[1].name.toUpperCase() < b[1].name.toUpperCase() ?
                    -1 :
                    a[1].name.toUpperCase() > b[1].name.toUpperCase() ?
                    1 : 0;
        }));
    }
    
    getProgram(pk) {
        return this.programs.get(pk);
    }
    
    get programList() {
        return [...this.programs.values()];
    }

}