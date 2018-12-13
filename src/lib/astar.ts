import { Vector, Cell } from "excalibur";

//return array of path from start to end
// returns null if path is not found
//start:{x:1,y:1}
class AStar {
    idxArray: Cell[];
    m: number;
    n: number;
    count: any;
    parent: any;

    constructor(idxArray: Cell[], m:number, n:number) {
        this.idxArray = idxArray;
        this.count = {};
        this.parent = {};
        this.m = m;
        this.n = n;
    }

    findPath(start: Cell,end: Cell): Vector[] {
        let startIdx: number = start.index;
        let endIdx: number = end.index;
        this.count = {};
        
        // Initialise queue
        let queue = [endIdx];
        this.count[endIdx] = 0;

        // main loop
        for (let i=0; i<queue.length; ++i) {
            // console.log(queue.length)
            if (queue[i] == startIdx)
                return this.computePath(startIdx, endIdx);
            queue = queue.concat(this.gen(queue[i]));
        }
        return [];
    }

    gen(idx: number): number[] {
        let current: Cell = this.idxArray[idx];
        let count: number = this.count[idx] + 1;
        let maxIdx: number = this.m * this.n - 1;

        let temp: number[] = [idx + this.n, idx - this.n];
        if (idx - 1 >=0 && (idx - 1) % this.n!=0) {
            temp.push(idx-1);
        }
        if (idx + 1 <= maxIdx && (idx + 1 ) % this.n !=1) {
            temp.push(idx+1);
        }

        temp.forEach((value, index, array) => {
            if (value<0 || value > maxIdx) {
                // out of bounds
                delete array[index];
            } else if(!this.idxArray[value] || this.idxArray[value].solid != false) {
                // inaccessible
                delete array[index];
            } else if(this.count[value] && this.count[value] <= count) {
                delete array[index];
            } else {
                this.parent[value] = idx;
                this.count[value] = count;
            }
        });
        return temp.filter((x)=>x);
    }

    decrease(path:number[]): number[] {
        let reducedPath=[path[0]]
        for (var i=2; i<path.length; ++i) {
        if (path[i]-path[i-1] != path[i-1] - path[i-2])
            reducedPath.push(path[i-1])
        }
        reducedPath.push(path[path.length - 1])
        return reducedPath;
    }

    toVector(path: number[]): Vector[] {
        return path.map(x=>this.idxArray[x].getCenter());
    }

    computePath(startIdx: number, endIdx: number): Vector[] {
        let path = [startIdx];
        while (path[path.length - 1] != endIdx) {
            if (this.parent[path[path.length - 1]])
                path.push(this.parent[path[path.length - 1]]);
            else 
                return [];
        }
        return this.toVector(this.decrease(path));
    }
}

export default AStar;