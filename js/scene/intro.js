import { TextRenderer } from "/js/draw/text_renderer.js";

let textSize = 25;
let text = [
    "Thomas Jefferson has asked *Meriwether Lewis* to lead an expedition through the new land of Louisiana.\n\nYou, _William Clark_, have been asked to accompany him.",
    "On May 14, 1804, you and *Lewis*, in a group of about fifty people, set off along the Missouri river to begin your journey."
];
let offsetX = textSize * 2;
let offsetY = textSize * 3;
let lineSpacing = 5;
let textSpeed = 2;

class IntroScene {
    constructor(game) {
        this.game = game;
        this.started = false;
        this.startAnim = 500;
        this.frame = 0;
        this.textIndex = 0;
        this.textRenderer = new TextRenderer(this.game.width / textSize - 4, this.game.height, textSize, lineSpacing);
        this.textRenderer.setText(text[0]);
    }

    update() {
        this.frame++;
        if(this.frame % textSpeed === 0) {
            if(this.started && this.startAnim <= 0) {
                this.textRenderer.progress();
            }
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

            this.textRenderer.draw(context, offsetX, offsetY);

            if(this.textRenderer.finished()) {
                context.fillStyle = "#804a36";
                context.fillText(">", width - textSize * 2, height - textSize * 1);
                context.fillText(">", width - textSize * 2 - 15, height - textSize * 1);
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
            if(!this.started) {
                this.started = true;
            } else {
                if(!this.textRenderer.finished()) {
                    while(!this.textRenderer.finished()) {
                        this.textRenderer.progress();
                    }
                } else {
                    this.textIndex++;
                    this.textRenderer.setText(text[this.textIndex]);
                }
            }
        }
    }
}

export { IntroScene };