import Item from "./item";
import Game from "./game";

class Inventory {
    items: Item[] = [];
    constructor() {

    }

    add(item: Item) {
        this.items.push(item);
        Game.getInstance().remove(item);
    }
}

export default Inventory;