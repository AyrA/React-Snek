import { useEffect, useRef, useState } from 'react'
import './App.css'
import Snek from './game/Snek'
import type { JSX } from 'react/jsx-runtime';

function App() {
    const snek = useRef(new Snek(50, 20));
    const setMatrix = useState(snek.current.state)[1];

    function handleKeyDown(e: KeyboardEvent) {
        const key = e.key.toUpperCase();
        switch (key) {
            case "W":
            case "ARROWUP":
                e.preventDefault();
                snek.current.up();
                break;
            case "S":
            case "ARROWDOWN":
                e.preventDefault();
                snek.current.down();
                break;
            case "A":
            case "ARROWLEFT":
                e.preventDefault();
                snek.current.left();
                break;
            case "D":
            case "ARROWRIGHT":
                e.preventDefault();
                snek.current.right();
                break;
            case "R":
                e.preventDefault();
                snek.current.reset();
                break;
            case " ":
                e.preventDefault();
                snek.current.tickrate = 50;
                break;
        }
    }
    function handleKeyUp(e: KeyboardEvent) {
        switch (e.key) {
            case " ":
                e.preventDefault();
                snek.current.tickrate = 200;
                break;
        }
    }

    useEffect(() => {
        snek.current.onTick((snek) => setMatrix(snek.state));
        snek.current.reset();
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
    }, [snek]);

    function field(snek: Snek) {
        const items = [] as JSX.Element[];
        for (let h = 0; h < snek.height; h++) {
            for (let w = 0; w < snek.width; w++) {
                const offset = snek.offset(w, h);
                const type = snek.fieldtype(offset);
                if (type < 0) {
                    items.push(<input key={offset} readOnly type="radio" checked />);
                }
                else {
                    items.push(<input key={offset} readOnly type="checkbox" checked={type > 0} />);
                }
            }
            items.push(<br />);
        }
        items.pop();
        return items;
    }

    return (
        <div>
            <h1>Snek</h1>
            <p>
                Use <kbd>WASD</kbd> or <kbd>&larr;&uarr;&rarr;&darr;</kbd> to move.<br />
                Press <kbd>R</kbd> to reset.<br />
                Hold <kbd>SPACE</kbd> to temporarily speed up.
            </p>
            <div>{field(snek.current)}</div>
            <p>Form controls are a completely adequate rendering engine</p>
        </div>
    )
}

export default App
