import {CellIsTakenException, InvalidFirstPlayerException} from "./EngineException";

export enum Player {
    PLAYER_0 = 0,
    PLAYER_1 = 1,
    FREE = 2,
    DRAWN = 3,
    UNKNOWN = 4
}

export class NNode {
    public children: Array<NNode | null> = null;
    public parent: NNode | null;
    public readonly board: Board;


    constructor(parent: NNode | null, board: Board) {
        this.parent = parent;
        this.board = board;
    }
}

export default class Board {
    public states = new Array<Array<Player>>(3);
    public currentPlayer: Player;


    constructor(currentPlayer: Player) {
        if (currentPlayer !== Player.PLAYER_0 && currentPlayer !== Player.PLAYER_1) {
            throw new InvalidFirstPlayerException(`Expected first player to be ${Player.PLAYER_1} or ${Player.PLAYER_0}, got ${currentPlayer}`)
        }
        this.currentPlayer = currentPlayer;

        for (let y = 0; y < this.states.length; y++) {
            const row = new Array<Player>(3);
            for (let x = 0; x < 3; x++) {
                row[x] = Player.FREE;
            }
            this.states[y] = row;
        }
    }

    nextMove(x: number, y: number) {
        if (this.states[y][x] !== Player.FREE) {
            throw new CellIsTakenException(`The cell at (y=${y}, x=${x}) is already take by player ${this.currentPlayer}`);
        }

        this.states[y][x] = this.currentPlayer;

        this.currentPlayer = this.currentPlayer ^ 1; // 1 ^ 1 = 0, 0 ^ 1 = 1
    }

    nextBestMove(player: Player): Record<string, number> {
        if(this.states[1][1] === Player.FREE){
            return {
                "x": 1,
                "y": 1
            }
        }
        const cloned = this.clone();
        cloned.currentPlayer = player;
        const root = cloned.tree();
        const queue = [root];
        const leaves = [];

        while (queue.length > 0) {
            const current = queue[0];
            queue.shift();
            const winner = current.board.winner();
            if (winner === Player.PLAYER_0 || winner === Player.PLAYER_1) {
                leaves.push(current);
            }else {
                if (current.children !== null && current.children.length > 0) {
                    for (const child of current.children) {
                        if (child !== null) {
                            queue.push(child);
                        }
                    }
                }
            }
        }

        let draw: NNode = null;
        let lost: NNode = null;
        let won: NNode = null;
        while (leaves.length > 0) {
            const current = leaves[0];
            leaves.shift();
            const winner: Player = current.board.winner();
            if (winner === player) {
                won = current;
                break;
            } else if (winner === Player.DRAWN) {
                draw = current;
            } else {
                lost = current;
            }
        }

        let theChosen: NNode = null;
        if (won !== null) {
            theChosen = won;
        } else if (draw !== null) {
            theChosen = draw;
        } else {
            theChosen = lost;
        }

        while (theChosen.parent !== null && theChosen.parent.parent !== null) {
            theChosen = theChosen.parent;
        }

        return this.diff(theChosen.board);
    }

    diff(board: Board): Record<string, number> {
        for (let y = 0; y < this.states.length; y++) {
            for (let x = 0; x < 3; x++) {
                if (this.states[y][x] !== board.states[y][x]) {
                    return {
                        "x": x,
                        "y": y
                    }
                }
            }
        }
        return {
            "x": -1,
            "y": -1
        }
    }


    tree(): NNode {
        const root = new NNode(null, this);

        // Look one step into the future
        const futures: Array<Board> = this.drStrange();
        const children: Array<NNode> = new Array<NNode>(futures.length);

        for (let i = 0; i < children.length; i++) {
            children[i] = new NNode(root, futures[i]);
        }
        root.children = children;

        // The futures should look recursively into their futures themselves
        this._nextMove_(children);

        return root;
    }

    winner(): Player {
        // Horizontal checking
        for (let y = 0; y < this.states.length; y++) {
            if (this.states[y][0] === this.states[y][1] &&
                this.states[y][1] === this.states[y][2]) {
                return this.states[y][0];
            }
        }

        // Vertical checking
        for (let x = 0; x < this.states[0].length; x++) {
            if (this.states[0][x] === this.states[1][x] &&
                this.states[1][x] === this.states[2][x]) {
                return this.states[0][x];
            }
        }

        // Left to right diagonal checking
        if (this.states[0][0] === this.states[1][1] &&
            this.states[1][1] === this.states[2][2]) {
            return this.states[0][0];
        }

        // Right to left diagonal checking
        if (this.states[0][2] === this.states[1][1] &&
            this.states[1][1] === this.states[2][0]) {
            return this.states[1][1];
        }

        return this.countFree() === 0 ? Player.DRAWN : Player.UNKNOWN;
    }

    private _nextMove_(nnodes: Array<NNode>) {
        // Recursion exit condition
        if (nnodes.length > 0) {
            for (const nnode of nnodes) {

                // Still more futures to look into, game still not over
                if (nnode.board.countFree() > 0) {
                    const futures: Array<Board> = nnode.board.drStrange();
                    const children = new Array<NNode>(futures.length);
                    for (let i = 0; i < children.length; i++) {
                        children[i] = new NNode(nnode, futures[i]);
                    }
                    nnode.children = children;

                    // Look into the future
                    this._nextMove_(nnode.children);
                }
            }
        }
    }

    countFree(): number {
        let freeCells = 0;
        for (const row of this.states) {
            for (const cell of row) {
                if (cell === Player.FREE) {
                    ++freeCells;
                }
            }
        }
        return freeCells;
    }

    drStrange(): Array<Board> {
        const ret = new Array<Board>(this.countFree());
        let inserted = 0;
        for (let y = 0; y < this.states.length; y++) {
            for (let x = 0; x < this.states[y].length; x++) {
                if (this.states[y][x] === Player.FREE) {
                    const cloned = this.clone();

                    cloned.states[y][x] = this.currentPlayer;
                    cloned.currentPlayer = this.currentPlayer ^ 1;

                    ret[inserted++] = cloned;
                }
            }
        }

        return ret;
    }

    clone(): Board {
        const board = new Board(this.currentPlayer);
        for (let y = 0; y < board.states.length; y++) {
            for (let x = 0; x < board.states[y].length; x++) {
                board.states[y][x] = this.states[y][x];
            }
        }
        return board;
    }
}