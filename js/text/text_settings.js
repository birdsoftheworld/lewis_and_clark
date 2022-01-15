class TextSettings {
    constructor(textSize, lineSpacing, align, stripWhitespace) {
        this.textSize = textSize;
        this.lineSpacing = lineSpacing ?? 0;
        this.align = align ?? "left";
        this.stripWhitespace = stripWhitespace ?? true;
    }
}

export { TextSettings };