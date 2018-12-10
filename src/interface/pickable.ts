interface Pickable {
    // pick up the object and add it to inventory, returns whether pick up was successful or not
    pick(): boolean;

    // place the object at current player position
    place(): boolean;
}

export default Pickable