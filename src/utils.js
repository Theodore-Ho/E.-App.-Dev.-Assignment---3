const chromatism = require('chromatism');
const data = require("../data/256-colors.json");

/**
 * Validate ID is an integer
 * **/
function isValidId(id) {
    const regex = /^-?\d+$/
    return regex.test(id);
}

/**
 * Validate JSON format
 * **/
function isValidJson(json) {
    if(typeof json == 'object' && json) {
        return (json.r && json.g && json.b) || (json.h && json.s && json.l);
    } else {
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
            return parseInt(colour.colorId) === parseInt(inputColour.colorId);
        } else {
            return true;
        }
    }
}

/**
 * Validate colour hex, rgb, hsl are valid and matched
 * **/
function isValidColours(colour) {
    let inputHex = colour.hexString;
    let inputRgb = colour.rgb;
    let inputHsl = colour.hsl;
    if(!inputHex || !inputRgb || !inputHsl) { // validate not empty
        return false;
    }
    if(!/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(inputHex)) { // validate hex
        return false;
    }
    const regexRgb = /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/
    if (!(regexRgb.test(inputRgb.r.toString()) && regexRgb.test(inputRgb.g.toString()) && regexRgb.test(inputRgb.b.toString()))) {
        return false;
    }
    inputRgb = {
        r: parseInt(inputRgb.r.toString()),
        g: parseInt(inputRgb.g.toString()),
        b: parseInt(inputRgb.b.toString())
    }
    const regexH = /^(\d{1,2}|[1-2]\d{2}|3[0-5]\d)(\.\d+)?$/g
    const regexSl = /^(?:100|[1-9]?\d)$/
    if (!(regexH.test(inputHsl.h.toString()) && regexSl.test(inputHsl.s.toString()) && regexSl.test(inputHsl.l.toString()))) {
        return false;
    }
    inputHsl = {
        h: Math.floor(parseFloat(inputHsl.h.toString())), // accuracy does not match, round down to integer check
        s: parseInt(inputHsl.s.toString()),
        l: parseInt(inputHsl.l.toString())
    }
    // validate conversion
    let targetRgb = chromatism.convert(inputHex).rgb;
    let targetHsl = chromatism.convert(inputHex).hsl;
    targetHsl = {
        h: Math.floor(targetHsl.h), // accuracy does not match, round down to integer check
        s: Math.floor(targetHsl.s), // accuracy does not match, round down to integer check
        l: Math.floor(targetHsl.l) // accuracy does not match, round down to integer check
    }
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