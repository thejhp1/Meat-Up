const express = require("express");

const { Group, Event, EventImage, Membership } = require("../../db/models");

const router = express.Router();

router.delete("/:imageId", async (req, res, next) => {
  const { user } = req;
  if (user) {
      const group = await Group.findAll({
        where: {
          organizerId: user.id
        },
        include: [{
          model: Event,
          include: {
            model: EventImage
          }
        }, {
          model: Membership
        }]
      })

      const member = await Membership.findAll({
        where: {
          userId: user.id
        },
        include: {
          model: Group,
          include: {
            model: Event,
            include: {
              model: EventImage
            }
          }
        }
      })

    if (group.length > 0){
      if (group[0].toJSON().organizerId === user.id){

        for (let event of group[0].toJSON().Events){
          for (let image of event.EventImages) {
            if (image.id === Number(req.params.imageId)){
              const image = await EventImage.findByPk(req.params.imageId);
              await image.destroy();
              return res.json({
                message: "Successfully deleted.",
              });
            }
          }
        }
      }
    } else {
      if (member[0].toJSON().status == 'co-host'){
        for (let event of member[0].toJSON().Group.Events){
          for (let image of event.EventImages){
            if (image.id === Number(req.params.imageId)){
              const image = await EventImage.findByPk(req.params.imageId);
              await image.destroy();
              return res.json({
                message: "Successfully deleted.",
              });
            }
          }
        }
      }
    }

    res.status(404);
    return res.json({
      message: "Event Image couldn't be found",
    });
  } else {
    res.status(401);
    return res.json({
      message: "Authentication required",
    });
  }
});

module.exports = router;
