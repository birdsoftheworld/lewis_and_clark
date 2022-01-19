import { MainScene } from "./scene/main.js";
import { IntroScene } from "./scene/intro.js";
import { GameOverScene } from "./scene/game_over.js";
import { WinScene } from "./scene/win.js";

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.scene = new IntroScene(this);

        this.resources = {};

        this.resources.font = new FontFace("moderndos", "url('./assets/ModernDOS8x8.ttf')");
        this.resources.font.load().then(() => document.fonts.add(this.resources.font));
        
        this.resources.icons = new Image();
        this.resources.icons.src = "./assets/icons.png";

        this.fadeTime = 0;
        this.totalFadeTime = 0;
    }

    fadeToBlack(time, onceDone) {
        this.fadeTime = time / 2;
        this.totalFadeTime = time;
        this.afterFade = onceDone;
    }

    startNewGame() {
        this.fadeToBlack(60, () => {
            this.scene = new MainScene(this);
        });
    }

    gameOver(stats, cause) {
        this.fadeToBlack(180, () => {
            this.scene = new GameOverScene(this, stats, cause);
        });
    }

    youWin(stats) {
        this.fadeToBlack(60, () => {
            this.scene = new WinScene(this, stats);
        });
    }

    update() {
        this.scene.update();
    }

    draw(context) {
        this.scene.draw(context);
        if(this.totalFadeTime > 0) {
            context.fillStyle = "black";
            let opacity = (this.totalFadeTime / 2 - Math.abs(this.fadeTime)) / (this.totalFadeTime / 2);
            context.save();
            context.globalAlpha = opacity;
            context.fillRect(0, 0, this.width, this.height);
            context.restore();
            this.fadeTime--;

            if(this.fadeTime < 0 && this.afterFade !== undefined) {
                this.afterFade();
                this.afterFade = undefined;
            }
            if(this.fadeTime < -this.totalFadeTime / 2) {
                this.totalFadeTime = 0;
                this.fadeTime = 0;
                this.afterFade = undefined;
            }
        }
    }

    event(e) {
        if(this.totalFadeTime > 0) {
            return;
        }
        this.scene.event(e);
    }
}

export { Game };