const express = require("express");
const fs = require("fs");
const utils = require("./utils");

const router = express.Router();
const file_path = './data/256-colors.json';
const file = fs.readFileSync(file_path).toString();
const data = JSON.parse(file);

// custom response status
const response = {
    SUCCESS: {
        status: 200,
        msg: "Success"
    },
    INVALID_ID: {
        status: 201,
        msg: "Invalid colour ID"
    },
    ID_NOT_EXIST: {
        status: 202,
        msg: "Colour ID not exist"
    },
    INVALID_COLOUR: {
        status: 203,
        msg: "Contains invalid colour"
    },
    NAME_EXIST: {
        status: 204,
        msg: "Colour name already exists"
    },
    NAME_MISSING: {
        status: 205,
        msg: "Colour name is missing"
    },
    ID_MISSING: {
        status: 206,
        msg: "ID is missing"
    }
};

// api list start
/**
 * GET all colours
 * **/
router.get("/colours", (req, res) => {
    res.result(response.SUCCESS.status, response.SUCCESS.msg, data);
});

/**
 * GET specified colour
 * **/
router.get("/colours/:id", (req, res) => {
    if(!utils.isValidId(req.params.id)) { // validate id is integer
        res.result(response.INVALID_ID.status, response.INVALID_ID.msg, null);
        return;
    }
    const id = parseInt(req.params.id);
    const colour = data.find((colour) => colour.colorId === id);
    if(colour) {
        res.result(response.SUCCESS.status, response.SUCCESS.msg, colour);
    } else {
        res.result(response.ID_NOT_EXIST.status, response.ID_NOT_EXIST.msg, null);
    }
});

/**
 * Add new colour
 * **/
router.post("/colours", (req, res) => {
    if(!utils.isValidJson(req.body.rgb.trim()) || !utils.isValidJson(req.body.hsl.trim())) { // validate rgb and hsl is json format
        res.result(response.INVALID_COLOUR.status, response.INVALID_COLOUR.msg, null);
        return;
    }
    const newColour = {
        colorId: null,
        name: req.body.name ? req.body.name.trim() : '',
        hexString: req.body.hexString ? req.body.hexString.trim() : '',
        rgb: JSON.parse(req.body.rgb.trim()),
        hsl: JSON.parse(req.body.hsl.trim())
    };
    if(newColour.name && newColour.name.length > 0) {
        if(utils.isValidName(newColour, "ADD")) {
            if(utils.isValidColours(newColour)) {
                let maxId = 0;
                data.forEach(item => {
                    if (item.colorId > maxId) {
                        maxId = item.colorId;
                    }
                });
                newColour.colorId = maxId + 1;
                data.push(newColour);
                const newData = JSON.stringify(data);
                fs.writeFileSync(file_path, newData);
                const responseData = {
                    newColourId : newColour.colorId,
                    uri: '/api/colours/' + newColour.colorId // I don't really understand why required return uri
                };
                res.result(response.SUCCESS.status, response.SUCCESS.msg, responseData);
            } else {
                res.result(response.INVALID_COLOUR.status, response.INVALID_COLOUR.msg, null);
            }
        } else {
            res.result(response.NAME_EXIST.status, response.NAME_EXIST.msg, null);
        }
    } else {
        res.result(response.NAME_MISSING.status, response.NAME_MISSING.msg, null);
    }
});

/**
 * Edit colour
 * **/
router.put("/colours/:id", (req, res) => {
    if(!utils.isValidId(req.params.id)) { // validate id is integer
        res.result(response.INVALID_ID.status, response.INVALID_ID.msg, null);
        return;
    }
    if(!utils.isValidJson(req.body.rgb.trim()) || !utils.isValidJson(req.body.hsl.trim())) { // validate rgb and hsl is json format
        res.result(response.INVALID_COLOUR.status, response.INVALID_COLOUR.msg, null);
        return;
    }
    const colour = {
        colorId: parseInt(req.params.id),
        name: req.body.name ? req.body.name.trim() : '',
        hexString: req.body.hexString ? req.body.hexString.trim() : '',
        rgb: JSON.parse(req.body.rgb.trim()),
        hsl: JSON.parse(req.body.hsl.trim())
    };
    if(colour.name && colour.name.length > 0) {
        if(utils.isValidName(colour, "EDIT")) {
            if(utils.isValidColours(colour)) {
                let colourExist = false;
                for(let item of data) {
                    if (item.colorId === colour.colorId) {
                        item.name = colour.name;
                        item.hexString = colour.hexString;
                        item.rgb = colour.rgb;
                        item.hsl = colour.hsl;
                        colourExist = true;
                        break;
                    }
                }
                if(colourExist) {
                    const newData = JSON.stringify(data);
                    fs.writeFileSync(file_path, newData);
                    res.result(response.SUCCESS.status, response.SUCCESS.msg, null);
                } else {
                    data.push(colour);
                    const newData = JSON.stringify(data);
                    fs.writeFileSync(file_path, newData);
                    const responseData = {
                        uri: '/api/colours/' + colour.colorId // I don't really understand why required return uri
                    }
                    res.result(response.SUCCESS.status, response.SUCCESS.msg, responseData);
                }
            } else {
                res.result(response.INVALID_COLOUR.status, response.INVALID_COLOUR.msg, null);
            }
        } else {
            res.result(response.NAME_EXIST.status, response.NAME_EXIST.msg, null);
        }
    } else {
        res.result(response.NAME_MISSING.status, response.NAME_MISSING.msg, null);
    }
});

/**
 * Delete colour
 * **/
router.delete("/colours/:id", (req, res) => {
    if(!utils.isValidId(req.params.id)) { // validate id is integer
        res.result(response.INVALID_ID.status, response.INVALID_ID.msg, null);
        return;
    }
    const id = parseInt(req.params.id);
    const index = data.findIndex((colour) => colour.colorId === id);
    if (index !== -1) {
        data.splice(index, 1);
        const newData = JSON.stringify(data);
        fs.writeFileSync(file_path, newData);
        res.result(response.SUCCESS.status, response.SUCCESS.msg, null);
    } else {
        res.result(response.ID_NOT_EXIST.status, response.ID_NOT_EXIST.msg, null);
    }
});

/**
 * Edit colour without id
 * **/
router.put("/colours", (req, res) => {
    res.result(response.ID_MISSING.status, response.ID_MISSING.msg, null);
});

/**
 * delete colour without id
 * **/
router.delete("/colours", (req, res) => {
    res.result(response.ID_MISSING.status, response.ID_MISSING.msg, null);
});

module.exports = router;