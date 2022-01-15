import { Character } from "./character.js";
import { Icon } from "./icon.js";

let colors = ["#804a36", "#dd3b00", "#0062d3"];
let icons = new Map();

let iconsImg = new Image();
iconsImg.src = "/assets/icons.png";

icons.set("person", new Icon(iconsImg, 0, 0, 8, 8, 1));
icons.set("health", new Icon(iconsImg, 8, 0, 8, 8, 1));
icons.set("food", new Icon(iconsImg, 16, 0, 8, 8, 1));
icons.set("time", new Icon(iconsImg, 24, 0, 8, 8, 1));

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
            case "{":
                let iconName = "";
                while(i < text.length && c !== "}") {
                    c = text.charAt(i);
                    iconName += c;
                    if(c === "}") {
                        break;
                    }
                    i++;
                }
                iconName = iconName.substring(1, iconName.length - 1);
                tokens.push(icons.get(iconName));
                break;
            default:
                tokens.push(new Character(c, colors[colorId]));
        }

        i++;
    }

    return tokens;
}

export { tokenize };