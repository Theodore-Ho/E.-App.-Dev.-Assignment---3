let newColourPanelStatus = false;
const regexHex = /^#?[A-Fa-f0-9]{6}$/
const regexRgb = /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/
const regexH = /^(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-9]{2}|3[0-5][0-9]|360)(.\d+)?$/
const regexSL = /^(?:100|[1-9]?\d)(\.\d+)?$/
let timestampStart = 0;

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
        $("#active-color-h").val(hsl.h.toFixed(4));
        $("#active-color-s").val(hsl.s.toFixed(4));
        $("#active-color-l").val(hsl.l.toFixed(4));
    });
});

$(document).on("click", ".colour-item", function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const colour_id = $(this).attr("colour-id");
    generateDetailColour(colour_id).then(() => {
        if(newColourPanelStatus) {
            restoreColourPanel();
        }
    });
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

$(function() {
    $("#active-color-hex").bind("input propertychange", function () {
        changeHex($("#active-color-hex").val());
    });
});

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

$(function() {
    $("#active-color-h").bind("input propertychange", function () {
        changeHSL($("#active-color-h").val(), $("#active-color-s").val(), $("#active-color-l").val());
    });
});

$(function() {
    $("#active-color-s").bind("input propertychange", function () {
        changeHSL(
            parseFloat($("#active-color-h").val()),
            parseFloat($("#active-color-s").val()),
            parseFloat($("#active-color-l").val())
        );
    });
});

$(function() {
    $("#active-color-l").bind("input propertychange", function () {
        changeHSL($("#active-color-h").val(), $("#active-color-s").val(), $("#active-color-l").val());
    });
});

function changeHSL(h, s, l) {
    if(regexH.test(h)) {
        $("#active-color-h").css("background-color", "#FFFFFF");
        if(regexSL.test(s)) {
            $("#active-color-s").css("background-color", "#FFFFFF");
            if(regexSL.test(l)) {
                $("#active-color-l").css("background-color", "#FFFFFF");
                const hsl = {
                    h: h,
                    s: s,
                    l: l
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

function restoreValidate() {
    $("#active-color-hex").css("background-color", "#FFFFFF");
    $("#active-color-r").css("background-color", "#FFFFFF");
    $("#active-color-g").css("background-color", "#FFFFFF");
    $("#active-color-b").css("background-color", "#FFFFFF");
    $("#active-color-h").css("background-color", "#FFFFFF");
    $("#active-color-s").css("background-color", "#FFFFFF");
    $("#active-color-l").css("background-color", "#FFFFFF");
}

function initBackground() {
    const colour = getCookie("background");
    if(colour && colour.length > 0 && regexHex.test(colour)) {
        $("#wrap").css("background-color", colour);
    }
}

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

async function generateDetailColour(id) {
    const res = await getColourById(id);
    if(res.data.status === 200) {
        renderColourDetailPanel(res.data.data);
    }
}

function renderColourDetailPanel(colour) {
    $("#active-color-id").val(colour.colorId);
    $("#active-color-name").val(colour.name);
    $("#active-color-hex").val(colour.hexString);
    $("#active-color-r").val(colour.rgb.r);
    $("#active-color-g").val(colour.rgb.g);
    $("#active-color-b").val(colour.rgb.b);
    $("#active-color-h").val(colour.hsl.h);
    $("#active-color-s").val(colour.hsl.s);
    $("#active-color-l").val(colour.hsl.l);
    $("#pagination-id").val(colour.colorId);
    $("#active-colour").attr("color", colour.hexString);
    setCurrentColourId(colour.colorId);
}

async function nextColour() {
    const id = getCookie("colourId");
    const res = await getNextColour(id);
    if(res.data.status === 200) {
        renderColourDetailPanel(res.data.data);
    }
}

async function previousColour() {
    const id = getCookie("colourId");
    const res = await getPreviousColour(id);
    if(res.data.status === 200) {
        renderColourDetailPanel(res.data.data);
    }
}

async function lastColour() {
    const res = await getLastColour();
    if(res.data.status === 200) {
        renderColourDetailPanel(res.data.data);
    }
}

async function firstColour() {
    const res = await getFirstColour();
    if(res.data.status === 200) {
        renderColourDetailPanel(res.data.data);
    }
}

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

async function setBackground() {
    const id = getCookie("colourId");
    const res = await getColourById(id);
    if(res.data.status === 200) {
        $("#wrap").css("background-color", res.data.data.hexString);
        setBackgroundToCookie(res.data.data.hexString);
    }
}

async function restoreColourDetail() {
    const id = getCookie("colourId");
    await generateDetailColour(id);
}

async function confirmDeleteColour() {
    const id = getCookie("colourId");
    const res = await getColourById(id);
    if(res.data.status === 200) {
        $("#confirm-delete-msg").html("Confirm delete colour \"<span style='color:" + res.data.data.hexString + "; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);'>" + res.data.data.name + "</span>\"?");
        $("#confirm-delete-modal").css("display", "block");
    }
}

async function deleteColour() {
    const id = getCookie("colourId");
    const res = await doDeleteColour(id);
    $("#confirm-delete-modal").css("display", "none");
    if(res.data.status === 200) {
        await generateColourList();
        await lastColour();
        $("#toast-success-msg").html("Delete Success");
        const toastAlert = $("#toast-alert-success");
        const toast = new bootstrap.Toast(toastAlert);
        toast.show();
    }
}

async function saveColour() {
    const id = getCookie("colourId");
    const requestBody = generateRequestBody();
    const res = await doSaveColour(id, requestBody);
    if(res.data.status === 200) {
        await generateColourList();
        $("#toast-success-msg").html("Save Success");
        const toastAlert = $("#toast-alert-success");
        const toast = new bootstrap.Toast(toastAlert);
        toast.show();
    }
}

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

async function cancelNewColour() {
    restoreColourPanel();
    const id = getCookie("colourId");
    await generateDetailColour(id);
}

async function saveNewColour() {
    const requestBody = generateRequestBody();
    let res = await doSaveNewColour(requestBody);
    if(res.data.status === 200) {
        $("#toast-success-msg").html("Add Success");
        const toastAlert = $("#toast-alert-success");
        const toast = new bootstrap.Toast(toastAlert);
        toast.show();
        await generateColourList();
        restoreColourPanel();
        await generateDetailColour(res.data.data.newColourId);
    }
}

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

function setCurrentColourId(id) {
    document.cookie = "colourId=" + id;
}

function setBackgroundToCookie(id) {
    document.cookie = "background=" + id;
}

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

function getColours() {
    return axios.get("/api/colours");
}

function getColourById(id) {
    return axios.get("/api/colours/" + id);
}

function getNextColour(id) {
    return axios.get("/api/nextColour/" + id);
}

function getPreviousColour(id) {
    return axios.get("/api/previousColour/" + id);
}

function getLastColour() {
    return axios.get("/api/lastColour");
}

function getFirstColour() {
    return axios.get("/api/firstColour");
}

function doDeleteColour(id) {
    return axios.delete("/api/colours/" + id);
}

function doSaveColour(id, data) {
    return axios.put("/api/colours/" + id, data);
}

function doSaveNewColour(data) {
    return axios.post("/api/colours", data);
}

axios.interceptors.request.use(
    function(config) {
        timestampStart = Date.now();
        return config;
    },
    function(error) {
        return Promise.reject(error);
    });

axios.interceptors.response.use(
    response => {
        const timestampEnd = Date.now();
        const latency = Math.abs(timestampEnd - timestampStart);
        $("#latency").html(latency);
        if (response.status === 200) {
            if(response.data.status === 200) {
                restoreValidate();
                return Promise.resolve(response);
            } else if(response.data.status === 207 || response.data.status === 208) {
                $("#toast-warning-msg").html(response.data.msg);
                const toastAlert = $("#toast-alert-warning");
                const toast = new bootstrap.Toast(toastAlert);
                toast.show();
                return Promise.resolve(response);
            } else {
                $("#toast-danger-msg").html(response.data.msg);
                const toastAlert = $("#toast-alert-danger");
                const toast = new bootstrap.Toast(toastAlert);
                toast.show();
                if(response.data.status === 201 || response.data.status === 202 || response.data.status === 206) {
                    lastColour().then(() => {});
                }
                return Promise.resolve(response);
            }
        } else {
            console.log("Unexpected error");
            return Promise.reject(response);
        }
    },
    error => {
        if(error.code === 'ECONNABORTED' || error.message === 'Network Error' || error.message.includes("timeout")) {
            console.log("Timeout...");
        } else {
            console.log("Unexpected error");
        }
        return Promise.reject(error.response);
    });