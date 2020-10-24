# [Tic-Tac-Toe-Engine](https://www.npmjs.com/package/@larrywho11/tic-tac-toe)

A Tic-Tac-Toe engine with bruteforce minimax.

### Install

`
npm i @larrywho11/tic-tac-toe
`

### API

```javascript
import {Board, Player} from "./src/Board";

// Create new board where player 1 goes first
const board = new Board(Player.PLAYER_1);

// Player 1 takes the middle
board.nextMove(1, 1);

// Player 2 takes top left
board.nextMove(0, 0);

// Call minimax for help for the next move of player 1
console.log(board.nextBestMove(Player.PLAYER_1);
```

### Author

Lara Pollehn <lara.pollehn@googlemail.com

### License

MIT License - https://opensource.org/licenses/MIT
