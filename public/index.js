/**
 * Execute when DOM ready
 * **/
$(document).ready(function() {
    initBackground();
    generateColourList().then(() => {});
    let cookieColourId = getCookie("colourId");
    if(!cookieColourId) {
        cookieColourId = 0;
        setCurrentColourId(0);
    }
    generateDetailColour(cookieColourId).then(() => {});
    const $colorPicker = document.getElementById("active-colour");
    $colorPicker.addEventListener('change', (evt) => {
        restoreValidate();
        $("#active-color-hex").val(evt.detail.hex.toLowerCase());
        const rgb = chromatism.convert(evt.detail.hex).rgb; // convert use chromatism, make sure accuracy same as backend validation
        $("#active-color-r").val(rgb.r);
        $("#active-color-g").val(rgb.g);
        $("#active-color-b").val(rgb.b);
        const hsl = chromatism.convert(evt.detail.hex).hsl; // convert use chromatism, make sure accuracy same as backend validation
        $("#active-color-h").val(hsl.h.toFixed(2));
        $("#active-color-s").val(hsl.s.toFixed(2));
        $("#active-color-l").val(hsl.l.toFixed(2));
    });
});

/* --------------------------------------------------- */

/**
 * Click listen event start
 * **/
$(document).on("click", ".colour-item", function() {
    toItem($(this).attr("colour-id"));
});

$(document).on("click", "#next-colour-btn", function() {
    nextColour().then(() => {});
});

$(document).on("click", "#previous-colour-btn", function() {
    previousColour().then(() => {});
});

$(document).on("click", "#last-colour-btn", function() {
    lastColour().then(() => {});
});

$(document).on("click", "#first-colour-btn", function() {
    firstColour().then(() => {});
});

$(document).on("click", "#go-colour", function() {
    goColour().then(() => {});
});

$(document).on("click", "#set-bg-btn", function() {
    setBackground().then(() => {});
});

$(document).on("click", "#restore-btn", function() {
    restoreColourDetail().then(() => {});
});

$(document).on("click", "#delete-btn", function() {
    confirmDeleteColour().then(() => {});
});

$(document).on("click", ".close-delete-modal", function() {
    $("#confirm-delete-modal").css("display", "none");
});

$(document).on("click", "#confirm-delete", function() {
    deleteColour().then(() => {});
});

$(document).on("click", "#save-btn", function() {
    saveColour().then(() => {});
});

$(document).on("click", "#new-btn", function() {
    newColourPanel();
});

$(document).on("click", "#cancel-btn", function() {
    cancelNewColour().then(() => {});
});

$(document).on("click", "#save-new-btn", function() {
    saveNewColour().then(() => {});
});

/* --------------------------------------------------- */

/**
 * Input listen event start, used in the colour code modification linkage
 * **/
$(function() {
    $("#active-color-hex").bind("input propertychange", function () {
        changeHex($("#active-color-hex").val());
    });
});

$(function() {
    $("#active-color-r").bind("input propertychange", function () {
        changeRGB($("#active-color-r").val(), $("#active-color-g").val(), $("#active-color-b").val());
    });
});

$(function() {
    $("#active-color-g").bind("input propertychange", function () {
        changeRGB($("#active-color-r").val(), $("#active-color-g").val(), $("#active-color-b").val());
    });
});

$(function() {
    $("#active-color-b").bind("input propertychange", function () {
        changeRGB($("#active-color-r").val(), $("#active-color-g").val(), $("#active-color-b").val());
    });
});

$(function() {
    $("#active-color-h").bind("input propertychange", function () {
        changeHSL($("#active-color-h").val(), $("#active-color-s").val(), $("#active-color-l").val());
    });
});

$(function() {
    $("#active-color-s").bind("input propertychange", function () {
        changeHSL($("#active-color-h").val(), $("#active-color-s").val(), $("#active-color-l").val());
    });
});

$(function() {
    $("#active-color-l").bind("input propertychange", function () {
        changeHSL($("#active-color-h").val(), $("#active-color-s").val(), $("#active-color-l").val());
    });
});