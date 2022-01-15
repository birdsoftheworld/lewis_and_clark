class Icon {
    constructor(image, sx, sy, sw, sh, sMul) {
        this.image = image;
        this.sx = sx;
        this.sy = sy;
        this.sw = sw;
        this.sh = sh;
        this.sMul = sMul;
    }

    draw(context, x, y, size) {
        context.drawImage(this.image, this.sx, this.sy, this.sw, this.sh, x, y, this.sMul * size, this.sMul * size);
    }
}

export { Icon };