// it is inefficient to have an object for every character
// but who really cares anyway
class Character {
    constructor(char, color) {
        this.char = char;
        this.color = color;
    }
}

export { Character };