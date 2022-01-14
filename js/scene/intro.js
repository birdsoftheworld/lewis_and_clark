import { Character } from "/js/char/character.js";

let textSize = 25;
let text = [
    "Thomas Jefferson has asked *Meriwether Lewis* to lead an expedition through the new land of Louisiana. You, _William Clark_, have been asked to accompany him."
];
let offsetX = textSize;
let offsetY = textSize * 2;
let lineSpacing = 5;
let textSpeed = 1;
let colors = ["#000000", "#dd3b00", "#0062d3"];

class IntroScene {
    constructor(game) {
        this.game = game;
        this.started = false;
        this.startAnim = 500;
        this.displayedLines = [[]];
        this.lineIndex = 0;
        this.textIndex = 0;
        this.charIndex = 0;
        this.colorIndex = -1;
        this.frame = 0;
    }

    update() {
        this.frame++;
        if(this.frame % textSpeed === 0) {
            if(this.started && this.startAnim <= 0) {
                this.progressText();
            }
        }
    }

    progressText() {
        let page = text[this.textIndex];

        if(this.charIndex >= page.length) {
            return;
        }

        let thisCharacter;

        while(!thisCharacter) {
            let c = page.charAt(this.charIndex);
            switch(c) {
                case "_":
                    this.colorIndex = this.colorIndex === -1? 1 : -1;
                    break;
                case "*":
                    this.colorIndex = this.colorIndex === -1? 2 : -1;
                    break;
                default:
                    thisCharacter = c;
            }
            this.charIndex++;
        }

        let color = "#804a36";

        if(this.colorIndex !== -1) {
            color = colors[this.colorIndex];
        }

        this.displayedLines[this.lineIndex].push(new Character(thisCharacter, color));
        let currentLineLength = this.displayedLines[this.lineIndex].length;

        let lengthUntilNextWord = page.substring(this.charIndex).indexOf(" ");
        if(lengthUntilNextWord === -1) {
            lengthUntilNextWord = page.length - this.charIndex;
        }
        if(currentLineLength + lengthUntilNextWord > this.game.width / textSize - 2) {
            this.displayedLines.push([]);
            this.lineIndex++;
        }
    }

    draw(context) {
        let width = this.game.width;
        let height = this.game.height;

        context.font = "50px moderndos";
        context.textBaseline = "bottom";

        if(this.startAnim > 0 && this.started) {
            this.startAnim -= 1000/60;
        }

        if(this.started) {
            context.fillStyle = "#ffe1af";
            context.fillRect(0, 0, width, height);
            context.strokeStyle = "#96533a";
            context.lineWidth = 16;
            context.strokeRect(0, 0, width, height);

            for(let i = 0; i < this.displayedLines.length; i++) {
                let line = this.displayedLines[i];
                for(let j = 0; j < line.length; j++) {
                    let c = line[j];
                    context.fillStyle = c.color;
                    context.fillText(c.char, offsetX + j * textSize, offsetY + i * textSize + (i - 1) * lineSpacing);
                }
            }
        }

        if(this.startAnim > 0) {
            context.fillStyle = "black";

            context.globalAlpha = this.startAnim / 500;
            context.fillRect(0, 0, width, height);

            context.fillStyle = "white";
            let str = "[Click anywhere to begin.]";
            context.fillText(str, (width - str.length * textSize) / 2, (height + textSize) / 2);

            context.globalAlpha = 1;
        }
    }

    event(e) {
        if(e.type === "mouseup") {
            this.started = true;
        }
    }
}

export { IntroScene };