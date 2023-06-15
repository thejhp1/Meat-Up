const express = require("express");

const {
  Event,
  Attendance,
  Group,
  EventImage,
  Venue,
  Membership,
  User
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const e = require("express");

const router = express.Router();

const validateImageAdd = [
  check("url").exists({ checkFalsy: true }).withMessage("Url is required"),
  check("preview").isBoolean().withMessage("Preview must be a boolean"),
  handleValidationErrors,
];

const validateEventSignup = [
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["In person", "Online"])
    .withMessage("Type must be Online or In person"),
  check("capacity")
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage("Capacity must be an integer"),
  check("price")
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage("Price is invalid"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("startDate")
    .exists({ checkFalsy: true })
    .custom((val) => {
      const todayDate = new Date();
      const startDate = new Date(val);
      if (startDate < todayDate) {
        throw new Error("Start date must be in the future");
      }
      return true;
    }),
  check("endDate")
    .exists({ checkFalsy: true })
    .custom((val, { req }) => {
      const endDate = new Date(val);
      const startDate = new Date(req.body.startDate);
      if (endDate < startDate) {
        throw new Error("End date is less than start date");
      }
      return true;
    }),
  handleValidationErrors,
];

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
      },
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
      item.numAttending = count;
    });
    delete item.Attendances;
  });

  res.json(list[0]);
});

