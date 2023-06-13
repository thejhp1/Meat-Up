const express = require("express");
const router = express.Router();

const { Group, Membership, GroupImage } = require('../../db/models')

router.get('/', async (req, res, next) => {
    const groups = await Group.findAll({
        include: [{
            model: Membership
        },
        {
            model: GroupImage
        }]
    })
    let list = [];

    groups.forEach(group => {
        list.push(group.toJSON())
    })
    list.forEach(group => {
        let count = 0
        group.Memberships.forEach(member => {
            count++
            group.numMembers = count
        })
        group.GroupImages.forEach(image => {
            if (image.preview === true) {
                group.previewImage = image.url
            }
        })
        if (!group.previewImage) {
            group.previewImage = 'no preview image'
        }
        delete group.Memberships
        delete group.GroupImages
    })
    res.json({
        Groups: list
    })
})

module.exports = router;
