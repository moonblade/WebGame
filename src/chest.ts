import Item from "./item";

class Chest extends Item {
    contents: Item[] = [];

    constructor(properties: any) {
        super(properties);
        
    }
}

export default Chest;