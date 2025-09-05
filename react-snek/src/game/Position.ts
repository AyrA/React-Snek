/** A utility class to handle position within a limited 2D space
 * 
 * Values are restricted to integers
 */
export default class Position {
    #x: number;
    #y: number;
    #w: number;
    #h: number;

    /** Gets the current X coordinate */
    get x() { return this.#x }
    /** Gets the current Y coordinate */
    get y() { return this.#y }

    /** Sets the current X coordinate */
    set x(value: number) {
        if (Position.#clamp(0, value | 0, this.#w - 1) !== value) {
            throw new Error("Invalid value");
        }
        this.#x = value;
    }

    /** Sets the current Y coordinate */
    set y(value: number) {
        if (Position.#clamp(0, value | 0, this.#h - 1) !== value) {
            throw new Error("Invalid value");
        }
        this.#y = value;
    }

    /** Gets the area width */
    get width() { return this.#w }
    /** Gets the area height */
    get height() { return this.#h }

    /** Gets the linear offset into the grid based on the current position */
    get offset() {
        return this.#x + this.#y * this.#w;
    }

    /**
     * Create a position instance
     * 
     * All parameters will be clamped to be valid values
     * @param x X position
     * @param y Y position
     * @param width grid width
     * @param height grid height
     */
    constructor(x: number, y: number, width: number, height: number) {
        this.#w = Math.max(1, width | 0);
        this.#h = Math.max(1, height | 0);
        this.#x = Position.#clamp(0, x | 0, this.#w - 1);
        this.#y = Position.#clamp(0, y | 0, this.#h - 1);
    }

    /**
     * Clamps a value
     * @param min Minimum inclusive value
     * @param val Value
     * @param max Maximum inclusive value
     * @returns Clamped value
     */
    static #clamp(min: number, val: number, max: number) {
        return Math.min(max, Math.max(min, val));
    }
}