# Snek

A snake game using react.

The game logic itself is confined to the `src/game` directory in case you're not interested in the react part of this.

To use the game, create a `Snek` instance, then call `reset()` to start the game.

Use `up()/down()/left()/right()` to control the game. Register an `onTick()` handler to draw the game field.