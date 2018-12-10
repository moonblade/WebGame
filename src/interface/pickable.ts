interface Pickable {
    // pick up the object and add it to inventory, returns whether pick up was successful or not
    pick(): boolean;

    // place the object at current player position
    place(): boolean;

    // sets whether an object is currently in inventory slot or not
    // an object when picked up gets inventory flag set to true
    setInventory(inventory: boolean): void; 

    // Get whether the current object is in inventory or not
    getInventory(): boolean;

    // inventory display of item
    hudDisplay(position: number, selected: boolean): void;
}

export default Pickable