import { tokenize } from "/js/char/tokenize.js";

function isWhitespace(char) {
    return char === " " || char === "\n" || char === "\t";
}

class TextRenderer {
    constructor(width, height, textSettings) {
        this.width = width;
        this.height = height;
        this.textSettings = textSettings;
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
        this.drawText(context, x, y, this.lines);
    }

    drawText(context, x, y, text) {
        for(let i = 0; i < text.length; i++) {
            let line = text[i];
            let leadingWhitespace = 0;
            let trailingWhitespace = 0;

            if(this.textSettings.stripWhitespace) {
                if(this.textSettings.align === "left" || this.textSettings.align === "center") {
                    for(let j = 0; j < line.length; j++) {
                        let c = line[j];
                        if(isWhitespace(c.char)) {
                            leadingWhitespace++;
                        } else {
                            break;
                        }
                    }
                }

                if(this.textSettings.align === "right" || this.textSettings.align === "center") {
                    for(let j = line.length - 1; j >= 0; j--) {
                        let c = line[j];
                        if(isWhitespace(c.char)) {
                            trailingWhitespace++;
                        } else {
                            break;
                        }
                    }
                }
            }

            let startingPosition = x;
            if(this.textSettings.align === "left") {
                startingPosition -= leadingWhitespace * this.textSettings.textSize;
            }
            if(this.textSettings.align === "right") {
                startingPosition += (this.width - line.length + trailingWhitespace) * this.textSettings.textSize;
            }
            if(this.textSettings.align === "center") {
                startingPosition += (this.width - line.length + trailingWhitespace - leadingWhitespace) * this.textSettings.textSize / 2;
            }
            for(let j = 0; j < line.length; j++) {
                let c = line[j];
                if(isWhitespace(c.char)) {
                    continue;
                }
                context.fillStyle = c.color;
                context.fillText(c.char, startingPosition + j * this.textSettings.textSize, y + i * this.textSettings.textSize + (i - 1) * this.textSettings.lineSpacing);
            }
        }
    }
}

export { TextRenderer };