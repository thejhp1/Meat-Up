const express = require("express");

const {
  Group,
  Event,
  EventImage,
  Membership,
} = require("../../db/models");

const router = express.Router();

router.delete("/:imageId", async (req, res, next) => {
  const { user } = req
  if (user) {
    const member = await Membership.findByPk(user.id)
    const group = await Group.findByPk(member.toJSON().groupId, {
        include: {
            model: Event,
            include: {
                model: EventImage
            }
        }
    })

    if (user.id === group.toJSON().organizerId || (member.toJSON().status == 'co-host' && member.toJSON().groupId === group.id)){
      group.toJSON().Events.forEach(event => {
        if (event.EventImages.length <= 0){
          res.status(404);
          return res.json({
            message: "Event Image cannot be found",
          });
        }
        event.EventImages.forEach(async image => {
            if (image.id === Number(req.params.imageId)){
                const image = await EventImage.findByPk(req.params.imageId)
                await image.destroy()
                return res.json({
                  message: "Successfully deleted."
                })
            } else {
                res.status(404);
                return res.json({
                  message: "Event Image cannot be found.",
                });
            }
        })
      })
    } else {
      res.status(403);
      return res.json({
        message: "Forbidden",
      });
    }
  } else {
    res.status(401);
    return res.json({
      message: "Authentication required",
    });
  }
})


module.exports = router;
