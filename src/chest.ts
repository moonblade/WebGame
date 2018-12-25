import Entity from "./entity";

class Chest extends Entity{
    contents: Entity[] = [];

    constructor(properties: any) {
        super(properties);
        console.log(properties);
        
    }
}

export default Chest;