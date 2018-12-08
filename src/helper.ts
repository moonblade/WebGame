import Item from "./item";
import Player from "./player";

class Helper {
    static initObject(object: any = {}) {
        if (object.class === "item") {
            Item.initialize(object);
        } else if (object.type === "spawn") {
            Player.getInstance().setPosition(object);
        }
    }
}

export default Helper;