// ----------------------------------------------------------------------------- //

// ----------------- //
/* Global variables */
// ----------------- //

let effect_1_active = false; // check the effect 1 is active
let effect_4_generated = false; // check the effect 4 has been generated
let effect_4_active = false; // check the effect 4 is active
let timer2; // setInterval result of effect 2

// ----------------------------------------------------------------------------- //

// ----------------- //
/* Dom click event */
// ----------------- //

// click generate table button
$(document).on("click", "#generate-table-btn", function() {
    const table_placeholder = $("#table-placeholder");
    table_placeholder.empty();
    table_placeholder.html("Currently reading the file in folder \"country-objects\", please wait...");
    const start = performance.now();
    setTimeout(function() {
        generateTable('20').then(function() {
            const end = performance.now();
            $("#rendering-msg").css("display", "block");
            $("#rendering-msg-content").html("The table has been created and has taken " + ((end - start) / 1000).toFixed(4) + " seconds.");
        });
    }, 5000);
});

// click select display 20 countries button
$(document).on("click", "#display-20", function() {
    generatePlaceholder();
    generateTable('20').then(() => {});
});

// click select display all countries button
$(document).on("click", "#display-all", function() {
    generatePlaceholder();
    generateTable('ALL').then(() => {});
});

// click effect 1 button
$(document).on("click", "#effect_1", function() {
    effect1();
});

// click effect 2 button
$(document).on("click", "#effect_2", function() {
    effect2();
});

// click effect 3 button
$(document).on("click", "#effect_3", function() {
    effect3();
});

// click effect 4 button
$(document).on("click", "#effect_4", function() {
    effect4();
});

// click effect 5 button
$(document).on("click", "#effect_5", function() {
    effect5();
});

// click effect 6 button
$(document).on("click", "#effect_6", function() {
    effect6();
});

// ----------------------------------------------------------------------------- //

// ----------------- //
/* Effect functions */
// ----------------- //

// effect 1: change background color
function effect1() {
    const effect_1_btn = $("#effect_1_btn");
    const effect_1_status = effect_1_btn.html();
    const container = $("#container");
    if(effect_1_status === "Restore") {
        effect_1_active = false;
        effect_1_btn.html("Effect 1");
        container.animate({
            backgroundColor: "",
            color: "#000000"
        }, 1000 );
        if(!effect_4_active && effect_4_generated) { // if effect 4 has been generated, but not active. When effect 4 is active, effect 1 doesn't change font colour
            $('#txt-content p').each(function() { // change every character's colour under '#txt-content p'
                const text = $(this).text();
                let newHtml = '';
                for (let i = 0; i < text.length; i++) {
                    newHtml += '<span style="color: #000000">' + text[i] + '</span>';
                }
                $(this).html(newHtml);
            });
        }
    } else {
        effect_1_active = true;
        effect_1_btn.html("Restore");
        container.animate({
            backgroundColor: "#000000",
            color: "#FFFFFF"
        }, 1000 );
        if(!effect_4_active && effect_4_generated) { // if effect 4 has been generated, but not active. When effect 4 is active, effect 1 doesn't change font colour
            $('#txt-content p').each(function() { // change every character's colour under '#txt-content p'
                const text = $(this).text();
                let newHtml = '';
                for (let i = 0; i < text.length; i++) {
                    newHtml += '<span style="color: #FFFFFF">' + text[i] + '</span>';
                }
                $(this).html(newHtml);
            });
        }
    }
}

// effect 2: font size animation
function effect2() {
    const effect_2_btn = $("#effect_2_btn");
    const effect_2_status = effect_2_btn.html();
    if(effect_2_status === "Restore") {
        effect_2_btn.html("Effect 2");
        $('#txt-content').css('font-size', '16px');
        clearInterval(timer2);
    } else {
        effect_2_btn.html("Restore");
        fontSizeAnimation();
    }

    function fontSizeAnimation() {
        const txt_content = $('#txt-content');
        const maxSize = 20;
        const minSize = 12;
        let currentSize = parseInt(txt_content.css('font-size'));
        let increment = 1;
        let newFontSize = currentSize + increment;
        if (newFontSize > maxSize) {
            newFontSize = maxSize;
        }
        timer2 = setInterval(function() {
            currentSize = parseInt(txt_content.css('font-size'));
            newFontSize = currentSize + increment;
            if (newFontSize > maxSize) {
                increment = -1;
            } else if (newFontSize < minSize) {
                increment = 1;
            }
            txt_content.css('font-size', newFontSize + 'px');
        }, 50);
    }
}

