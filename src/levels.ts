import Level from './level';

class Levels {
    levels: any = {};
    static instance: Levels = null;
    static getInstance() {
        if (Levels.instance == null)
            Levels.instance = new Levels();
        return Levels.instance;
    }

    constructor() {
    }
}

export default Levels;