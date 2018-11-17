import { Scene } from 'excalibur';
class Room extends Scene {
    name: string;
    east: Room;
    west: Room;
    north: Room;
    south: Room;
    up: Room;
    down: Room;
    constructor(room: any) {
        super();
        this.name = room.name;
        
        console.log(room.name)
    }

}

export default Room;