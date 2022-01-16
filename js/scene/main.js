import { TextRenderer } from "/js/text/text_renderer.js";
import { GradualTextRenderer } from "/js/text/gradual_text_renderer.js";
import { RiverSituation, MeadowSituation } from "/js/situations/situations.js";
import { TextSettings } from "/js/text/text_settings.js";

let unitSize = 25;
let iconSize = 24;
let choiceTextSize = 16;
let lineSpacing = 5;
let textSpeed = 1;

let baseYear = 1804;

let situations = [
    s => new RiverSituation(s),
    s => new MeadowSituation(s)
];

const State = {
    START: "start",
    CHOICE: "choice",
    AFTER_CHOICE: "after_choice",
    END: "end",
    BETWEEN: "between"
};

class MainScene {
    constructor(game) {
        this.game = game;

        this.vars = {
            people: 40,
            food: 100,
            health: 100,
            boat: true,
            season: 0,
            day: 0,
            year: 0
        };

        this.textRenderer = new GradualTextRenderer(this.game.width / unitSize - 2, this.game.height / 2 - unitSize * 2, new TextSettings(unitSize, lineSpacing, "left"));
        this.choiceRenderer = new TextRenderer(0, 0, new TextSettings(choiceTextSize, lineSpacing, "center"));

        this.currentText = undefined;
        this.texts = [];
        this.choices = [];

        this.newSituation();
        this.nextText();
        this.frame = 0;
    }

    update() {
        this.frame++;
        if(this.frame % textSpeed === 0) {
            this.textRenderer.progress();
        }
        if(this.textSpeed === 0) {
            this.textRenderer.flush();
        }
        if(this.state === State.START && this.textIndex >= this.texts.length - 1) {
            this.state = State.CHOICE;
            this.choices = this.current.getChoices();
        }
    }

    addTexts(texts) {
        this.texts = this.texts.concat(texts);
    }

    nextText() {
        this.setCurrentText(this.texts.shift());
    }

    isNextText() {
        return this.texts.length > 0;
    }

    setCurrentText(text) {
        this.currentText = text;
        this.textRenderer.setText(text);
    }

    endSituation() {
        this.state = State.BETWEEN;
        this.spendTime(false, false);
        this.nextText();
    }

    newSituation() {
        this.current = situations[Math.floor(Math.random() * situations.length)](this);
        this.situationState = {};
        this.addTexts(this.current.getText());
        this.state = State.START;
        if(this.texts.length <= 1) {
            this.state = State.CHOICE;
            this.choices = this.current.getChoices();
        }
    }

    spendTime(safeFromCold, safeFromHunger) {
        let str = "Time passes. ";

        if(!safeFromHunger) {
            this.vars.food = Math.max(0, this.vars.food - (100/6));
        }

        if(this.vars.season === 3 && !safeFromCold) {
            str += "The Corps are injured by the harsh cold of the winter. ";
            this.hurt(25, "cold");
        }

        this.vars.day++;
        if(this.vars.day >= 3) {
            this.vars.day = 0;
            this.vars.season++;
            if(this.vars.season >= 4) {
                this.vars.season = 0;
                this.vars.year++;
            }
        }
        if(this.vars.day === 0) {
            let seasons = ["Spring", "Summer", "Fall", "Winter"]
            str += `\nIt is now ${seasons[this.vars.season]}. `;
            if(this.vars.season === 0) {
                str += `The year is now ${baseYear + this.vars.year}. `;
            }
        }
        if(this.vars.food <= 0) {
            str += "\n_You are starving._";
            this.hurt(34, "hunger");
        }
        this.addTexts([str]);
    }

