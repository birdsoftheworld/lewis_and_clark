let Util = {};

Util.getEnglishWordForNumber = n => {
    return [ "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten" ][n];
}

Util.capitalizeFirstLetter = s => s.charAt(0).toUpperCase() + s.substring(1);

export { Util };