router.post("/:eventId/images", validateImageAdd, async (req, res, next) => {
  const { user } = req;
  if (user) {
    const event = await Event.findByPk(req.params.eventId)
    if (!event) {
      res.status(404);
      res.json({
        message: "Event couldn't be found",
      });
    }
    const membership = await Membership.findByPk(user.id)
    const userCheck = await Attendance.findByPk(user.id)
    if (userCheck.toJSON().status == 'attending' && userCheck.toJSON().eventId === Number(req.params.eventId) || (membership.toJSON().status == 'co-host' && (membership.toJSON().groupId === event.toJSON().groupId))){
      let { url, preview } = req.body;

      const event = await Event.findByPk(req.params.eventId);

      if (event) {
        const image = await EventImage.create({
          eventId: Number(req.params.eventId),
          url,
          preview,
        });

        const eventImage = {
          id: image.id,
          url: image.url,
          preview: image.preview,
        };

        res.json(eventImage);
      } else {
        res.status(404);
        res.json({
          message: "Event couldn't be found",
        });
      }
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

router.put("/:eventId", validateEventSignup, async (req, res, next) => {
  const { user } = req;
  if (user) {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
      res.status(404);
      res.json({
        message: "Event couldn't be found",
      });
    }
    const group = await Group.findByPk(event.toJSON().groupId)
    if (!group) {
      res.status(404);
      res.json({
        message: "Group couldn't be found",
      });
    }

    const userCheck = await Membership.findByPk(user.id)

    if (group.toJSON().organizerId === user.id || (userCheck.toJSON().status == 'co-host' && userCheck.toJSON().groupId === event.toJSON().groupId)){
      const {
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
      } = req.body;

      const venue = await Venue.findByPk(venueId);
      if (venue !== null){
        if (!venue) {
          res.status(404);
          return res.json({
            message: "Venue couldn't be found",
          });
        }
      }

      const event = await Event.findByPk(req.params.eventId);
      if (!event) {
        res.status(404);
        return res.json({
          message: "Event couldn't be found",
        });
      }

      if (venueId || venueId == null) {
        event.venueId = venueId
      }
      if (name) {
        event.name = name
      }
      if (type) {
        event.type = type
      }
      if (capacity) {
        event.capacity = capacity
      }
      if (price) {
        event.price = price
      }
      if (description) {
        event.description = description
      }
      if (startDate) {
        event.startDate = startDate
      }
      if (endDate) {
        event.endDate = endDate
      }

      await event.save()

      const updatedEvent = {
        id: event.id,
        groupId: event.groupId,
        venueId: event.venueId,
        name: event.name,
        type: event.type,
        capacity: event.capacity,
        price: event.price,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate
      };

      res.json(updatedEvent)

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

router.delete("/:eventId", async (req, res, next) => {
  const { user } = req;
  if (user) {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
      res.status(404);
      res.json({
        message: "Event couldn't be found",
      });
    }
    const group = await Group.findByPk(event.toJSON().groupId)
    if (!group) {
      res.status(404);
      res.json({
        message: "Group couldn't be found",
      });
    }
    const userCheck = await Membership.findByPk(user.id)

    if (group.toJSON().organizerId === user.id || (userCheck.toJSON().status == 'co-host' && userCheck.toJSON().groupId === event.toJSON().groupId)){
      const event = await Event.findByPk(req.params.eventId);
      if (!event) {
          res.status(404);
          return res.json({
            message: "Event couldn't be found",
          });
      }
      await event.destroy();
      res.json({
          message: "Successfully deleted",
      });
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

router.get("/:eventId/attendees", async (req, res, next) => {
  const { user } = req;
  const { Op } = require('sequelize')
  const event = await Event.findByPk(req.params.eventId)
  if (!event) {
    res.status(404);
    return res.json({
      message: "Event couldn't be found",
    });
  }
  const group = await Group.findByPk(user.id)
  if (!group) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found",
    });
  }
  if (group.toJSON().organizerId === user.id && event.toJSON().groupId === group.id) {
    const event = await Event.findByPk(req.params.eventId, {
      include: [{
        model: Attendance,
        attributes: ['status'],
        include: {
          model: User
        }
      }]
    })
    const list = [], result = []
    event.toJSON().Attendances.forEach(attendee => {
      list.push(attendee)
    })

    list.forEach(attendee => {
      result.push({
        id: attendee.User.id,
        firstName: attendee.User.firstName,
        lastName: attendee.User.lastName,
        Attendance: {
          status: attendee.status
        }
      })

    })

    res.json({
      Attendees: result
    })
  } else {
    const event = await Event.findByPk(req.params.eventId, {
      include: [{
        model: Attendance,
        attributes: ['status'],
        where: {
          status: {
            [Op.notLike]: 'pending'
          }
        },
        include: {
          model: User
        }
      }]
    })
    if (!event) {
      res.status(404);
      return res.json({
        message: "Event couldn't be found",
      });
    }
    const list = [], result = []
    event.toJSON().Attendances.forEach(attendee => {
      list.push(attendee)
    })

    list.forEach(attendee => {
      result.push({
        id: attendee.User.id,
        firstName: attendee.User.firstName,
        lastName: attendee.User.lastName,
        Attendance: {
          status: attendee.status
        }
      })

    })

    res.json({
      Attendees: result
    })
  }
});

router.post("/:eventId/attendance", async (req, res, next) => {
  const { user } = req;
  if (user) {
    const group = await Group.findByPk(user.id, {
      include: {
        model: Membership
      }
    })
    const event = await Event.findByPk(req.params.eventId)
    if (!event) {
      res.status(404);
      return res.json({
        message: "Event couldn't be found",
      });
    }

    if (event.toJSON().groupId === group.id){
      const event = await Event.findByPk(req.params.eventId, {
        include: [{
          model: Attendance,
          attributes: ['status'],
          include: {
            model: User
          }
        }]
      })

      const list = [], result = []
      event.toJSON().Attendances.forEach(attendee => {
        list.push(attendee)
      })

      list.forEach(attendee => {
        result.push({
          id: attendee.User.id,
          firstName: attendee.User.firstName,
          lastName: attendee.User.lastName,
          status: attendee.status
        })

      })

      for (let ele of result) {
        console.log(ele.id)
        if (ele.id === user.id && ele.status == 'pending'){
          res.status(404)
          return res.json({
            message: "Attendance has already been requested"
          })
        } else if (ele.id === user.id && (ele.status == 'attending' || ele.status == 'waitlist')) {
          res.status(404)
          return res.json({
            message: "User is already an attendee of the event"
          })
        }
      }

      const attendee = await Attendance.create({
        eventId: req.params.eventId,
        userId: user.id,
        status: "pending",
      })

      return res.json({
        userId: user.id,
        status: 'pending'
      })

    } else {
      res.status(403);
      return res.json({
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

router.put("/:eventId/attendance", async (req, res, next) => {
  const { user } = req;
  if (user) {
    const group = await Group.findByPk(user.id)
    const event = await Event.findByPk(req.params.eventId)
    if (!event) {
      res.status(404);
      return res.json({
        message: "Event couldn't be found",
      });
    }
    const member = await Membership.findByPk(user.id)

    if (group.toJSON().id === event.toJSON().groupId && user.id === group.toJSON().organizerId
    || member.toJSON().groupId === event.toJSON().groupId && member.toJSON().status == 'co-host'){
      const { userId, status } = req.body
      if (status == 'pending') {
        res.status(400);
        return res.json({
          message: "Cannot change an attendance status to pending",
        });
      }
      const event = await Event.findByPk(req.params.eventId, {
        include: [{
          model: Attendance,
          attributes: ['status'],
          include: {
            model: User
          }
        }]
      })

      const list = [], attendees = [], final = []
      event.toJSON().Attendances.forEach(attendee => {
        list.push(attendee)
      })

      list.forEach(attendee => {
        attendees.push({
          id: attendee.User.id,
          firstName: attendee.User.firstName,
          lastName: attendee.User.lastName,
          status: attendee.status
        })
      })

      for (let ele of attendees) {
        if (ele.id === userId && ele.status == 'pending'){
          const attendance = await Attendance.findByPk(userId, {
            attributes: {
              exclude: ['updatedAt','createdAt']
            }
          })
          attendance.status = status
          final.push(attendance)
          await attendance.save()
        }
      }

      if (final.length <= 0) {
        res.status(404);
        return res.json({
          message: "Attendance between the user and the event does not exist",
        });
      } else {
        return res.json(final[0])
      }
    } else {
      res.status(403);
      return res.json({
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

router.delete("/:eventId/attendance", async (req, res, next) => {
  const { user } = req
  if (user) {
    const { userId } = req.body
    const group = await Group.findByPk(user.id)
    const event = await Event.findByPk(req.params.eventId)
    if (!event) {
      res.status(404);
      return res.json({
        message: "Event couldn't be found",
      });
    }
    const member = await Membership.findByPk(user.id)
    if (group.toJSON().id === event.toJSON().groupId && user.id === group.toJSON().organizerId
    || member.toJSON().groupId === event.toJSON().groupId && userId === user.id){
      const attendee = await Attendance.findAll({
        where: {
          eventId: req.params.eventId
        }
      })
      let count = 0
      attendee.forEach(async attendee => {
        if (userId === attendee.userId || attendee.userId === user.id) {
          count++
          await attendee.destroy()
        }
      })
      if (count <= 0) {
        res.status(404)
        res.json({
          message: "Attendance does not exist for this User"
        })
      } else {
        res.json({
          message: "Successfully deleted attendance from event"
        })
      }

    } else {
      res.status(403);
      return res.json({
        message: "Only the User or organizer may delete an Attendance",
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
