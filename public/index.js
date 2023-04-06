$(document).ready(function() {
    generateColourList().then(() => {});
});

async function generateColourList() {
    const res = await getColours();
    if(res.data.status === 200) {
        const colour_list = res.data.data;
        const ul = $("<ul></ul>");
        colour_list.forEach(item => {
            const li = $("<li></li>");
            const colour_item = $("<div></div>").addClass("colour-item");
            const colour_item_demo = $("<div></div>").addClass("colour-item-demo").css("background-color", item.hexString);
            const colour_item_name = $("<div></div>").addClass("colour-item-name").html(item.name);
            colour_item.append(colour_item_demo).append(colour_item_name);
            li.html(colour_item);
            ul.append(li);
        });
        $("#list").html(ul);
    }
}

function getColours() {
    return axios.get("/api/colours");
}

axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            if(response.data.status === 201) {
                console.log("Invalid colour ID");
                return Promise.resolve(response);
            } else if(response.data.status === 202) {
                console.log("Colour ID not exist");
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