const chromatism = require('chromatism');
const data = require("../data/256-colors.json");

/**
 * Validate ID is an integer
 * **/
function isValidId(id) {
    return !isNaN(id) && parseInt(id) === Number(id) && Number.isInteger(Number(id));
}

/**
 * Validate JSON format
 * **/
function isValidJson(jsonString) {
    try {
        JSON.parse(jsonString.trim());
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Validate colour name not exist
 * if existed, return false, otherwise return true
 * **/
function isValidName(inputColour, action) {
    const colour = data.find((colour) => colour.name.toLowerCase() === inputColour.name.toLowerCase());
    if(action === "ADD") {
        return !colour;
    } else { // case "EDIT"
        if(colour) {
            return colour.colorId === inputColour.colorId;
        } else {
            return true;
        }
    }
}

/**
 * Validate colour hex, rgb, hsl are valid and matched
 * **/
function isValidColours(colour) {
    const inputHex = colour.hexString;
    const inputRgb = colour.rgb;
    const inputHsl = colour.hsl;
    if(!inputHex || !inputRgb || !inputHsl) { // validate not empty
        return false;
    }
    if(!/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(inputHex)) { // validate hex
        return false;
    }
    if(!(Number.isInteger(inputRgb.r) && Number.isInteger(inputRgb.g) && Number.isInteger(inputRgb.b) &&
        inputRgb.r >= 0 && inputRgb.r <= 255 && inputRgb.g >= 0 && inputRgb.g <= 255 && inputRgb.b >= 0 && inputRgb.b <= 255)) { // validate rgb
        return false;
    }
    if(!(Number.isInteger(inputHsl.h) && Number.isInteger(inputHsl.s) && Number.isInteger(inputHsl.l) &&
        inputHsl.h >= 0 && inputHsl.h <= 360 && inputHsl.s >= 0 && inputHsl.s <= 100 && inputHsl.l >= 0 && inputHsl.l <= 100)) { // validate hsl
        return false;
    }
    // validate conversion
    const targetRgb = chromatism.convert(inputHex).rgb;
    const targetHsl = chromatism.convert(inputHex).hsl;
    const isSameRgb = (inputRgb.r === targetRgb.r) && (inputRgb.g === targetRgb.g) && (inputRgb.b === targetRgb.b);
    const isSameHsl = (inputHsl.h === targetHsl.h) && (inputHsl.s === targetHsl.s) && (inputHsl.l === targetHsl.l);

    return isSameRgb && isSameHsl;
}

module.exports = {
    isValidId: isValidId,
    isValidJson: isValidJson,
    isValidName: isValidName,
    isValidColours: isValidColours
};