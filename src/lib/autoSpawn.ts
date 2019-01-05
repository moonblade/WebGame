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
    direction2: Direction;
    tile: any;

    constructor(tile: any, tileset: any, tiles: any) {
        this.tiles = tiles;
        this.tile = tile;
        this.tileset = tileset;
        this.gid = tile.id + tile.firstgid;
        this.probability = tile.probability || 1;
        this.on = tile.spawnOn;
        this.near = tile.near;
        this.direction = tile.direction?<Direction> Direction[tile.direction]:undefined;
        this.direction2 = tile.direction?<Direction> Direction[tile.direction2]:undefined;
        this.layer = tile.spawnLayer;
        this.onGid = tiles[this.on].id + tiles[this.on].firstgid;
    }

    nearCardinalTile(i:number, row:number, col:number, dir2:boolean=false) {
        switch(dir2?this.direction2:this.direction) {
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

    nearTile(i:number, row:number, col:number, dir2:boolean=false) {
        if(this.direction2 && !dir2) {
            i = this.nearCardinalTile(i, row, col, true);
        }
        return this.nearCardinalTile(i, row, col);
    }

    shouldSpawn(tile:any) {
        return (this.near && tile && this.near == tile.type) || !this.near;
    }

    noObject(layers: any[], object: any) {
        for (let layer of layers) {
            let objects = layer.objects;
            if (objects && objects.length) {
                for (let o of objects) {
                    if (o.x == object.x && o.y==object.y)
                    return false;
                }
            }
        }
        return true;
    }

    spawn(layers:any, i:number, tile:any=null) {
        for (let layer of layers) {
            if (layer.name == this.layer) {
                if (Math.random() < this.probability) {
                    if (this.shouldSpawn(tile)) {
                        if (layer.type == "tilelayer")
                            layer.data[i] = this.gid;
                        else if (layer.type == "objectgroup") {
                            let x = i % layers[0].width * this.tile.width;
                            let y = (Math.floor(i / layers[0].height)+1) * this.tile.height;
                            this.tile.x = x;
                            this.tile.y = y;
                            this.tile.gid = this.tile.firstgid + this.tile.id;
                            if (this.noObject(layers, this.tile)) {
                                layer.objects.push(Object.assign({},this.tile));
                            }
                        }

                    }
                }
            }
        }
    }
}

export default AutoSpawn;