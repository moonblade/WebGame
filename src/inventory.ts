import Item from "./item";
import Game from "./game";
import { UIActor, Vector } from "excalibur";
import Player from "./player";
import Resources from "./resources";

class Inventory {
    items: Item[] = [];
    selectedItem: Item;

    constructor() {
    }

    add(item: Item) {
        this.selectedItem = item;
        this.items.push(item);
        this.updateDisplay();
        item.setInventory(true, this.items.length);
    }

    updateDisplay() {
        for (let i=0; i<this.items.length; ++i) {
            this.items[i].hudDisplay(i);
        }
    }

    removeSelected() {
        this.remove(this.selectedItem)
        console.log(this.items)
        this.selectedItem = this.items[0]
    }

    remove(item: Item) {
        let index = this.items.findIndex(x=>{
            return x.name == item.name;
        });
        if (index > -1) {
            this.items.splice(index, 1)
            item.setInventory(false);
        }
        this.updateDisplay();
    }

}

export default Inventory;