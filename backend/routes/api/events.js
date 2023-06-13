const express = require("express");

const {
  Event,
  Attendance,
  Group,
  EventImage,
  Venue,
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const e = require("express");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const events = await Event.findAll({
    include: [
      {
        model: Attendance,
      },
      {
        model: EventImage,
      },
      {
        model: Group,
        attributes: {
          exclude: [
            "organizerId",
            "about",
            "type",
            "private",
            "createdAt",
            "updatedAt",
          ],
        },
      },
      {
        model: Venue,
        attributes: {
          exclude: [
            "groupId",
            "address",
            "lat",
            "lng",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    ],
    attributes: {
      exclude: ["description", "capacity", "price", "createdAt", "updatedAt"],
    },
  });

  let list = [];
  events.forEach((event) => {
    list.push(event.toJSON());
  });

  list.forEach((event) => {
    let count = 0;
    event.Attendances.forEach((member) => {
      count++;
      console.log(count);
      event.numAttending = count;
    });
    event.EventImages.forEach((image) => {
      if (image.preview === true) {
        event.previewImage = image.url;
      }
    });
    delete event.EventImages;
    delete event.Attendances;
  });

  res.json({
    Events: list,
  });
});

router.get("/:eventId", async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    attributes: {
      exclude: ["updatedAt", "createdAt"],
    },
    include: [
      {
        model: Group,
        attributes: ["id", "name", "private", "city", "state"],
      },
      {
        model: Venue,
        attributes: {
          exclude: ["groupId", "updatedAt", "createdAt"],
        },
      },
      {
        model: EventImage,
        as: "EventImages",
        attributes: {
          exclude: ["eventId", "updatedAt", "createdAt"],
        },
      },
      {
        model: Attendance,
      }
    ],
  });

  if (!event) {
    res.status(404);
    return res.json({
      message: "Event couldn't be found",
    });
  }

  let list = [];
  list.push(event.toJSON());

  list.forEach((item) => {
    let count = 0;
    item.Attendances.forEach((member) => {
      count++;
      item.numAttending= count;
    });
    delete item.Attendances;
  });

  res.json(list[0]);
});

module.exports = router;
