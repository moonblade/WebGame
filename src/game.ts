import { Engine, ILoadable, Scene, Label, TextAlign } from 'excalibur';
import Levels from './levels';
import { TiledResource } from './lib/tiled';
import Player from './player';
import Resources from './resources';

class Game extends Engine{
    player: Player;
    tileResource: TiledResource;
    rooms: Levels;
    level: Scene;
    winScreen: Scene;
    static instance: Game = null;
    
    static getInstance() {
        if (Game.instance == null)
            Game.instance = new Game();
        return Game.instance;
    }

    win() {
        // alert("Congrats! You have won the game")
        this.goToScene("win");
    }

    constructor() {
        super();
        this.initializeRooms();
    }
    
    setupWinScreen() {
        this.winScreen = new Scene();
        this.add("win", this.winScreen);
        var label = new Label("Congrats! You have won the game!", this.halfDrawWidth, this.halfDrawHeight, '50px Arial');
        this.winScreen.add(label);
    }

    onStart() {
        Resources.getInstance().onInitialize(this);
        this.tileResource = Resources.getInstance().getTiledResource("map");
        this.level = new Scene();
        this.add("level", this.level);
        this.goToScene("level");
        this.setupWinScreen();
        this.level.add(this.tileResource.getTileMap());
        this.player = Player.getInstance();
        this.level.add(this.player);
        this.currentScene.camera.strategy.lockToActor(this.player);
        this.currentScene.camera.zoom(2);
        // this.isDebug = true;
    }
    
    loadAll(resources: ILoadable[]) {
        for (let resource of resources) {
            this.load(resource);
        }
    }
    
    startWithLoader(){
        this.start(Resources.getInstance().getLoader()).then(()=>this.onStart());
    }
    
    initializeRooms() {
        this.rooms = new Levels();
    }

}

export default Game;