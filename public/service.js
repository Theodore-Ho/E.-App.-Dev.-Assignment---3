/**
 * Global variables
 * **/
let newColourPanelStatus = false;
const regexHex = /^#?[A-Fa-f0-9]{6}$/
const regexRgb = /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/
const regexH = /^(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-9]{2}|3[0-5][0-9]|360)(.\d+)?$/
const regexSL = /^(?:100|[1-9]?\d)(\.\d+)?$/

/**
 * Initialize the background color
 * **/
function initBackground() {
    const colour = getCookie("background");
    if(colour && colour.length > 0 && regexHex.test(colour)) {
        $("#wrap").css("background-color", colour);
    }
}

/**
 * Generate colour list
 * **/
async function generateColourList() {
    const res = await getColours();
    if(res.data.status === 200) {
        const colour_list = res.data.data;
        const ul = $("<ul></ul>");
        colour_list.forEach(item => {
            const li = $("<li></li>");
            const colour_item = $("<div></div>").addClass("colour-item").attr("colour-id", item.colorId);
            const colour_item_demo = $("<div></div>").addClass("colour-item-demo").css("background-color", item.hexString);
            const colour_item_name = $("<div></div>").addClass("colour-item-name").html(item.name);
            colour_item.append(colour_item_demo).append(colour_item_name);
            li.html(colour_item);
            ul.append(li);
        });
        $("#list").html(ul);
    }
}

/**
 * Generate colour details
 * **/
async function generateDetailColour(id) {
    const res = await getColourById(id);
    if(res.data.status === 200) {
        renderColourDetailPanel(res.data.data);
    }
}

/**
 * Generate detail of the clicked colour item in the list
 * **/
function toItem(id) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    generateDetailColour(id).then(() => {
        if(newColourPanelStatus) {
            restoreColourPanel();
        }
    });
}

/**
 * Go to the next colour in pagination
 * **/
async function nextColour() {
    const id = getCookie("colourId");
    const res = await getNextColour(id);
    if(res.data.status === 200) {
        renderColourDetailPanel(res.data.data);
    }
}

/**
 * Go to the previous colour in pagination
 * **/
async function previousColour() {
    const id = getCookie("colourId");
    const res = await getPreviousColour(id);
    if(res.data.status === 200) {
        renderColourDetailPanel(res.data.data);
    }
}

/**
 * Go to the last colour in pagination
 * **/
async function lastColour() {
    const res = await getLastColour();
    if(res.data.status === 200) {
        renderColourDetailPanel(res.data.data);
    }
}

/**
 * Go to the first colour in pagination
 * **/
async function firstColour() {
    const res = await getFirstColour();
    if(res.data.status === 200) {
        renderColourDetailPanel(res.data.data);
    }
}

/**
 * Go to the colour specified in the input box of the pagination
 * **/
async function goColour() {
    const id = $("#pagination-id").val();
    const res = await getColourById(id);
    if(res.data.status === 200) {
        renderColourDetailPanel(res.data.data);
    } else {
        const cookieId = getCookie("colourId");
        $("#pagination-id").val(cookieId);
    }
}

/**
 * Set background colour
 * **/
async function setBackground() {
    const id = getCookie("colourId");
    const res = await getColourById(id);
    if(res.data.status === 200) {
        $("#wrap").css("background-color", res.data.data.hexString);
        setBackgroundToCookie(res.data.data.hexString);
    }
}

/**
 * Restore colour details in the detail panel
 * **/
async function restoreColourDetail() {
    const id = getCookie("colourId");
    await generateDetailColour(id);
}

/**
 * Generate delete message and popup deletion modal box
 * **/
async function confirmDeleteColour() {
    const id = getCookie("colourId");
    const res = await getColourById(id);
    if(res.data.status === 200) {
        $("#confirm-delete-msg").html("Confirm delete colour \"<span style='color:" + res.data.data.hexString + "; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);'>" + res.data.data.name + "</span>\"?");
        $("#confirm-delete-modal").css("display", "block");
    }
}

/**
 * Delete colour after confirmation
 * **/
async function deleteColour() {
    const id = getCookie("colourId");
    const res = await doDeleteColour(id);
    $("#confirm-delete-modal").css("display", "none");
    if(res.data.status === 200) {
        await generateColourList();
        await lastColour();
        successAlert("Delete Success");
    }
}

