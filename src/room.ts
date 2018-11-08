import { Scene } from 'excalibur';

class Room extends Scene {
    name: string;
    east: Room;
    west: Room;
    north: Room;
    south: Room;
    up: Room;
    down: Room;
    constructor(name: string) {
        super();
        
        this.name = name;
    }
}

export default Room;