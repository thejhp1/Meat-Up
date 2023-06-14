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
    const group = await Group.findByPk(user.id);
    if (!group){
      res.status(404);
      res.json({
        message: "Current User is not organizer of this group or a member with a status of 'co-host'",
      });
    }
    const userCheck = await Membership.findByPk(user.id)
    if (group.toJSON().organizerId === user.id || (userCheck.toJSON().status == 'co-host' && userCheck.toJSON().groupId === user.id)){
      const { address, city, state, lat, lng } = req.body;
      const venue = await Venue.findByPk(req.params.venueId, {
        attributes: {
          exclude: ['updatedAt', 'createdAt']
        }
      });

      if (!venue) {
        res.status(404);
        res.json({
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

      res.json(venue);

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

});

module.exports = router;
