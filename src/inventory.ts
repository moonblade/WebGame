import Item from "./item";
import Game from "./game";
import { UIActor, Vector, Input } from "excalibur";
import Player from "./player";
import Resources from "./resources";
import Controls from "./controls";
import InputType from "./In";
import { KeyEvent } from "excalibur/dist/Input";

class Inventory {
    items: Item[] = [];
    selectedItem: number;

    constructor() {
        Game.getInstance().input.keyboard.on("press", (event: KeyEvent)=>{
            event.key = event.key - Controls.inventorySelectionStart;
            if (event.key >= 0 && event.key < this.items.length) {
                this.selectedItem = event.key;
                this.updateDisplay();
            }
        })
    }

    add(item: Item) {
        this.items.push(item);
        this.selectedItem = this.items.length - 1;
        item.setInventory(true);
        this.updateDisplay();
    }

    updateDisplay() {
        for (let i=0; i<this.items.length; ++i) {
            this.items[i].hudDisplay(i, i == this.selectedItem);
        }
    }

    removeSelected() {
        this.remove(this.items[this.selectedItem])
    }
    
    selectItem(item: Item) {
        let index = this.findIndex(item)
        if (index > -1) {
            this.selectedItem = index;
            this.updateDisplay();
        }
    }

    findIndex(item: Item): number {
        return this.items.findIndex(x=>{
            return x.name == item.name;
        });
    }

    remove(item: Item) {
        let index = this.findIndex(item)
        if (index > -1) {
            this.items.splice(index, 1)
            item.setInventory(false);
        }
        this.selectedItem = this.items.length - 1
        this.updateDisplay();
    }

}

export default Inventory;