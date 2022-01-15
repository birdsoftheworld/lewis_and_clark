import { TextRenderer } from "/js/text/text_renderer.js";

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
        this.drawText(context, x, y, this.displayedLines);
    }
}

export { GradualTextRenderer };