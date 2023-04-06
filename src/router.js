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
    res.send({
        status: response.SUCCESS.status,
        msg: response.SUCCESS.msg,
        data: data
    });
});

/**
 * GET specified colour
 * **/
router.get("/colours/:id", (req, res) => {
    if(!utils.isValidId(req.params.id)) { // validate id is integer
        res.send({
            status: response.INVALID_ID.status,
            msg: response.INVALID_ID.msg
        });
        return;
    }
    const id = parseInt(req.params.id);
    const colour = data.find((colour) => colour.colorId === id);
    if(colour) {
        res.send({
            status: response.SUCCESS.status,
            msg: response.SUCCESS.msg,
            data: colour
        });
    } else {
        res.send({
            status: response.ID_NOT_EXIST.status,
            msg: response.ID_NOT_EXIST.msg
        });
    }
});

/**
 * Add new colour
 * **/
router.post("/colours", (req, res) => {
    if(!utils.isValidJson(req.body.rgb.trim()) || !utils.isValidJson(req.body.hsl.trim())) { // validate rgb and hsl is json format
        res.send({
            status: response.INVALID_COLOUR.status,
            msg: response.INVALID_COLOUR.msg
        });
        return;
    }
    const newColour = {
        colorId: 0,
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
                res.send({
                    status: response.SUCCESS.status,
                    msg: response.SUCCESS.msg,
                    data: {
                        newColourId : newColour.colorId,
                        uri: '/src/colours/' + newColour.colorId // I don't really understand why return uri
                    }
                });
            } else {
                res.send({
                    status: response.INVALID_COLOUR.status,
                    msg: response.INVALID_COLOUR.msg
                });
            }
        } else {
            res.send({
                status: response.NAME_EXIST.status,
                msg: response.NAME_EXIST.msg
            });
        }
    } else {
        res.send({
            status: response.NAME_MISSING.status,
            msg: response.NAME_MISSING.msg
        });
    }
});

/**
 * Edit colour
 * **/
router.put("/colours/:id", (req, res) => {
    if(!utils.isValidId(req.params.id)) { // validate id is integer
        res.send({
            status: response.INVALID_ID.status,
            msg: response.INVALID_ID.msg
        });
        return;
    }
    if(!utils.isValidJson(req.body.rgb.trim()) || !utils.isValidJson(req.body.hsl.trim())) { // validate rgb and hsl is json format
        res.send({
            status: response.INVALID_COLOUR.status,
            msg: response.INVALID_COLOUR.msg
        });
        return;
    }
    const colour = {
        colorId: req.params.id ? parseInt(req.params.id) : 0,
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
                    res.send({
                        status: response.SUCCESS.status,
                        msg: response.SUCCESS.msg
                    });
                } else {
                    data.push(colour);
                    const newData = JSON.stringify(data);
                    fs.writeFileSync(file_path, newData);
                    res.send({
                        status: response.SUCCESS.status,
                        msg: response.SUCCESS.msg,
                        data: {
                            uri: '/src/colours/' + colour.colorId // I don't really understand why return uri
                        }
                    });
                }
            } else {
                res.send({
                    status: response.INVALID_COLOUR.status,
                    msg: response.INVALID_COLOUR.msg
                });
            }
        } else {
            res.send({
                status: response.NAME_EXIST.status,
                msg: response.NAME_EXIST.msg
            });
        }
    } else {
        res.send({
            status: response.NAME_MISSING.status,
            msg: response.NAME_MISSING.msg
        });
    }
});

/**
 * Delete colour
 * **/
router.delete("/colours/:id", (req, res) => {
    if(!utils.isValidId(req.params.id)) { // validate id is integer
        res.send({
            status: response.INVALID_ID.status,
            msg: response.INVALID_ID.msg
        });
        return;
    }
    const id = parseInt(req.params.id);
    const index = data.findIndex((colour) => colour.colorId === id);
    if (index !== -1) {
        data.splice(index, 1);
        const newData = JSON.stringify(data);
        fs.writeFileSync(file_path, newData);
        res.send({
            status: response.SUCCESS.status,
            msg: response.SUCCESS.msg
        });
    } else {
        res.send({
            status: response.ID_NOT_EXIST.status,
            msg: response.ID_NOT_EXIST.msg
        });
    }
});

/**
 * Edit colour without id
 * **/
router.put("/colours", (req, res) => {
    res.send({
        status: response.ID_MISSING.status,
        msg: response.ID_MISSING.msg
    });
});

/**
 * delete colour without id
 * **/
router.delete("/colours", (req, res) => {
    res.send({
        status: response.ID_MISSING.status,
        msg: response.ID_MISSING.msg
    });
});

module.exports = router;