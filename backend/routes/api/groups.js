const express = require("express");

const { Group, Membership, GroupImage, Venue, User } = require('../../db/models')

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateGroupSignup = [
    check('name')
      .exists({checkFalsy: true})
      .isLength({ max: 60 })
      .withMessage("Name must be 60 characters or less"),
    check('about')
      .exists({checkFalsy: true})
      .isLength({ min: 50 })
      .withMessage("About must be 50 characters or more"),
    check("type")
      .exists({ checkFalsy: true })
      .isIn(['In person','Online'])
      .withMessage("Type must be 'Online' or 'In person'"),
    check("private")
      .isBoolean()
      .withMessage("Private must be a boolean"),
    check("city")
      .exists({ checkFalsy: true })
      .withMessage("City is required"),
    check("state")
      .exists({ checkFalsy: true })
      .withMessage("State is required"),
      handleValidationErrors,
];

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
    if (!group) {
        res.status(404)
        res.json({
            message: "Group couldn't be found"
        })
    }

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

router.post('/', validateGroupSignup, async (req, res, next) => {
    let { organizerId, name, about, type, private, city, state } = req.body
    if (!organizerId){
        organizerId = 1
    }
    const group = await Group.create({organizerId, name, about, type, private, city, state });
    const safeGroup = {
        id: group.id,
        organizerId: group.organizerId,
        name: group.name,
        about: group.about,
        type: group.type,
        private: group.private,
        city: group.city,
        state: group.state,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt
    };

    res.status(201)
    return res.json(safeGroup);
})

router.post('/:groupId/images', async (req, res, next) => {
    let { url, preview } = req.body
    let result = {}
    if (url) {
        result.url = url
    }
    if (preview && preview == true) {
        result.preview = preview
    } else {
        preview = false
        result.preview = preview
    }
    const group = await Group.findByPk(req.params.groupId)
    if (group) {
        let groupId = req.params.groupId
        await GroupImage.create({groupId, url, preview})

        result.id = group.id
        res.json(result)
    } else {
        res.status(404)
        res.json({
            message: "Group couldn't be found"
        })
    }
});

router.put('/:groupId', validateGroupSignup, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body
    const group = await Group.findByPk(req.params.groupId)

    if (!group) {
        res.status(404)
        res.json({
            message: "Group couldn't be found"
        })
    }

    if (name) {
        group.name = name
    }
    if (about) {
        group.about = about
    }
    if (type) {
        group.type = type
    }
    if (private && private == true) {
        group.private = private
    } else {
        private = false
        group.private = private
    }
    if (city) {
        group.city = city
    }
    if (state) {
        group.state = state
    }

    await group.save()

    res.json(group)
});



module.exports = router;