// effect 3: rotate animation
function effect3() {
    const txt_content = $('#txt-content');
    const effect_3_btn = $("#effect_3_btn");
    const effect_3_status = effect_3_btn.html();
    if(effect_3_status === "Restore") {
        effect_3_btn.html("Effect 3");
        txt_content.removeClass("rotate");
    } else {
        effect_3_btn.html("Restore");
        txt_content.addClass("rotate");
    }
}

// effect 4: change every character colour
function effect4() {
    effect_4_generated = true;
    const effect_4_btn = $("#effect_4_btn");
    const effect_4_status = effect_4_btn.html();
    if(effect_4_status === "Restore") {
        effect_4_active = false;
        effect_4_btn.html("Effect 4");
        $('#txt-content p').each(function() { // change every character's colour under '#txt-content p'
            const text = $(this).text();
            let newHtml = '';
            for (let i = 0; i < text.length; i++) {
                if(effect_1_active) { // compatible effect 1, if effect 1 is active, font colour should be white
                    newHtml += '<span style="color: #FFFFFF">' + text[i] + '</span>';
                } else {
                    newHtml += '<span style="color: #000000">' + text[i] + '</span>';
                }
            }
            $(this).html(newHtml);
        });
    } else {
        effect_4_active = true;
        effect_4_btn.html("Restore");
        $('#txt-content p').each(function() { // change every character's colour under '#txt-content p'
            const text = $(this).text();
            let newHtml = '';
            for (let i = 0; i < text.length; i++) {
                const color = getColor();
                newHtml += '<span style="color: ' + color + '">' + text[i] + '</span>';
            }
            $(this).html(newHtml);
        });
    }

    function getColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    }
}

// effect 5: active drag button
function effect5() {
    const txt_content_ajax = $("#txt-content-ajax");
    const drag_btn = $("#drag-btn");
    const effect_5_btn = $("#effect_5_btn");
    const effect_5_status = effect_5_btn.html();
    if(effect_5_status === "Restore") {
        effect_5_btn.html("Effect 5");
        drag_btn.css("display", "none");
        txt_content_ajax.css("z-index", "");
        txt_content_ajax.draggable( "destroy" );
    } else {
        effect_5_btn.html("Restore");
        drag_btn.css("display", "block");
        txt_content_ajax.draggable({
            handle: "#drag-btn",
            revert: true
        });
        txt_content_ajax.css("z-index", "999");
    }
}

// effect 6: hide paragraph
function effect6() {
    const txt_content = $('#txt-content');
    const effect_6_btn = $("#effect_6_btn");
    const effect_6_status = effect_6_btn.html();
    if(effect_6_status === "Restore") {
        effect_6_btn.html("Effect 6");
        txt_content.show( "explode", {}, 1000, {} );
    } else {
        effect_6_btn.html("Restore");
        txt_content.hide( "explode", {}, 1000, {} );
    }
}

// ----------------------------------------------------------------------------- //

// ----------------- //
/* Generate table functions */
// ----------------- //

