const causes = {
    "river": "You were washed away by a river.",
    "attack": "You died fighting natives of the area.",
    "hunger": "You starved to death.",
    "cold": "You froze in the cold of winter."
};

class GameOverScene {
    constructor(game, stats, causeOfDeath) {
        this.game = game;
        this.causeOfDeath = causeOfDeath;
    }

    update() {}

    draw(context) {
        let width = this.game.width;
        let height = this.game.height;

        context.fillStyle = "black";
        context.fillRect(0, 0, width, height);

        context.textBaseline = "bottom";
        context.fillStyle = "white";

        context.font = "80px moderndos";
        this.drawText(context, "Game Over", 40, height / 4);

        context.font = "40px moderndos";
        this.drawText(context, causes[this.causeOfDeath], 20, height / 4 + 40);
        context.font = "60px moderndos";
        this.drawText(context, "Click to play again.", 30, height * (3/4));
    }

    drawText(context, text, textSize, y) {
        context.fillText(text, (this.game.width - text.length * textSize) / 2, y);
    }

    event(e) {
        if(e.type === "mouseup") {
            this.game.startNewGame();
        }
    }
}

export { GameOverScene };