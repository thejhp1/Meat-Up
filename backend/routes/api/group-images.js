const express = require("express");

const {
  Group,
  GroupImage,
  Event,
  EventImage,
  Membership,
  User
} = require("../../db/models");

const router = express.Router();

router.delete("/:imageId", async (req, res, next) => {
  const { user } = req
  if (user) {
    const group = await Group.findByPk(user.id, {
      include: {
        model: GroupImage
      }
    })
    if (!group) {
      res.status(404);
      res.json({
        message: "Group couldn't be found",
      });
    }
    if (user.id === group.toJSON().organizerId){
      let list = []

      group.toJSON().GroupImages.forEach(async image => {
        if (image.id === Number(req.params.imageId)){
          const image = await GroupImage.findByPk(req.params.imageId)
          await image.destroy()
          res.json({
            message: "Successfully deleted."
          })
        } else {
          res.status(404);
          res.json({
            message: "Image cannot be found.",
          });
        }
      })
    } else {
      res.status(403);
      res.json({
        message: "Forbidden",
      });
    }
  } else {
    res.status(401);
    res.json({
      message: "Authentication required",
    });
  }
})


module.exports = router;
