const express = require("express");
const router = express.Router();

const { Group, Membership, GroupImage, Venue, User } = require('../../db/models')

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

router.get('/:groupId', async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId, {
        include: [{
            model: Membership
        },
        {
            model: GroupImage,
            attributes: {
                exclude: ['groupId', 'updatedAt', 'createdAt']
            }
        },
        {
            model: User,
            attributes: ['id', 'firstName', 'lastName'],
            as: 'Organizer',
        },
        {
            model: Venue,
            attributes: {
                exclude: ['updatedAt', 'createdAt']
            }
        }
        ]
    })

    let list = []
    list.push(group.toJSON())

    list.forEach(item => {
        let count = 0
        item.Memberships.forEach(member => {
            count++
            item.numMembers = count
        })
        delete item.Memberships
    })

    res.json(list[0])
})

module.exports = router;
