const express = require("express");

const { Group, Event, EventImage, Membership, User, Attendance } = require("../../db/models");

const router = express.Router();

router.delete("/:imageId", async (req, res, next) => {
  const { user } = req;
  if (user) {

    const groups = await Group.findAll({
      include: [{
        model: Event,
        include: {
          model: EventImage
        }
      }, {
        model: Membership,
        include: {
          model: User,
          include: {
            model: Attendance,
            include: {
              model: Event,
              include: {
                model: EventImage
              }
            }
          }
        }
      }]
    })
    if (!groups) {
      res.status(404);
      return res.json({
        message: "Event Image cannot be found",
      });
    }

    const list = [], list1 = []
    groups.forEach(group => {
      list.push(group.toJSON())
    })
    list.forEach(group => {
      if (group.organizerId === user.id ) {
        group.Events.forEach(event => {
          event.EventImages.forEach(image => {
            list1.push(image)

          })
        })
      }
    })

    list.forEach(group => {
      group.Memberships.forEach(member => {
        if (member.userId === user.id && member.status == 'co-host') {
          member.User.Attendances.forEach(attendee => {
            attendee.Event.EventImages.forEach(image => {
              list1.push(image)
            })
          })
        }
      })
    })

    let count = 0
    list1.forEach(async image => {
      if (image.id === Number(req.params.imageId)) {
        count++
        const imageDestroy = await EventImage.findByPk(image.id)
        await imageDestroy.destroy()
        return res.json({
          message: "Successfully deleted."
        })
      }
    })

    if (count <= 0) {
      res.status(404)
      return res.json({
        message: "Event Image cannot be found."
      })
    }
  } else {
    res.status(401);
    return res.json({
      message: "Authentication required",
    });
  }
});

module.exports = router;
