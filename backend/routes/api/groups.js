const express = require("express");
const router = express.Router();

const { Group, User } = require('../../db/models')

router.get('/', async (req, res, next) => {
    const groups = await Group.findAll({
        include: {
            model: User
        }
    })
    res.json({
        Groups:groups
    })
})

module.exports = router;
