import { MainScene } from "./scene/main.js";
import { IntroScene } from "./scene/intro.js";

class Game {
    constructor(width, height) {
        this.scene = new IntroScene(this);
        this.font = new FontFace("moderndos", "url('/assets/ModernDOS8x8.ttf')");
        this.font.load().then(() => document.fonts.add(this.font));

        this.width = width;
        this.height = height;
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