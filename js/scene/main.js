import { GradualTextRenderer } from "/js/draw/gradual_text_renderer.js";
import { RiverSituation } from "/js/situations/situations.js";

let unitSize = 25;
let choiceTextSize = 20;
let lineSpacing = 5;
let textSpeed = 1;

let situations = [
    new RiverSituation()
];

class MainScene {
    constructor(game) {
        this.game = game;

        this.vars = {
            people: 40,
            food: 100,
            health: 100,
            boat: false
        };

        this.textRenderer = new GradualTextRenderer(this.game.width / unitSize - 2, this.game.height / 2 - unitSize * 2, unitSize, lineSpacing);

        this.text = [];
        this.textIndex = 0;
        this.choices = [];

        this.newSituation();
        this.frame = 0;
    }

    update() {
        this.frame++;
        if(this.frame % textSpeed === 0) {
            this.textRenderer.progress();
        }
    }

    setText(texts) {
        this.textIndex = 0;
        this.text = texts;
        this.textRenderer.setText(this.text[this.textIndex]);
    }

    newSituation() {
        this.current = situations[Math.floor(Math.random() * situations.length)];
        this.situationState = {};
        this.setText(this.current.getText(this, this.situationState));
        this.choices = this.current.getChoices(this, this.situationState);
    }

    consumeFood() {
        this.vars.food -= this.vars.people * 0.5;
    }

    hurt(amount) {
        this.vars.health -= amount;
        if(amount <= 0) {
            
        }
    }

    draw(context) {
        let width = this.game.width;
        let height = this.game.height;

        // background
        context.fillStyle = "#ffe1af";
        context.fillRect(0, 0, width, height);
        context.strokeStyle = "#96533a";
        context.lineWidth = 16;
        context.strokeRect(0, 0, width, height);
        context.lineWidth = 8;
        context.strokeRect(0, 0, width, height / 2);

        // person count
        context.drawImage(this.game.resources.icons, 0, 0, 8, 8, unitSize, height - unitSize * 3, unitSize * 2, unitSize * 2);
        context.fillStyle = "#9c9289";
        context.font = "60px moderndos";
        context.fillText(this.vars.people, unitSize * 3.5, height - unitSize);
        
        // situation text
        context.font = "50px moderndos";
        context.textBaseline = "bottom";
        this.textRenderer.draw(context, unitSize, height / 2 + unitSize * 2);

        // choices
        if(this.choices.length > 0) {
            context.font = "40px moderndos";
            context.textBaseline = "bottom";

            let n = this.choices.length;
            let spacePerChoice = Math.floor(width / n);
            let verticalSpace = height / 2 - 12;
            for(let i = 0; i < n; i++) {
                let choice = this.choices[i];

                context.fillStyle = "#ffe1af";
                context.fillRect(i * spacePerChoice, 0, spacePerChoice, verticalSpace);

                if(i % 2 === 1) {
                    context.strokeStyle = "#0062d3";
                } else {
                    context.strokeStyle = "#dd3b00";
                }
                context.lineWidth = 8;
                context.strokeRect(4 + i * spacePerChoice, 4, spacePerChoice - 8, verticalSpace);

                context.fillStyle = "#804a36";
                context.fillText(choice.text, spacePerChoice * i + (spacePerChoice - choiceTextSize * choice.text.length) / 2, height / 4 + choiceTextSize / 2);
            }
        }
    }

    event(e) {
        if(e.type === "mouseup") {
            if(e.clientY < this.game.height / 2) {
                let widthPerChoice = this.game.width / this.choices.length;
                let clickedChoice = this.choices[Math.floor(e.clientX / widthPerChoice)];
                if(clickedChoice !== undefined) {
                    let result = this.current.choose(clickedChoice, this, this.situationState);
                    this.setText(result.text);
                    if(result.success) {
                        this.current = undefined;
                    } else {
                        this.choices = this.current.getChoices(this, this.situationState);
                    }
                }
            } else {
                if(!this.textRenderer.isFinished()) {
                    this.textRenderer.flush();
                } else {
                    this.textIndex++;
                    if(this.textIndex < this.text.length) {
                        this.textRenderer.setText(this.text[this.textIndex]);
                    } else {
                        if(this.current === undefined) {
                            this.newSituation();
                        }
                    }
                }
            }
        }
    }
}

export { MainScene };