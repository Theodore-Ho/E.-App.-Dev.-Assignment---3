/**
 * api methods start
 * **/
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

/* --------------------------------------------------- */

/**
 * Axios interceptor start
 * **/
let timestampStart = 0;

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
                warningAlert(response.data.msg);
                return Promise.resolve(response);
            } else {
                dangerAlert(response.data.msg);
                return Promise.resolve(response);
            }
        } else {
            dangerAlert("Unexpected error");
            return Promise.reject(response);
        }
    },
    error => {
        if(error.code === 'ECONNABORTED' || error.message === 'Network Error' || error.message.includes("timeout")) {
            dangerAlert("Timeout... please try again");
        } else {
            dangerAlert("Unexpected error");
        }
        return Promise.reject(error.response);
    });