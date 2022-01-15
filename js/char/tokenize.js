import { Character } from "./character.js";

let colors = ["#804a36", "#dd3b00", "#0062d3"];

function tokenize(text) {
    let tokens = [];
    let colorId = 0;
    let i = 0;
    while(i < text.length) {
        let c = text.charAt(i);

        switch(c) {
            case "_":
                colorId = colorId !== 0 ? 0 : 1;
                break;
            case "*":
                colorId = colorId !== 0 ? 0 : 2;
                break;
            default:
                tokens.push(new Character(c, colors[colorId]));
        }

        i++;
    }

    return tokens;
}

export { tokenize };