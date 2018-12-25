import { Vector } from "excalibur";
import { KeyEvent } from "excalibur/dist/Input";
import Controls from "./controls";
import Game from "./game";
import Pickable from "./interface/pickable";
import Entity from "./entity";

class Inventory {
    items: Entity[] = [];
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

    // check if a vector is an item
    findItem(pos: Vector) {
        for (let i=0; i<this.items.length; ++i) {
            if (this.items[i].contains(pos.x, pos.y, false)) {
                return this.items[i]
;            }
        }
    }

    add(pickable: Entity): boolean {
        if (this.hasItem(pickable)) 
            return false;
        this.items.push(pickable);
        this.selectedItem = this.items.length - 1;
        this.updateDisplay();
        return true;
    }

    updateDisplay() {
        for (let i=0; i<this.items.length; ++i) {
            this.items[i].hudDisplay(i, i == this.selectedItem);
        }
    }

    getSelectedItem(): Entity {
        return this.items[this.selectedItem];
    }

    placeSelected() {
        let item: Pickable = this.getSelectedItem();
        if (item) {
            item.place();
        }
    }

    removeSelected() {
        this.remove(this.items[this.selectedItem])
    }
    
    selectItem(pickable: Pickable) {
        let index = this.findIndex(pickable)
        if (index > -1) {
            this.selectedItem = index;
            this.updateDisplay();
        }
    }

    hasItem(pickable: Pickable): boolean {
        return this.findIndex(pickable) > -1;
    }

    findIndex(pickable: Pickable): number {
        if (!pickable)
            return -1;
        return this.items.findIndex(x=>{
            return x.name == pickable.name;
        });
    }

    remove(pickable: Pickable): boolean {
        let index = this.findIndex(pickable)
        if (index > -1) {
            this.items.splice(index, 1)
            this.selectedItem = this.items.length - 1
            this.updateDisplay();
            return true;
        } else {
            return false;
        }
    }

}

export default Inventory;