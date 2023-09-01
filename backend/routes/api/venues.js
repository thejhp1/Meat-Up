const express = require("express");

const {
  Venue,
  Group,
  Membership
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateVenueSignup = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage("Longitude is not valid"),
  handleValidationErrors,
];

router.put("/:venueId", validateVenueSignup, async (req, res, next) => {
  const { user } = req;
  if (user) {
    const venue = await Venue.findByPk(req.params.venueId, {
      include: [{
        model: Group,
        include: {
          model: Membership
        }
      }]
    })
    if (!venue) {
      res.status(404);
      return res.json({
        message: "Venue couldn't be found",
      });
    }

    let flag = false
    for (let member of venue.toJSON().Group.Memberships) {
      if (member.status == 'co-host' && member.userId == user.id) {
        flag = true
      }
    }

    if (venue.toJSON().Group.organizerId === user.id ||
    flag === true){
      const { address, city, state, lat, lng } = req.body;
      const venue = await Venue.findByPk(req.params.venueId, {
        attributes: {
          exclude: ['updatedAt', 'createdAt']
        }
      });

      if (!venue) {
        res.status(404);
        return res.json({
          message: "Venue couldn't be found",
        });
      }

      if (address) {
        venue.address = address
      }
      if (city) {
        venue.city = city
      }
      if (state) {
        venue.state = state
      }
      if (lat) {
        venue.lat = lat
      }
      if (lng) {
        venue.lng = lng
      }

      await venue.save()
      return res.json(venue);

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

});

router.delete("/:venueId", async (req, res, next) => {
  const venue = await Venue.findByPk(req.params.venueId, {
    include: {
      model: Group
    }
  })
  
  await venue.destroy()

  return res.json({
    id: venue.Group.id,
    message: "Successfully deleted venue from group"
  })
})
module.exports = router;
