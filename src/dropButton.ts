import { Actor, Sprite } from "excalibur";
import Resources from "./resources";
import Game from "./game";

class DropButton extends Actor{
    padding:number = 2;
    constructor(){
        super();
    }

    onInitialize() {
        let sprite: Sprite = Resources.getInstance().getSprite("drop");
        this.addDrawing(sprite);
        this.setWidth(sprite.width);
        this.setHeight(sprite.height);
        this.x = - Game.getInstance().halfDrawWidth + this.getWidth() + 6 * this.padding ;
        this.y = Game.getInstance().halfDrawHeight - this.getHeight();    
    }
}

export default DropButton;