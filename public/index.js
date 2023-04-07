$(document).ready(function() {
    initBackground();
    generateColourList().then(() => {});
    let cookieColourId = getCookie("colourId");
    if(!cookieColourId) {
        cookieColourId = 0;
        setCurrentColourId(0);
    }
    generateDetailColour(cookieColourId).then(() => {});
});

$(document).on("click", ".colour-item", function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const colour_id = $(this).attr("colour-id");
    generateDetailColour(colour_id).then(() => {});
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

function initBackground() {
    const colour = getCookie("background");
    if(colour && colour.length > 0 && /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colour)) {
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
    $("#active-color-s").val(colour.hsl.h);
    $("#active-color-l").val(colour.hsl.s);
    $("#active-color-h").val(colour.hsl.l);
    $("#pagination-id").val(colour.colorId);
    $("#active-colour").css("background-color", colour.hexString);
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
    const res = await deleteColourById(id);
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

function deleteColourById(id) {
    return axios.delete("/api/colours/" + id);
}

axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            if(response.data.status === 201 || response.data.status === 202 || response.data.status === 209) {
                $("#toast-danger-msg").html(response.data.msg);
                const toastAlert = $("#toast-alert-danger");
                const toast = new bootstrap.Toast(toastAlert);
                toast.show();
                lastColour().then(() => {});
                return Promise.resolve(response);
            } else if(response.data.status === 203) {
                console.log("Contains invalid colour");
                return Promise.resolve(response);
            } else if(response.data.status === 204) {
                console.log("Colour name already exists");
                return Promise.resolve(response);
            } else if(response.data.status === 205) {
                console.log("Colour name is missing");
                return Promise.resolve(response);
            } else if(response.data.status === 206) {
                console.log("ID is missing");
                return Promise.resolve(response);
            } else if(response.data.status === 207 || response.data.status === 208) {
                $("#toast-warning-msg").html(response.data.msg);
                const toastAlert = $("#toast-alert-warning");
                const toast = new bootstrap.Toast(toastAlert);
                toast.show();
                return Promise.resolve(response);
            } else {
                return Promise.resolve(response); // case response.data.status === 200
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