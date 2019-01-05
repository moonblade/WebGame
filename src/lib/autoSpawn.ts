import Direction from "../direction";

class AutoSpawn {
    onGid: any;
    gid: any;
    probability: any;
    on: any;
    layer: any;
    direction: Direction;
    near: any;
    tileset: any;
    tiles: any;

    constructor(tile: any, tileset: any, tiles: any) {
        this.tiles = tiles;
        this.tileset = tileset;
        this.gid = tile.id + tileset.firstgid;
        this.probability = tile.probability || 1;
        this.on = tile.spawnOn;
        this.near = tile.near;
        this.direction = tile.direction?<Direction> Direction[tile.direction]:undefined;
        this.layer = tile.spawnLayer;
        this.onGid = tiles[this.on].id + tileset.firstgid;
    }

    nearTile(i:number, row:number, col:number) {
        switch(this.direction) {
            case Direction.Up:
                if (i>=col)
                    return i-col;
            case Direction.Down:
                if (i<row*(col-2))
                    return i+col;
            case Direction.Left:
                if (i%col!=0)
                    return i-1;
            case Direction.Right:
                if ((i-1)%col!=0)
                    return i+1;
        }
    }

    spawn(layers:any, i:number, tile:any=null) {
        for (let layer of layers) {
            if (layer.name == this.layer) {
                if (Math.random() < this.probability) {
                    if (this.near && tile && this.near == tile.type || !this.near) {
                        layer.data[i] = this.gid;
                    }
                }
            }
        }
    }
}

export default AutoSpawn;