export class InvalidFirstPlayerException extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class CellIsTakenException extends Error{
    constructor(message: string) {
        super(message);
    }
}

export class DontKnowException extends Error{
    constructor(message: string) {
        super(message);
    }
}