async function generateTable(display) {
    let table_data = []; // requirements require the use two-dimensional array, I suggest using a one-dimensional array containing json objects, the 2D array is wierd
    let country_exist = false;

    // capital
    const capital_str = await getCapital();
    const capital = $.parseJSON(capital_str);
    for(let i of capital) {
        const country = [i.country, i.city, null, null, null, null, null];
        table_data.push(country);
    }

    // continent
    const continent_str = await getContinent();
    const continent = $.parseJSON(continent_str);
    for(let i of continent) {
        country_exist = false;
        for(let j in table_data) {
            if(i.country === table_data[j][0]) {
                country_exist = true;
                const country = table_data[j];
                country[2] = i.continent;
                break;
            }
        }
        if(!country_exist) { // if the country not exist, create a new array append at the end, with capital null
            const country = [i.country, null, i.continent, null, null, null, null];
            table_data.push(country);
        }
    }

    // coastline
    const coastline_str = await getCoastline();
    const coastline = $.parseJSON(coastline_str);
    for(let i of coastline) {
        country_exist = false;
        for(let j in table_data) {
            if(i.country === table_data[j][0]) {
                country_exist = true;
                const country = table_data[j];
                country[3] = i.costline;
                break;
            }
        }
        if(!country_exist) {
            const country = [i.country, null, null, i.costline, null, null, null];
            table_data.push(country);
        }
    }

    // currency
    const currency_str = await getCurrency();
    const currency = $.parseJSON(currency_str);
    for(let i of currency) {
        country_exist = false;
        for(let j in table_data) {
            if(i.country === table_data[j][0]) {
                country_exist = true;
                const country = table_data[j];
                country[4] = i.currency_name;
                break;
            }
        }
        if(!country_exist) {
            const country = [i.country, null, null, null, i.currency_name, null, null];
            table_data.push(country);
        }
    }

    // domain
    const domain_str = await getDomain();
    const domain = $.parseJSON(domain_str);
    for(let i of domain) {
        country_exist = false;
        for(let j in table_data) {
            if(i.country === table_data[j][0]) {
                country_exist = true;
                const country = table_data[j];
                country[5] = i.tld;
                break;
            }
        }
        if(!country_exist) {
            const country = [i.country, null, null, null, null, i.tld, null];
            table_data.push(country);
        }
    }

    // flag
    const flag_str = await getFlag();
    const flag = $.parseJSON(flag_str);
    for(let i of flag) {
        country_exist = false;
        for(let j in table_data) {
            if(i.country === table_data[j][0]) {
                country_exist = true;
                const country = table_data[j];
                country[6] = i.flag_base64;
                break;
            }
        }
        if(!country_exist) {
            const country = [i.country, null, null, null, null, null, i.flag_base64];
            table_data.push(country);
        }
    }

    const final_table_data = cleanData(table_data);

    const table = $("<table></table>").addClass("table table-bordered");

    // table header
    const country_th = $("<th></th>").attr("scope", "col").html("Country");
    const capital_th = $("<th></th>").attr("scope", "col").html("Capital");
    const continent_th = $("<th></th>").attr("scope", "col").html("Continent");
    const coastline_th = $("<th></th>").attr("scope", "col").html("Coastline");
    const currency_th = $("<th></th>").attr("scope", "col").html("Currency");
    const domain_th = $("<th></th>").attr("scope", "col").html("domain");
    const flag_th = $("<th></th>").attr("scope", "col").html("flag");
    const tr = $("<tr></tr>").append(country_th).append(capital_th).append(continent_th).append(coastline_th)
        .append(currency_th).append(domain_th).append(flag_th);
    const thead = $("<thead></thead>").append(tr);
    table.append(thead);

    // table body
    const tbody = $("<tbody></tbody>");
    let table_rows = 20;
    if(display === "ALL") {
        table_rows = final_table_data.length;
    }
    for(let i = 0; i < table_rows; i++) {
        const country = $("<td></td>").append(final_table_data[i][0]);
        const capital = $("<td></td>").append(final_table_data[i][1]);
        const continent = $("<td></td>").append(final_table_data[i][2]);
        const coastline = $("<td></td>").append(final_table_data[i][3]);
        const currency = $("<td></td>").append(final_table_data[i][4]);
        const domain = $("<td></td>").append(final_table_data[i][5]);
        let flag = $("<td></td>").append("NO_DATA");
        if(final_table_data[i][6] !== "NO_DATA") {
            flag = $("<td></td>").append("<img src='" + final_table_data[i][6] + "' alt='Flag' style='width: 5em'/>");
        }
        const tr = $("<tr></tr>").append(country).append(capital).append(continent)
            .append(coastline).append(currency).append(domain).append(flag);
        tbody.append(tr);
    }
    table.append(tbody);

    // display dropdown
    const display_20_btn = $("<span></span>").addClass("dropdown-item").attr("id", "display-20").html("20");
    const display_all_btn = $("<span></span>").addClass("dropdown-item").attr("id", "display-all").html("All");
    if(display === "20") {
        display_20_btn.addClass("active");
    } else {
        display_all_btn.addClass("active");
    }
    const display_20_li = $("<li></li>").append(display_20_btn);
    const display_all_li = $("<li></li>").append(display_all_btn);
    const display_ul = $("<ul></ul>").addClass("dropdown-menu").append(display_20_li).append(display_all_li);
    const display_btn = $("<button></button>").addClass("btn btn-sm dropdown-toggle").attr("type", "button").attr("data-bs-toggle", "dropdown").html("Display").append(display_ul);
    const display_dropdown = $("<div></div>").addClass("dropdown").css("float", "right").append(display_btn);

    // table section header
    const table_title = $("<h5></h5>").html("Country / Area List");
    const colLeft = $("<div></div>").addClass("col");
    colLeft.append(table_title);
    const colRight = $("<div></div>").addClass("col");
    colRight.append(display_dropdown);
    const row = $("<div></div>").addClass("row").append(colLeft).append(colRight);
    const table_head = $("<div></div>").addClass("container").append(row);

    // table area
    const table_area = $("#table-area");
    table_area.empty();
    table_area.append($("<div></div>").append(table_head).append(table));

    mouseEvent();
}

