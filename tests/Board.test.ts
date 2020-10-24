import {describe, expect, test} from "@jest/globals"
import Board, {Player} from "../src/Board";
import {CellIsTakenException, InvalidFirstPlayerException} from "../src/EngineException";

describe("Tic-Tac-Toe board test suite", () => {
    test("Board initialization", () => {
        expect(() => {
            new Board(null)
        }).toThrow(InvalidFirstPlayerException);

        expect(() => {
            new Board(Player.FREE)
        }).toThrow(InvalidFirstPlayerException);

        expect(new Board(Player.PLAYER_0).states).toEqual(new Board(Player.PLAYER_1).states);

        const board = new Board(Player.PLAYER_1);

        for (const row of board.states) {
            for (const cell of row) {
                expect(cell).toEqual(Player.FREE);
            }
        }
    });

    test("Move validation", () => {
        const board = new Board(Player.PLAYER_1);
        expect(board.currentPlayer).toEqual(Player.PLAYER_1);

        board.nextMove(0, 0);
        expect(board.currentPlayer).toEqual(Player.PLAYER_0);
        expect(board.states[0][0]).toEqual(Player.PLAYER_1);

        expect(() => {
            board.nextMove(0, 0)
        }).toThrow(CellIsTakenException);

        board.nextMove(0, 1);
        expect(board.currentPlayer).toEqual(Player.PLAYER_1);
        expect(board.states[1][0]).toEqual(Player.PLAYER_0);
    });

    test("Test deep clone", () => {
        const board = new Board(Player.PLAYER_1);
        const cloned = board.clone();
        expect(board).toEqual(cloned);

        board.currentPlayer = Player.PLAYER_1;
        cloned.currentPlayer = Player.PLAYER_0;

        expect(board.currentPlayer).toEqual(Player.PLAYER_1);
        expect(cloned.currentPlayer).toEqual(Player.PLAYER_0);

        board.nextMove(0, 0);
        cloned.nextMove(0, 0);

        expect(board.states[0][0]).toEqual(Player.PLAYER_1);
        expect(cloned.states[0][0]).toEqual(Player.PLAYER_0);

        expect(board.currentPlayer).toEqual(Player.PLAYER_0);
        expect(cloned.currentPlayer).toEqual(Player.PLAYER_1);
    });

    test("Test dr strange", () => {
        const board = new Board(Player.PLAYER_1);
        const futures = board.drStrange();
        expect(futures.length).toEqual(9);

        for (let i = 0; i < futures.length; i++) {
            let found = false;
            for (let y = 0; y < futures[i].states.length; y++) {
                for (let x = 0; x < futures[i].states[y].length; x++) {
                    if (futures[i].states[y][x] === Player.PLAYER_1) {
                        found = true;
                    }
                }
            }
            expect(found).toBe(true);
            expect(futures[i].currentPlayer).toBe(Player.PLAYER_0);
        }
    });

    test("Test tree and next winner", () => {
    });
});