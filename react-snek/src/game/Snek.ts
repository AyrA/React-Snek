import Direction from "./Direction";
import Position from "./Position";

/** Event handler for tick based events
 * @param sender Snek instance calling the handler
 */
type SnekEventHandler = (sender: Snek) => void;

/**
 * A complete snake game without any external dependencies
 */
export default class Snek {
    /** Value used to indicate food */
    static readonly #food = -1;
    /** Field width */
    readonly #width: number;
    /** Field height */
    readonly #height: number;
    /** Field */
    readonly #state: number[];
    /** Registered event handlers */
    readonly #events = [] as SnekEventHandler[];

    /** Current position of the snake head */
    #head: Position;
    /** Direction the snake is travelling */
    #dir = Direction.Right;
    /** Direction the snake was travelling in the previous tick */
    #lastdir = Direction.Right;
    /** Whether the game has ended or is still running */
    #end = true;
    /** Game tick rate. If zero, auto ticking stos */
    #tickrate = 200;
    /** Snake length */
    #size = 10;
    /** Id of last tick handler */
    #tickHandler = 0;
    /** Allow wraparound */
    #wrap = false;

    /** Gets whether a game is running or not.
     * 
     * A game can be started using "reset()" if it's not running
     */
    get running() { return !this.#end }
    /** Gets the width of the field */
    get width() { return this.#width }
    /** Gets the height of the field */
    get height() { return this.#height }
    /** Gets the field. Values: 0 = empty, >0 = snake (increasing value from tail to head), <0 = food */
    get state() { return this.#state.concat([]) }
    /** Gets the rate in milliseconds at which the snake moves */
    get tickrate() { return this.#tickrate }
    /** Sets the rate in milliseconds at which the snake moves
     * @param value Range: 10-1000. 0=disable
     */
    set tickrate(value: number) {
        if (value === 0) {
            this.#tickrate = 0;
        }
        else {
            const newValue = Math.min(1000, Math.max(10, value | 0));
            this.#tickrate = newValue;
        }
    }

    /**
     * Creates a new Snek instance
     * @param width  field width (minimum: 9)
     * @param height field height (minimum: 9)
     * @param wrap Support wraparound
     */
    constructor(width: number, height: number, wrap: boolean) {
        this.#width = Math.max(9, width | 0);
        this.#height = Math.max(9, height | 0);
        this.#state = Array(this.#width * this.#height).fill(0);
        this.#head = new Position(this.#width / 2 | 0, this.#height / 2 | 0, this.#width, this.#height, wrap);
        this.#wrap = wrap;
    }

    /** Resets the game to the initial state and clears game over condition
     * 
     * When calling this, the ticks will immediately start again
     */
    reset() {
        this.#size = 10;
        this.#lastdir = this.#dir = Direction.Right;
        this.#head.x = this.#width / 2 | 0;
        this.#head.y = this.#height / 2 | 0;
        this.#state.fill(0);
        this.#state[this.#head.offset] = this.#size;
        this.#end = false;
        this.tick();
    }

    /** Advances the game by a tick
     * 
     * Normally this is called automatically by the game, unless the tick rate has been set to zero
     */
    tick() {
        clearTimeout(this.#tickHandler);
        if (!this.#end) {
            try {
                const next = this.#nextpos();
                //Collision with itself. Colliding with the tail is allowed
                //because this field becomes available at this tick
                if (this.#state[next.offset] > 1) {
                    throw new Error("Game over");
                }
                this.#head = next;
                //If food eaten, increase size, otherwise shrink snake fields by 1
                if (this.#state[next.offset] === Snek.#food) {
                    ++this.#size;
                }
                else {
                    for (let i = 0; i < this.#state.length; i++) {
                        if (this.#state[i] > 0) {
                            --this.#state[i];
                        }
                    }
                }
                this.#state[next.offset] = this.#size;
                this.#lastdir = this.#dir;
                this.#setFood();
                if (this.#tickrate > 0) {
                    this.#tickHandler = setTimeout(this.tick.bind(this), this.#tickrate);
                }
            }
            catch (e) {
                console.log(e);
                this.#end = true;
            }
            this.#events.forEach((handler) => {
                try {
                    handler(this);
                }
                catch {
                    console.error("Event handler crashed:", handler);
                }
            });
        }
    }

    /** Change direction to "up" in next tick */
    up() {
        if (!this.#end && this.#lastdir !== Direction.Down) {
            this.#dir = Direction.Up;
            return true;
        }
        return false;
    }

    /** Change direction to "down" in next tick */
    down() {
        if (!this.#end && this.#lastdir !== Direction.Up) {
            this.#dir = Direction.Down;
            return true;
        }
        return false;
    }

    /** Change direction to "left" in next tick */
    left() {
        if (!this.#end && this.#lastdir !== Direction.Right) {
            this.#dir = Direction.Left;
            return true;
        }
        return false;
    }

    /** Change direction to "right" in the next tick */
    right() {
        if (!this.#end && this.#lastdir !== Direction.Left) {
            this.#dir = Direction.Right;
            return true;
        }
        return false;
    }

    /**
     * Gets the type of field for a given offset
     * @param offset field offset
     * @returns Fieldtype <0 = food; 0 = empty; >0 = snake
     */
    fieldtype(offset: number) {
        const num = this.#state[offset | 0];
        if (num === void 0) {
            throw new Error("Out of bounds");
        }
        return num > 0 ? 1 : num;
    }

    /**
     * Converts coordinates into offset
     * 
     * Will throw an error if the values are out of bounds
     * @param x horizontal position
     * @param y vertical position
     * @returns offset
     */
    offset(x: number, y: number) {
        return new Position(x, y, this.#width, this.#height, this.#wrap).offset;
    }

    /** Registers a handler that is called after each tick has been processed
     * @param handler Handler
     */
    onTick(handler: SnekEventHandler) {
        this.#events.push(handler);
    }

    /**
     * Removes a previously registered event handler
     * @param handler Event handler
     * @returns true if handler removed, false if not found
     */
    offTick(handler: SnekEventHandler) {
        const i = this.#events.indexOf(handler);
        if (i >= 0) {
            this.#events.splice(i, 1);
            return true;
        }
        return false;
    }

    /** Puts a food item in a random field position
    * @returns true if item placed, false otherwise
    */
    #setFood() {
        //Abort if food still exists
        const food = this.#state.findIndex(v => v < 0) >= 0;
        if (food) {
            return false;
        }
        //Get all free fields and abort if none exist
        const free = this.#state.map((v, i) => v === 0 ? i : -1).filter(v => v >= 0);
        if (free.length === 0) {
            console.log("No free food slots");
            return false;
        }
        //Set random free field to food
        const index = free[Math.random() * free.length | 0];
        this.#state[index] = Snek.#food;
        return true;
    }

    /** Calculates the next position based on the current position and direction
    * @returns Next position
    */
    #nextpos() {
        const head = this.#head;
        switch (this.#dir) {
            case Direction.Up:
                return new Position(head.x, head.y - 1, head.width, head.height, this.#wrap);
            case Direction.Down:
                return new Position(head.x, head.y + 1, head.width, head.height, this.#wrap);
            case Direction.Left:
                return new Position(head.x - 1, head.y, head.width, head.height, this.#wrap);
            case Direction.Right:
                return new Position(head.x + 1, head.y, head.width, head.height, this.#wrap);
        }
        throw new Error("Unknown direction: " + this.#dir);
    }
}