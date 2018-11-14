import { Texture, ILoader, ILoadable, Loader } from "excalibur";
import Game from "./game";

class Resources {
    walkTexture:Texture;
    static instance: Resources = null;

    constructor() {
        this.walkTexture = new Texture("./src/resources/player/sprite.png"); 
    }

    
    getTextures(): Texture[] {
        return [this.walkTexture];
    }

    getResources(): ILoadable[] {
        return this.getTextures();
    }

    static getInstance() {
        if (!Resources.instance) 
            Resources.instance = new Resources();
        return Resources.instance
    }

    getLoader(): Loader {
        let loader: Loader = new Loader();
        for (let resource of this.getResources()) {
            loader.addResource(resource);
        }
        return loader;
    }
}

export default Resources;