import { Scene } from 'excalibur';
class Level extends Scene {
    up: Level;
    down: Level;
    name: string;
    constructor(room: any) {
        super();
        this.name = room.name;
    }

}

export default Level;