// ----------------------------------------------------------------------------- //

// ----------------- //
/* other functions */
// ----------------- //

// placeholder of regenerate country table (use when select 20 or all countries)
function generatePlaceholder() {
    const table_area = $("#table-area");
    table_area.empty();
    let paragraph = $("<div></div>").addClass("placeholder-glow");
    for(let i = 0; i < 6; i ++) {
        const max = 12;
        const min = 5;
        const random = Math.floor(Math.random() * (max - min + 1)) + min;
        const p = $("<p></p>").addClass("placeholder col-" + random);
        paragraph.append(p);
    }
    table_area.append(paragraph);
}

// select a specific cell of the table and change its colour once it is selected
function mouseEvent() {
    let currentCell = null;

    $('td').hover(
        function() {
            if (currentCell !== this) {
                $(this).css('background-color', '#f08080');
            }
        },
        function() {
            if (currentCell !== this) {
                $(this).css('background-color', '');
            }
        }
    ).click(function() {
        if (currentCell !== null) {
            $(currentCell).css('background-color', '');
        }
        currentCell = this;
        $(this).css('background-color', '#ea4848');
    });

    $(document).click(function(event) {
        if (!$(event.target).closest('table').length) {
            if (currentCell !== null) {
                $(currentCell).css('background-color', '');
                currentCell = null;
            }
        }
    });
}

// clean merged data before generate table
function cleanData(table_data) {
    // replace text
    for(let i in table_data) {
        for(let j = 0; j < 7; j++) {
            if(table_data[i][j] === null) {
                table_data[i][j] = "NO_DATA";
            }
        }
    }
    return table_data;
}

// ----------------------------------------------------------------------------- //

// ----------------- //
/* jQuery Ajax requests */
// ----------------- //

function getCapital() {
    return $.ajax({
        url: "country-objects/country-by-capital-city.json",
        method: "GET"
    });
}

function getContinent() {
    return $.ajax({
        url: "country-objects/country-by-continent.json",
        method: "GET"
    });
}

function getCoastline() {
    return $.ajax({
        url: "country-objects/country-by-costline.json",
        method: "GET"
    });
}

function getCurrency() {
    return $.ajax({
        url: "country-objects/country-by-currency-name.json",
        method: "GET"
    });
}

function getDomain() {
    return $.ajax({
        url: "country-objects/country-by-domain-tld.json",
        method: "GET"
    });
}

function getFlag() {
    return $.ajax({
        url: "country-objects/country-by-flag.json",
        method: "GET"
    });
}