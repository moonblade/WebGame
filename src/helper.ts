import Item from "./item";
import Player from "./player";

class Helper {
    static initObject(object: any = {}, addToGame: boolean = true) {
        if (object.class === "item") {
            Item.initialize(object, addToGame);
        } else if (object.type === "spawn") {
            if (addToGame)
                Player.getInstance().setPosition(object);
        }
    }
}

export default Helper;