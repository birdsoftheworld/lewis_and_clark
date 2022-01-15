import { TextRenderer } from "/js/draw/text_renderer.js";

class GradualTextRenderer extends TextRenderer {
    setText(text) {
        super.setText(text);
        this.lineIndex = 0;
        this.charIndex = 0;
        this.finished = false;
        if(text.length === 0) {
            this.finished = true;
        }
        this.displayedLines = [[]];
    }

    progress() {
        if(this.finished) {
            return;
        }

        this.displayedLines[this.lineIndex].push(this.lines[this.lineIndex][this.charIndex]);
        this.charIndex++;
        if(this.charIndex >= this.lines[this.lineIndex].length) {
            this.charIndex = 0;
            this.lineIndex++;
            this.displayedLines.push([]);
        }

        if(this.lineIndex >= this.lines.length) {
            this.finished = true;
        }
    }

    isFinished() {
        return this.finished;
    }

    flush() {
        this.displayedLines = this.lines;
        this.finished = true;
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

export { GradualTextRenderer };