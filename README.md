# [Tic-Tac-Toe-Engine](https://www.npmjs.com/package/@larrywho11/tic-tac-toe)

A Tic-Tac-Toe engine with bruteforce minimax. The algorithm is dead simple, look into the future and choose the best branch. 

The library is delivered with no further dependency and is therefore light-weight.

### Install

`
npm i @larrywho11/tic-tac-toe
`

### API

```javascript
import {Board, Player} from "@larrywho11/tic-tac-toe";

// Create new board where player 1 goes first
const board = new Board(Player.PLAYER_1);

// Player 1 takes the middle
board.nextMove(1, 1);

// Player 2 takes top left
board.nextMove(0, 0);

// Call minimax for help for the next move of player 1
console.log(board.nextBestMove(Player.PLAYER_1);

// Check for winner PLAYER_1, PLAYER_2, DRAWN, UNKNOWN
console.log(board.winner());
```

### Author

Lara Pollehn <lara.pollehn@googlemail.com

### License

MIT License - https://opensource.org/licenses/MIT
