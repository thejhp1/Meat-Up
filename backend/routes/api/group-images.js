const express = require("express");

const {
  Group,
  GroupImage,
  Membership
} = require("../../db/models");
const e = require("express");

const router = express.Router();

router.delete("/:imageId", async (req, res, next) => {
  const { user } = req
  if (user) {
    const groups = await Group.findAll({
      include: [{
        model: GroupImage,
      },
      {
        model: Membership,
        include: {
          model: Group,
          include: {
            model: GroupImage
          }
        }
      }]
    })
    if (!groups) {
      res.status(404);
      return res.json({
        message: "Group Image cannot be found",
      });
    }
    const list = [], list1 = []
    groups.forEach(group => {
      list.push(group.toJSON())
    })

    list.forEach(group => {
      group.Memberships.forEach(member => {
        if (member.userId === user.id && member.status == 'co-host') {
          member.Group.GroupImages.forEach(image => {
            list1.push(image)
          })
        }
      })
    })

    list.forEach(group => {
      if (group.organizerId === user.id ) {
        group.GroupImages.forEach(image => {
          list1.push(image)
        })
      }
    })
    let count = 0
    list1.forEach(async image => {
      if (image.id === Number(req.params.imageId)) {
        count++
        const imageDestroy = await GroupImage.findByPk(image.id)
        await imageDestroy.destroy()
        return res.json({
          message: "Successfully deleted."
        })
      }
    })

    if (count <= 0) {
      res.status(404)
      return res.json({
        message: "Group Image cannot be found."
      })
    }
  } else {
    res.status(401);
    return res.json({
      message: "Authentication required",
    });
  }
})


module.exports = router;
