import { tokenize } from "/js/char/tokenize.js";

class TextRenderer {
    constructor(width, height, textSize, lineSpacing) {
        this.width = width;
        this.height = height;
        this.textSize = textSize;
        this.lineSpacing = lineSpacing;
    }
    
    setText(text) {
        this.text = text;
        this.tokens = tokenize(text);
        this.lines = [[]];
        this.splitLines();
    }

    splitLines() {
        let lineIndex = 0;
        
        let unusedTokens = [...this.tokens];
        for(let i = 0; i < this.tokens.length; i++) {
            let token = unusedTokens.shift();

            this.lines[lineIndex].push(token);
            let currentLineLength = this.lines[lineIndex].length;

            let lengthUntilNextWord = unusedTokens.findIndex(c => c.char === " " || c.char === "\n");
            if(lengthUntilNextWord === -1) {
                lengthUntilNextWord = unusedTokens.length;
            }

            if(currentLineLength + lengthUntilNextWord > this.width || token.char === "\n") {
                lineIndex++;
                this.lines.push([]);
            }
        }
    }

    draw(context, x, y) {
        for(let i = 0; i < this.lines.length; i++) {
            let line = this.lines[i];
            for(let j = 0; j < line.length; j++) {
                let c = line[j];
                context.fillStyle = c.color;
                context.fillText(c.char, x + j * this.textSize, y + i * this.textSize + (i - 1) * this.lineSpacing);
            }
        }
    }
}

export { TextRenderer };