    hurt(amount, source) {
        this.vars.health -= amount;
        if(amount <= 0) {
            this.game.gameOver(this.vars, source);
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
        context.drawImage(this.game.resources.icons, 0, 0, 8, 8, unitSize, height - unitSize * 3, unitSize * 2, iconSize * 2);
        context.fillStyle = "#9c9289";
        context.font = "60px moderndos";
        context.fillText(this.vars.people, unitSize * 3.5, height - unitSize);

        // bars
        context.drawImage(this.game.resources.icons, 8, 0, 8, 8, unitSize * 7, height - unitSize * 3, unitSize * 2, iconSize * 2);
        this.drawBar(context, unitSize * 9, height - unitSize * 2.5, unitSize * 6, unitSize * 1.25, "#8e0000", "#dd0000", this.vars.health / 100);

        context.drawImage(this.game.resources.icons, 16, 0, 8, 8, unitSize * 16, height - unitSize * 3, unitSize * 2, iconSize * 2);
        this.drawBar(context, unitSize * 18, height - unitSize * 2.5, unitSize * 6, unitSize * 1.25, "#603200", "#ab5700", this.vars.food / 100);
        
        // seasons
        let seasonImagePos = 16 * this.vars.season + 8;
        context.drawImage(this.game.resources.icons, seasonImagePos, 8, 8, 8, unitSize * 25, height - unitSize * 3, iconSize * 2, iconSize * 2);

        // days
        for(let i = 0; i < 3; i++) {
            let position = 32;
            if(this.vars.day >= i) {
                position += 8;
            }
            context.drawImage(this.game.resources.icons, position, 0, 8, 8, Math.floor(unitSize * 27) + unitSize * i, Math.floor(height - unitSize * 2.5), iconSize, iconSize);
        }

        // situation text
        context.font = "50px moderndos";
        context.textBaseline = "bottom";
        this.textRenderer.draw(context, unitSize, height / 2 + unitSize * 2);

        // choices
        if(this.choices.length > 0) {
            context.font = "32px moderndos";
            context.textBaseline = "bottom";

            let n = this.choices.length;
            let spacePerChoice = Math.floor(width / n);
            let verticalSpace = height / 2 - 12;

            let lineWidth = Math.floor(spacePerChoice / choiceTextSize - 1);
            this.choiceRenderer.width = lineWidth;
            this.choiceRenderer.height = verticalSpace;

            for(let i = 0; i < n; i++) {
                let choice = this.choices[i];

                context.fillStyle = "#ffe1af";
                context.fillRect(i * spacePerChoice, 0, spacePerChoice, verticalSpace);

                let colors = ["#e40303", "#ff8c00", "#ffed00", "#008026", "#004dff", "#750787"];
                context.strokeStyle = colors[i];
                context.lineWidth = 8;
                context.strokeRect(4 + i * spacePerChoice, 4, spacePerChoice - 8, verticalSpace);

                this.choiceRenderer.setText(choice.text);
                
                let verticalLines = this.choiceRenderer.lines.length;

                this.choiceRenderer.draw(context, choiceTextSize / 2 + spacePerChoice * i, height / 4 + choiceTextSize / 2 - (choiceTextSize / 2) * (verticalLines - 1));
            }
        }
    }

    drawBar(context, x, y, w, h, c1, c2, p) {
        context.fillStyle = c1;
        context.fillRect(x, y, w, h);
        context.fillStyle = c2;
        context.fillRect(x, y, w * p, h);
    }

    event(e) {
        if(e.type === "mouseup") {
            if(e.clientY < this.game.height / 2) {
                let widthPerChoice = this.game.width / this.choices.length;
                let clickedChoice = this.choices[Math.floor(e.clientX / widthPerChoice)];
                if(clickedChoice !== undefined) {
                    let result = this.current.choose(clickedChoice);
                    this.choices = [];
                    this.addTexts(result.text);
                    this.nextText();
                    if(result.success) {
                        this.current = undefined;
                        this.state = State.END;
                    } else {
                        this.state = State.AFTER_CHOICE;
                    }
                }
            } else {
                if(!this.textRenderer.isFinished()) {
                    this.textRenderer.flush();
                } else {
                    if(this.texts.length > 0) {
                        this.nextText();
                    } else {
                        if(this.state === State.AFTER_CHOICE) {
                            this.state = State.CHOICE;
                            this.addTexts(this.current.getText());
                            this.choices = this.current.getChoices();
                            this.nextText();
                        } else if(this.state === State.END) {
                            this.endSituation();
                        } else if(this.state === State.BETWEEN) {
                            this.newSituation();
                            this.nextText();
                        }
                    }
                }
            }
        }
    }
}

export { MainScene };