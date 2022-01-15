import { MainScene } from "./scene/main.js";
import { IntroScene } from "./scene/intro.js";

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.scene = new IntroScene(this);

        this.resources = {};

        this.resources.font = new FontFace("moderndos", "url('/assets/ModernDOS8x8.ttf')");
        this.resources.font.load().then(() => document.fonts.add(this.resources.font));
        
        this.resources.icons = new Image();
        this.resources.icons.src = "/assets/icons.png";
    }

    finishIntro() {
        this.scene = new MainScene(this);
    }

    update() {
        this.scene.update();
    }

    draw(context) {
        this.scene.draw(context);
    }

    event(e) {
        this.scene.event(e);
    }
}

export { Game };