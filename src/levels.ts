import Level from './level';
import * as levels from './resources/levels.json';

class Levels {
    levels: any = {};
    static instance: Levels = null;
    static getInstance() {
        if (Levels.instance == null)
            Levels.instance = new Levels();
        return Levels.instance;
    }

    constructor() {
        for (let key in levels) {
            this.levels[key] = new Level(levels[key]);
        }
    }
}

export default Levels;