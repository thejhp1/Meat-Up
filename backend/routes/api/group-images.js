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
  const { Op } = require('sequelize')
  if (user) {
    const membership = await Membership.findByPk(user.id)
    if (!membership) {
      const groups = await Group.findAll({
        where: {
          organizerId: user.id
        },
        include: [{
          model: GroupImage
        }, {
          model: Membership
        }]
      })
      if (!groups) {
        res.status(404);
        return res.json({
          message: "Group couldn't be found",
        });
      }
      const list = []
      groups.forEach(group => {
        list.push(group.toJSON())
      })

      let flag = false, count = 0
      list.forEach(group => {
        if (group.organizerId === user.id || group.Memberships.forEach(group => {
          if (group.userId === user.id && group.status == 'co-host'){
            flag = true
          }
        })){
          flag = true
        }
      })

      if (flag === true){
        list.forEach(group => {
          group.GroupImages.forEach(async image => {
            if (image.id === Number(req.params.imageId)){
              count++
              const image = await GroupImage.findByPk(req.params.imageId)
              await image.destroy()
              return res.json({
                message: "Successfully deleted."
              })
            }
          })
        })
        if (count <= 0) {
            res.status(404);
            return res.json({
              message: "Group Image cannot be found.",
            })
        }
      } else {
        res.status(403);
        return res.json({
          message: "Forbidden",
        });
      }
    } else {
      const groups = await Group.findAll({
        where: {
          [Op.or]: [{organizerId: user.id}, {id: membership.toJSON().groupId}]
        },
        include: [{
          model: GroupImage
        }, {
          model: Membership
        }]
      })
      if (!groups) {
        res.status(404);
        return res.json({
          message: "Group couldn't be found",
        });
      }
      const list = []
      groups.forEach(group => {
        list.push(group.toJSON())
      })

      let flag = false, count = 0
      list.forEach(group => {
        if (group.organizerId === user.id || group.Memberships.forEach(group => {
          if (group.userId === user.id && group.status == 'co-host'){
            flag = true
          }
        })){
          flag = true
        }
      })

      if (flag === true){
        list.forEach(group => {
          group.GroupImages.forEach(async image => {
            if (image.id === Number(req.params.imageId)){
              count++
              const image = await GroupImage.findByPk(req.params.imageId)
              await image.destroy()
              return res.json({
                message: "Successfully deleted."
              })
            }
          })
        })
        if (count <= 0) {
            res.status(404);
            return res.json({
              message: "Group Image cannot be found.",
            })
        }
      } else {
        res.status(403);
        return res.json({
          message: "Forbidden",
        });
      }
    }
  } else {
    res.status(401);
    return res.json({
      message: "Authentication required",
    });
  }
})


module.exports = router;
