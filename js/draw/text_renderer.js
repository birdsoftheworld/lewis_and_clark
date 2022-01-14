import { Character } from "/js/char/character.js";

let colors = ["#000000", "#dd3b00", "#0062d3"];

class TextRenderer {
    constructor(width, height, textSize, lineSpacing) {
        this.width = width;
        this.height = height;
        this.textSize = textSize;
        this.lineSpacing = lineSpacing;
    }

    setText(text) {
        this.text = text;
        this.displayedLines = [[]];
        this.lineIndex = 0;
        this.charIndex = 0;
        this.colorIndex = -1;
    }

    newLine() {
        this.displayedLines.push([]);
        this.lineIndex++;
    }

    progress() {
        if(this.charIndex >= this.text.length) {
            return;
        }

        let thisCharacter;

        while(!thisCharacter) {
            let c = this.text.charAt(this.charIndex);
            switch(c) {
                case "_":
                    this.colorIndex = this.colorIndex === -1? 1 : -1;
                    break;
                case "*":
                    this.colorIndex = this.colorIndex === -1? 2 : -1;
                    break;
                case "\n":
                    this.newLine();
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

        let lengthUntilNextWord = this.text.substring(this.charIndex).indexOf(" ");
        if(lengthUntilNextWord === -1) {
            lengthUntilNextWord = this.text.length - this.charIndex;
        }
        if(currentLineLength + lengthUntilNextWord > this.width) {
            this.newLine();
        }
    }

    finished() {
        return this.charIndex >= this.text.length;
    }

    draw(context, x, y) {
        for(let i = 0; i < this.displayedLines.length; i++) {
            let line = this.displayedLines[i];
            for(let j = 0; j < line.length; j++) {
                let c = line[j];
                context.fillStyle = c.color;
                context.fillText(c.char, x + j * this.textSize, y + i * this.textSize + (i - 1) * this.lineSpacing);
            }
        }
    }
}

export { TextRenderer };