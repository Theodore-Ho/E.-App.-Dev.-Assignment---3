/**
 * Danger alert message
 * **/
function dangerAlert(msg) {
    $("#toast-danger-msg").html(msg);
    const toastAlert = $("#toast-alert-danger");
    const toast = new bootstrap.Toast(toastAlert);
    toast.show();
}

/**
 * Warning alert message
 * **/
function warningAlert(msg) {
    $("#toast-warning-msg").html(msg);
    const toastAlert = $("#toast-alert-warning");
    const toast = new bootstrap.Toast(toastAlert);
    toast.show();
}

/**
 * Success alert message
 * **/
function successAlert(msg) {
    $("#toast-success-msg").html(msg);
    const toastAlert = $("#toast-alert-success");
    const toast = new bootstrap.Toast(toastAlert);
    toast.show();
}

/**
 * Public methods to change values of colour code
 * **/
function changeAllValue(hex, rgb, hsl) {
    $("#active-color-hex").val(hex);
    $("#active-color-r").val(rgb.r);
    $("#active-color-g").val(rgb.g);
    $("#active-color-b").val(rgb.b);
    $("#active-color-h").val(hsl.h);
    $("#active-color-s").val(hsl.s);
    $("#active-color-l").val(hsl.l);
    $("#active-colour").attr("color", hex);
    restoreValidate();
}

/**
 * Render values in colour detail panel
 * **/
function renderColourDetailPanel(colour) {
    $("#active-color-id").val(colour.colorId);
    $("#active-color-name").val(colour.name);
    changeAllValue(colour.hexString, colour.rgb, colour.hsl);
    $("#pagination-id").val(colour.colorId);
    setCurrentColourId(colour.colorId);
}

/**
 * Restore the colour detail panel from the "add new colour" status
 * **/
function restoreColourPanel() {
    newColourPanelStatus = false;
    $("#colour-id-block").css("display", "block");
    $("#pagination-nav").css("display", "block");
    $("#delete-btn-div").css("display", "block");
    $("#restore-btn-div").css("display", "block");
    $("#save-btn-div").css("display", "block");
    $("#cancel-btn-div").css("display", "none");
    $("#save-new-btn-div").css("display", "none");
}

/**
 * Remove the validation warning status of the colour code input box
 * **/
function restoreValidate() {
    $("#active-color-hex").css("background-color", "#FFFFFF");
    $("#active-color-r").css("background-color", "#FFFFFF");
    $("#active-color-g").css("background-color", "#FFFFFF");
    $("#active-color-b").css("background-color", "#FFFFFF");
    $("#active-color-h").css("background-color", "#FFFFFF");
    $("#active-color-s").css("background-color", "#FFFFFF");
    $("#active-color-l").css("background-color", "#FFFFFF");
}

/**
 * Generate request body before add or edit a colour
 * **/
function generateRequestBody() {
    const name = $("#active-color-name").val();
    const hex = $("#active-color-hex").val();
    const rgb_r = $("#active-color-r").val();
    const rgb_g = $("#active-color-g").val();
    const rgb_b = $("#active-color-b").val();
    const rgb = {
        r: rgb_r,
        g: rgb_g,
        b: rgb_b
    }
    const hsl_h = $("#active-color-h").val();
    const hsl_s = $("#active-color-s").val();
    const hsl_l = $("#active-color-l").val();
    const hsl = {
        h: hsl_h,
        s: hsl_s,
        l: hsl_l
    }
    return {
        name: name,
        hexString: hex,
        rgb: rgb,
        hsl: hsl
    };
}

/**
 * Set current colour id to cookie
 * **/
function setCurrentColourId(id) {
    document.cookie = "colourId=" + id;
}

/**
 * Set background colour to cookie
 * **/
function setBackgroundToCookie(hex) {
    document.cookie = "background=" + hex;
}

/**
 * Common method to get cookie
 * **/
function getCookie(cName) {
    const name = cName + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i<ca.length; i++)
    {
        const c = ca[i].trim();
        if (c.indexOf(name)===0) return c.substring(name.length,c.length);
    }
    return "";
}