/**
 * Save the edit of existing colour
 * **/
async function saveColour() {
    const id = getCookie("colourId");
    const requestBody = generateRequestBody();
    const res = await doSaveColour(id, requestBody);
    if(res.data.status === 200) {
        await generateColourList();
        successAlert("Save Success");
    }
}

/**
 * Switch to “add new colour” modal
 * **/
function newColourPanel() {
    newColourPanelStatus = true;
    $("#colour-id-block").css("display", "none");
    $("#pagination-nav").css("display", "none");
    $("#delete-btn-div").css("display", "none");
    $("#restore-btn-div").css("display", "none");
    $("#save-btn-div").css("display", "none");
    $("#cancel-btn-div").css("display", "block");
    $("#save-new-btn-div").css("display", "block");
    $("#active-color-id").val("");
    $("#active-color-name").val("");
    $("#active-color-hex").val("#ffffff");
    $("#active-color-r").val(255);
    $("#active-color-g").val(255);
    $("#active-color-b").val(255);
    $("#active-color-h").val(0);
    $("#active-color-s").val(0);
    $("#active-color-l").val(100);
    $("#active-colour").attr("color", "#ffffff");
}

/**
 * Cancel “add new colour” modal
 * **/
async function cancelNewColour() {
    restoreColourPanel();
    const id = getCookie("colourId");
    await generateDetailColour(id);
}

/**
 * Save the edit of new colour
 * **/
async function saveNewColour() {
    const requestBody = generateRequestBody();
    let res = await doSaveNewColour(requestBody);
    if(res.data.status === 200) {
        await generateColourList();
        restoreColourPanel();
        await generateDetailColour(res.data.data.newColourId);
        successAlert("Add Success");
    }
}

/**
 * When the user modifies hex, the rgb and hsl are modified in conjunction
 * **/
function changeHex(hex) {
    if(regexHex.test(hex)) {
        $("#active-color-hex").css("background-color", "#FFFFFF");
        const rgb = chromatism.convert(hex).rgb;
        const hsl = chromatism.convert(hex).hsl;
        changeAllValue(hex, rgb, hsl);
    } else {
        $("#active-color-hex").css("background-color", "rgba(255, 0, 0, 0.3)");
    }
}

/**
 * When the user modifies rgb, the hex and hsl are modified in conjunction
 * **/
function changeRGB(r, g, b) {
    if(regexRgb.test(r)) {
        $("#active-color-r").css("background-color", "#FFFFFF");
        if(regexRgb.test(g)) {
            $("#active-color-g").css("background-color", "#FFFFFF");
            if(regexRgb.test(b)) {
                $("#active-color-b").css("background-color", "#FFFFFF");
                const rgb = {
                    r: parseInt(r),
                    g: parseInt(g),
                    b: parseInt(b)
                };
                const hex = chromatism.convert(rgb).hex;
                const hsl = chromatism.convert(rgb).hsl;
                changeAllValue(hex, rgb, hsl);
            } else {
                $("#active-color-b").css("background-color", "rgba(255, 0, 0, 0.3)");
            }
        } else {
            $("#active-color-g").css("background-color", "rgba(255, 0, 0, 0.3)");
        }
    } else {
        $("#active-color-r").css("background-color", "rgba(255, 0, 0, 0.3)");
    }
}

/**
 * When the user modifies hsl, the hex and rgb are modified in conjunction
 * **/
function changeHSL(h, s, l) {
    if(regexH.test(h)) {
        $("#active-color-h").css("background-color", "#FFFFFF");
        if(regexSL.test(s)) {
            $("#active-color-s").css("background-color", "#FFFFFF");
            if(regexSL.test(l)) {
                $("#active-color-l").css("background-color", "#FFFFFF");
                const hsl = {
                    h: parseInt(h),
                    s: parseInt(s),
                    l: parseInt(l)
                };
                const hex = chromatism.convert(hsl).hex;
                const rgb = chromatism.convert(hsl).rgb;
                changeAllValue(hex, rgb, hsl);
            } else {
                $("#active-color-l").css("background-color", "rgba(255, 0, 0, 0.3)");
            }
        } else {
            $("#active-color-s").css("background-color", "rgba(255, 0, 0, 0.3)");
        }
    } else {
        $("#active-color-h").css("background-color", "rgba(255, 0, 0, 0.3)");
    }
}