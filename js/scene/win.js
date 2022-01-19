import { GradualTextRenderer } from "../text/gradual_text_renderer.js";
import { TextSettings } from "../text/text_settings.js";

let textSize = 25;
let offsetX = textSize * 2;
let offsetY = textSize * 3;
let lineSpacing = 5;
let textSpeed = 2;

class WinScene {
    constructor(game, stats) {
        this.game = game;
        this.stats = stats;

        let deaths = 40 - this.stats.people;
        this.text = [
            `You and *Lewis*, along with your remaining crew of ${this.stats.people}, reached St. Louis in the ${["Spring", "Summer", "Fall", "Winter"][this.stats.season]} of ${1804 + this.stats.year}.`,
            `There ${deaths === 1 ? "was" : "were"} ${deaths > 0 ? deaths : "no"} death${deaths === 1 ? "" : "s"} on your journey.`
        ];
        this.score = 50 * this.stats.people - 10 * this.stats.timeSpent;
        this.statsText = `_Your score:_\n50 x ${this.stats.people}{person}\n-\n10 x ${this.stats.timeSpent}{time}\n=`;

        this.frame = 0;
        this.textIndex = 0;
        this.textRenderer = new GradualTextRenderer(this.game.width / textSize - 4, this.game.height, new TextSettings(textSize, lineSpacing, "left"));
        this.textRenderer.setText(this.text[0]);
        this.showingScores = false;
    }

    update() {
        this.frame++;
        if(this.frame % textSpeed === 0) {
            this.textRenderer.progress();
        }
    }

    draw(context) {
        let width = this.game.width;
        let height = this.game.height;

        context.fillStyle = "#ffe1af";
        context.fillRect(0, 0, width, height);
        context.strokeStyle = "#96533a";
        context.lineWidth = 16;
        context.strokeRect(0, 0, width, height);

        if(!this.showingScores) {
            context.font = "50px moderndos";
            context.textBaseline = "bottom";
            this.textRenderer.draw(context, offsetX, offsetY);

            if(this.textRenderer.isFinished()) {
                context.fillStyle = "#804a36";
                context.fillText(">", width - textSize * 2, height - textSize * 1);
                context.fillText(">", width - textSize * 2 - 15, height - textSize * 1);
            }
        } else {
            context.fillStyle = "#804a36";
            context.font = "160px moderndos";
            context.textBaseline = "bottom";
            if(this.textRenderer.isFinished()) {
                this.drawText(context, this.score.toString(), 80, 450);
            }
            this.drawText(context, "You win!", 80, 150);
            context.font = "60px moderndos";
            this.textRenderer.draw(context, 0, offsetY + 125);
            
            context.fillStyle = "#804a36";
            if(this.textRenderer.isFinished()) {
                this.drawText(context, "Click to play again!", 30, 500);
            }
        }
    }

    drawText(context, text, textSize, y) {
        context.fillText(text, (this.game.width - text.length * textSize) / 2, y);
    }

    event(e) {
        if(e.type === "mouseup") {
            if(!this.showingScores && !this.textRenderer.isFinished()) {
                this.textRenderer.flush();
            } else if(!this.showingScores) {
                this.textIndex++;
                if(this.textIndex < this.text.length) {
                    this.textRenderer.setText(this.text[this.textIndex]);
                } else {
                    this.showingScores = true;
                    this.textRenderer.setText(this.statsText);
                    this.textRenderer.textSettings.textSize = 30;
                    this.textRenderer.textSettings.align = "center";
                    this.textRenderer.width = this.game.width / 30;
                }
            } else if(this.showingScores && this.textRenderer.isFinished()) {
                this.game.startNewGame();
            }
        }
    }
}

export { WinScene };