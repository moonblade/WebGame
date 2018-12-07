import Item from "./item";
import Game from "./game";
import { UIActor, Vector } from "excalibur";
import Player from "./player";

class Inventory {
    items: Item[] = [];
    selectedItem: Item;

    constructor() {
    }

    add(item: Item) {
        this.selectedItem = item;
        this.items.push(item);
        Game.getInstance().remove(item);
        item.hudDisplay(this.items.length)
        Player.getInstance().add(item)
    }

    removeSelected() {
        this.remove(this.selectedItem)
    }

    remove(item: Item) {
        let index = this.items.findIndex(x=>{
            return x.name == item.name;
        });

        if (index > -1) {
            this.items.splice(index, 1)
            Player.getInstance().remove(item);
            item.pos = Player.getInstance().pos.add(new Vector(0, item.getHeight()));
            Game.getInstance().add(item);
            item.restoreCollision();
        }
    }

}

export default Inventory;