import { Icon } from "../char/icon.js";
import { tokenize } from "/js/char/tokenize.js";

function isIcon(c) {
    return c instanceof Icon;
}

function isWhitespace(token) {
    return !isIcon(token) && (token.char === " " || token.char === "\n" || token.char === "\t");
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

            let lengthUntilNextWord = unusedTokens.findIndex(c => isWhitespace(c));
            if(lengthUntilNextWord === -1) {
                lengthUntilNextWord = unusedTokens.length;
            }

            if(currentLineLength + lengthUntilNextWord > this.width || (!isIcon(token) && token.char === "\n")) {
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
                        if(isWhitespace(c)) {
                            leadingWhitespace++;
                        } else {
                            break;
                        }
                    }
                }

                if(this.textSettings.align === "right" || this.textSettings.align === "center") {
                    for(let j = line.length - 1; j >= 0; j--) {
                        let c = line[j];
                        if(isWhitespace(c)) {
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
                if(isWhitespace(c)) {
                    continue;
                }
                let cx = startingPosition + j * this.textSettings.textSize;
                let cy = y + i * this.textSettings.textSize + (i - 1) * this.textSettings.lineSpacing;
                if(!isIcon(c)) {
                    context.fillStyle = c.color;
                    context.fillText(c.char, cx, cy);
                } else {
                    c.draw(context, cx, cy - this.textSettings.textSize - 6, this.textSettings.textSize); // 6 is a magic number
                }
            }
        }
    }
}

export { TextRenderer };