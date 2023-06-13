const express = require("express");

const {
  Group,
  Membership,
  GroupImage,
  Venue,
  User,
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
  const { address, city, state, lat, lng } = req.body;
  const venue = await Venue.findByPk(req.params.venueId, {});

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
});

module.exports = router;
