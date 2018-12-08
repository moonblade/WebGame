import { Input, Engine } from "excalibur";
import InputType from "./In";
import Direction from "./direction";

class Controls {
    static upKeys: Input.Keys[] = [Input.Keys.W, Input.Keys.Up];
    static downKeys: Input.Keys[] = [Input.Keys.S, Input.Keys.Down];
    static leftKeys: Input.Keys[] = [Input.Keys.A, Input.Keys.Left];
    static rightKeys: Input.Keys[] = [Input.Keys.D, Input.Keys.Right];
    // 1
    static inventorySelectionStart: Input.Keys = 49
    static keys: Map<Direction, Input.Keys[]> = new Map([
        [Direction.Up, Controls.upKeys],
        [Direction.Down, Controls.downKeys],
        [Direction.Left, Controls.leftKeys],
        [Direction.Right, Controls.rightKeys],
    ]);

    static keyboard(engine:Engine, type: InputType, keys: Input.Keys[]) {
        let retVal :any = false;
        if (type == InputType.held) {
            for (let x of keys) {
                if (engine.input.keyboard.isHeld(x)) {
                    retVal = x;
                    break;
                }
            }
        } else if (type == InputType.press) {
            for (let x of keys) {
                if (engine.input.keyboard.wasPressed(x)) {
                    retVal = x;
                    break;
                }
            }
        } else if (type == InputType.release) {
            for (let x of keys) {
                if (engine.input.keyboard.wasReleased(x)) {
                    retVal = x;
                    break;
                }
            }
        }
        return retVal;

    }

    static input(engine: Engine, type: InputType, direction: Direction) {
        return Controls.keyboard(engine, type, Controls.keys.get(direction));
    }

    static up(engine: Engine, type: InputType): boolean {
        return Controls.keyboard(engine, type, Controls.upKeys);
    }
    
    static down(engine: Engine, type: InputType): boolean {
        return Controls.keyboard(engine, type, Controls.downKeys);
    }

    static left(engine: Engine, type: InputType): boolean {
        return Controls.keyboard(engine, type, Controls.leftKeys);
    }

    static right(engine: Engine, type: InputType): boolean {
        return Controls.keyboard(engine, type, Controls.rightKeys);
    }

}

export default Controls;