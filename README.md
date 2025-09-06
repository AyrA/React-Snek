# Snek

A snake game. This game doesn't depends on any external dependencies not present in standard JS engines.
The game logic itself is located in the `src/game` directory.

For demonstratio purposes, a react rendering engine has been built around the game so you can play it.

## Demo

https://cable.ayra.ch/react/snek/

## Building

- Downlaod the repository
- From within the repository directory, run `npm ci && npm run build`
- Find your fully built project in the `dist` folder

## Debugging

The project is set up to debug natively in Visual Studio, but other debuggers should work too.

## Game Usage

To use the game in your own project, follow these steps:

1. Copy the `src/game` folder contents to your project
2. Create a `Snek` instance
3. Register an event handler with `onTick()`
4. Call `reset()` to start the game
5. When your event handler is called, draw the field from the instance `state` property
6. Hook up the `up()/down()/left()/right()` functions to your input method of choice.

The game state is available (readonly) at any point by using the `state` property.
It will appear as an array of width&times;height number of cells.
A cell with a negative value is food, zero is empty, and positive value is the snake body.
The largest positive value is the head, then from there on it decrements by 1 for each body segment.
The tail is 1.

Functions are generally safe to call. For example,
calling `right()` when the snake is currently going to the left will correctly not change the direction.
It is also safe to call these functions at any desired interval, independent of the game tick.

The tick rate can be adjusted at any point in time and will take effect on the next tick.
The minimum value is 10 milliseconds. The special value 0 can be used to disable automatic ticks.
If you do this, you must call `tick()` yourself at the desired interval.
Calling `tick()` in a game over state has no effect. In that case, use `reset()` to restart the game.
