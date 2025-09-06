/** A utility class to handle position within a limited 2D space
 * 
 * Values are restricted to integers
 */
export default class Position {
    #x: number;
    #y: number;
    #w: number;
    #h: number;
    #wrap: boolean;

    /** Gets the current X coordinate */
    get x() { return this.#x }
    /** Gets the current Y coordinate */
    get y() { return this.#y }

    /** Sets the current X coordinate */
    set x(value: number) {
        value |= 0;
        if (this.#wrap) {
            value = Math.abs(value % this.#w);
        }
        if (value < 0 || value >= this.#w) {
            throw new Error("Invalid X value");
        }
        this.#x = value;
    }

    /** Sets the current Y coordinate */
    set y(value: number) {
        value |= 0;
        if (this.#wrap) {
            value = Math.abs(value % this.#h);
        }
        if (value < 0 || value >= this.#h) {
            throw new Error("Invalid Y value");
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
     * @param wrap allow X and Y to wrap around
     */
    constructor(x: number, y: number, width: number, height: number, wrap: boolean) {
        //Clamp to integers
        width |= 0;
        height |= 0;
        x |= 0;
        y |= 0;
        this.#wrap = wrap;
        if (width < 1 || height < 1) {
            throw new Error("Width and height must be at least 1");
        }
        if (wrap) {
            if (x < 0) {
                x = width + (x % width);
            }
            else {
                x = x % width;
            }
            if (y < 0) {
                y = height + (y % height);
            }
            else {
                y = y % height;
            }
        }
        if (x < 0 || x >= width) {
            throw new Error("X coordinate out of bounds, and wraparound was not allowed");
        }
        if (y < 0 || y >= height) {
            throw new Error("Y coordinate out of bounds, and wraparound was not allowed");
        }
        this.#w = width;
        this.#h = height;
        this.#x = x;
        this.#y = y;
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