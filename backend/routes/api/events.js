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

const router = express.Router();

const validateImageAdd = [
  check("url").exists({ checkFalsy: true }).withMessage("Url is required"),
  check("preview").isBoolean().withMessage("Preview must be a boolean"),
  handleValidationErrors,
];

const validateEventSignup = [
  // check("venueId")
  // .exists({ checkFalsy: true })
  // .custom(async (val, { req }) => {
  //   const venue = await Venue.findByPk(req.body.venueId, {
  //     include: Group
  //   });
  //   const { user } = req
  //   if (!venue || venue.toJSON().Group.organizerId !== (user.id)) {
  //     throw new Error("Venue does not exist");
  //   }
  //   return true;
  // }),
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

const validateQueryFilter = [
  check("page")
    .custom(val => {
      if (val <= 0){
        throw new Error("Page must be greater than or equal to 1");
      }
      return true
    }),
  check("size")
    .custom(val => {
      if (val <= 0){
        throw new Error("size must be greater than or equal to 1");
      }
      return true
    }),
  check("name")
    .isString()
    .withMessage("Name must be a string"),
  check("type")
    .custom(val => {
      if (val && val !== 'Online' && val !== 'In person'){
        throw new Error("Type must be 'Online' or 'In person'");
      }
      return true
    }),
  check("startDate")
    .custom((val) => {
      const todayDate = new Date();
      const startDate = new Date(val);
      if (startDate < todayDate) {
        throw new Error("Start date must be in the future");
      }
      return true;
    }),
  handleValidationErrors,
];

router.get("/", async (req, res, next) => {
  const { Op } = require('sequelize')
  let { page, size, name, type, startDate } = req.query;
  page = parseInt(page);
  size = parseInt(size);

  if (!(Number.isNaN(page)) && page > 10 || page <= 0) page = 1;
  if (!(Number.isNaN(size)) && size > 20 || size <= 0) size = 20;
  if (isNaN(page)){
    page = 1
  }
  if (isNaN(size)){
    size = 20
  }
  let errors = {}
  const where = {};
  if (name) {
    if (typeof name !== 'string'){
      errors.name = "Name must be a string"
    } else {
      where.name = {[Op.substring]: name}
    }
  }

  if (type) {
    if (typeof name !== 'string' || type !== 'Online' && type !== "In person"){
      errors.type = "Type must be 'Online' or 'In person'"
    } else {
      where.type = type
    }
  }

  if (startDate) {
    const todayDate = new Date();
    const theStartDate = new Date(startDate);
    if (theStartDate < todayDate) {
      errors.startDate = "Start date must be a valid datetime";
    } else {
      where.startDate = new Date(startDate)
    }
  }

  if (Object.keys(errors).length > 0) {
      res.status(400)
      return res.json({
        message: "Bad request",
        errors: errors
      })
  }

  const events = await Event.findAll({
    where,
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
    limit: size,
    offset: (page - 1) * size,
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

  return res.json({
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
    const event = await Event.findByPk(req.params.eventId, {
      include: [{
        model: Attendance
      },{
        model: Group,
        include: [{
          model: User,
          as: "Organizer",
        }, {
          model: Membership
        }]
      }],
    })
    if (!event) {
      res.status(404);
      return res.json({
        message: "Event couldn't be found",
      });
    }

    let flag1 = false, flag2 = false
    for (let ele of event.toJSON().Attendances){
      if (ele.userId === user.id && ele.status == 'attending') {
        flag1 = true
      }
    }

    for (let ele of event.toJSON().Group.Memberships){
      if (ele.userId === user.id && ele.status == 'co-host') {
        flag2 = true
      }
    }

    if (event.toJSON().Group.Organizer.id === user.id || flag1 === true || flag2 === true){
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
        return res.json({
          message: "Event couldn't be found",
        });
      }
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

router.put("/:eventId", validateEventSignup, async (req, res, next) => {
  const { user } = req;
  if (user) {
    const { venueId } = req.body
    const venueCheck = await Event.findByPk(req.params.eventId)
    if (!venueCheck) {
      res.status(404);
      return res.json({
        message: "Venue couldn't be found",
      });
    }
    const venueCheck1 = await Group.findByPk(venueCheck.toJSON().groupId, {
      include: {
        model: Venue
      }
    })
    if (!venueCheck1) {
      res.status(404);
      return res.json({
        message: "Venue couldn't be found",
      });
    }

    let flag1 = false
    for (let venue of venueCheck1.toJSON().Venues){
      if (venue.id === venueId){
        flag1 = true
      }
    }

    if (!venueCheck || flag1 === false) {
      res.status(404);
      return res.json({
        message: "Venue couldn't be found",
      });
    }

    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
      res.status(404);
      return res.json({
        message: "Event couldn't be found",
      });
    }
    const group = await Group.findByPk(event.toJSON().groupId, {
      include: {
        model: Membership
      }
    })
    if (!group) {
      res.status(404);
      return res.json({
        message: "Group couldn't be found",
      });
    }
    let flag = false
    for (let member of group.toJSON().Memberships) {
      if (member.status == 'co-host' && member.userId == user.id) {
        flag = true
      }
    }

    if (group.toJSON().organizerId === user.id || flag === true){
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

router.delete("/:eventId", async (req, res, next) => {
  const { user } = req;
  if (user) {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
      res.status(404);
      return res.json({
        message: "Event couldn't be found",
      });
    }
    const group = await Group.findByPk(event.toJSON().groupId, {
      include: {
        model: Membership
      }
    })
    if (!group) {
      res.status(404);
      return res.json({
        message: "Group couldn't be found",
      });
    }
    let flag = false;
    for (let member of group.toJSON().Memberships) {
      if (member.status == "co-host" && member.userId == user.id) {
        flag = true;
      }
    }

    if (group.toJSON().organizerId === user.id || flag === true){
      const event = await Event.findByPk(req.params.eventId);
      if (!event) {
          res.status(404);
          return res.json({
            message: "Event couldn't be found",
          });
      }
      await event.destroy();
      return res.json({
          message: "Successfully deleted",
      });
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

router.get("/:eventId/attendees", async (req, res, next) => {
  const { user } = req;
  const event = await Event.findByPk(req.params.eventId, {
    include: [{
      model: Attendance,
      include: {
        model: User
      }
    }, {
      model: Group,
      include: {
        model: Membership
      }
    }]
  })
  if (!event) {
    res.status(404);
    return res.json({
      message: "Event couldn't be found",
    });
  }
  let flag = false
  for (let member of event.toJSON().Group.Memberships){
    if (member.userId === user.id && member.status == 'co-host'){
      flag = true
    }
  }

  if (event.toJSON().Group.organizerId === user.id || flag === true){
      const list = [], result = []
      event.toJSON().Attendances.forEach(attendee => {
        list.push(attendee)
      })
      list.forEach(attendee => {
        console.log(attendee)
        result.push({
          id: attendee.id,
          firstName: attendee.User.firstName,
          lastName: attendee.User.lastName,
          Attendance: {
            status: attendee.status
          }
        })

      })
      return res.json({
        Attendees: result
      })
  } else {

    const list = [], result = []
    event.toJSON().Attendances.forEach(attendee => {
      list.push(attendee)
    })
    list.forEach(attendee => {
      if (attendee.status !== 'pending') {
        result.push({
          id: attendee.id,
          firstName: attendee.User.firstName,
          lastName: attendee.User.lastName,
          Attendance: {
            status: attendee.status
          }
        })
      }
    })

    return res.json({
      Attendees: result
    })
  }
});

router.post("/:eventId/attendance", async (req, res, next) => {
  const { user } = req;
  if (user) {
    const event = await Event.findByPk(req.params.eventId, {
      include: {
        model: Group,
        include: {
          model: Membership
        }
      }
    })
    if (!event) {
      res.status(404);
      return res.json({
        message: "Event couldn't be found",
      });
    }
    let flag = false
    for (let member of event.toJSON().Group.Memberships){
      if (member.userId === user.id) {
        flag = true
      }
    }

    if (flag === true){
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
        if (ele.id === user.id && ele.status == 'pending'){
          res.status(400)
          return res.json({
            message: "Attendance has already been requested"
          })
        } else if (ele.id === user.id && (ele.status == 'attending' || ele.status == 'waitlist')) {
          res.status(400)
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
    return res.json({
      message: "Authentication required",
    });
  }

});

router.put("/:eventId/attendance", async (req, res, next) => {
  const { user } = req;
  if (user) {
    const event = await Event.findByPk(req.params.eventId, {
      include: [{
        model: Group,
        include: {
          model: Membership
        }
      }, {
        model: Attendance
      }]
    })
    if (!event) {
      res.status(404);
      return res.json({
        message: "Event couldn't be found",
      });
    }
    let flag = false
    for (let member of event.toJSON().Group.Memberships) {
      if (member.userId === user.id && member.status == "co-host") {
        flag = true
      }
    }
    if (event.toJSON().Group.organizerId === user.id || flag === true) {
      const { userId, status } = req.body
      if (status == 'pending') {
        res.status(400);
        return res.json({
          message: "Cannot change an attendance status to pending",
        });
      }
      let count = 0
      for (let attendee of event.toJSON().Attendances){
        if (userId === attendee.userId && status == 'attending'){
          count++
          const attendance = await Attendance.findByPk(attendee.id)
          attendance.status = status
          await attendance.save()
          return res.json({
            id: attendance.id,
            eventId: attendance.eventId,
            userId: userId,
            status: status
          })
        }
      }
      if (count <= 0) {
        res.status(404);
        return res.json({
        message: "Attendance between the user and the event does not exist",
        });
      }
      res.json(event)
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

router.delete("/:eventId/attendance", async (req, res, next) => {
  const { user } = req
  if (user) {
    const { userId } = req.body

    const event = await Event.findByPk(req.params.eventId, {
      include: [{
        model: Group
      }, {
        model: Attendance
      }]
    })
    if (!event) {
      res.status(404);
      return res.json({
        message: "Event couldn't be found",
      });
    }
    let flag = false
    for (let attendee of event.toJSON().Attendances){
      if (attendee.userId === user.id && attendee.eventId === event.toJSON().id){
        flag = true
      }
    }

    if (event.toJSON().Group.organizerId === user.id || flag === true){
      const { userId } = req.body;
      let count = 0
      for (let attendee of event.toJSON().Attendances){
        if ((userId === attendee.userId && event.toJSON().Group.organizerId === user.id) || (userId === attendee.userId && attendee.userId === user.id)) {
          count++
          const attendance = await Attendance.findByPk(attendee.id)
          await attendance.destroy()
        }
      }
      if (count <= 0) {
        res.status(404)
        return res.json({
          message: "Attendance does not exist for this User"
        })
      } else {
        return res.json({
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
    return res.json({
      message: "Authentication required",
    });
  }
});

module.exports = router;
