import { Game } from "./game.js";

let canvas = document.getElementById("game");
let context = canvas.getContext("2d");

context.imageSmoothingEnabled = false;

let width = 800;
let height = 600;

let game = new Game(width, height);

let draw = () => {
    game.draw(context, width, height);
    window.requestAnimationFrame(draw);
}

window.addEventListener("keyup", e => game.event(e));
canvas.addEventListener("mousemove", e => game.event(e));
canvas.addEventListener("mosuedown", e => game.event(e));
canvas.addEventListener("mouseup", e => game.event(e));

window.requestAnimationFrame(draw);

let interval = window.setInterval(() => game.update(), 1000 / 30);