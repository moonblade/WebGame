import Item from "./item";
import Game from "./game";
import { UIActor } from "excalibur";
import Player from "./player";

class Inventory {
    items: Item[] = [];
    constructor() {

    }

    add(item: Item) {
        this.items.push(item);
        Game.getInstance().remove(item);
        item.hudDisplay(this.items.length)
        Player.getInstance().add(item)
    }

    draw() {
        for (let item of this.items) {
        }
    }
}

export default Inventory;