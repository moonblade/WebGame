import Room from './room';
import * as rooms from './resources/rooms.json';

class Rooms {
    rooms: any = {};
    static instance: Rooms = null;
    static getInstance() {
        if (Rooms.instance == null)
            Rooms.instance = new Rooms();
        return Rooms.instance;
    }

    constructor() {
        for (let key in rooms) {
            this.rooms[key] = new Room(rooms[key]);
        }
    }
}

export default Rooms;