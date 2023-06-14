const express = require("express");

const {
  Group,
  Membership,
  GroupImage,
  Venue,
  User,
  Event,
  Attendance,
  EventImage,
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateGroupSignup = [
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    .withMessage("Name must be 60 characters or less"),
  check("about")
    .exists({ checkFalsy: true })
    .isLength({ min: 50 })
    .withMessage("About must be 50 characters or more"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["In person", "Online"])
    .withMessage("Type must be 'Online' or 'In person'"),
  check("private").isBoolean().withMessage("Private must be a boolean"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  handleValidationErrors,
];

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

const validateEventSignup = [
  check("venueId")
    .exists({ checkFalsy: true })
    .custom(async (val, { req }) => {
      const venue = await Venue.findByPk(req.body.venueId);
      if (!venue) {
        throw new Error("Venue couldn't be found");
      }
      return true;
    }),
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
  const groups = await Group.findAll({
    include: [
      {
        model: Membership,
      },
      {
        model: GroupImage,
      },
    ],
  });
  let list = [];

  groups.forEach((group) => {
    list.push(group.toJSON());
  });
  list.forEach((group) => {
    let count = 0;
    group.Memberships.forEach((member) => {
      count++;
      group.numMembers = count;
    });
    group.GroupImages.forEach((image) => {
      if (image.preview === true) {
        group.previewImage = image.url;
      }
    });
    if (!group.previewImage) {
      group.previewImage = "no preview image";
    }
    delete group.Memberships;
    delete group.GroupImages;
  });
  res.json({
    Groups: list,
  });
});

router.get("/current", async (req, res, next) => {
  const { user } = req;
  if (user) {
    const group = await Group.findByPk(user.id, {
      include: [
        {
          model: Membership,
        },
        {
          model: GroupImage,
        },
      ],
    });
    if (!group) {
      res.status(404);
      res.json({
        message: "No groups exist for this user",
      });
    }
    let list = [];
    list.push(group.toJSON());
    list.forEach((group) => {
      let count = 0;
      group.Memberships.forEach((member) => {
        count++;
        group.numMembers = count;
      });
      group.GroupImages.forEach((image) => {
        if (image.preview === true) {
          group.previewImage = image.url;
        }
      });
      if (!group.previewImage) {
        group.previewImage = "no preview image";
      }
      delete group.Memberships;
      delete group.GroupImages;
    });
    if (list) {
      res.json({
        Groups: list,
      });
    }
  } else {
    res.status(404);
    res.json({
      message: "No current user exists",
    });
  }
});

router.get("/:groupId", async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: Membership,
      },
      {
        model: GroupImage,
        attributes: {
          exclude: ["groupId", "updatedAt", "createdAt"],
        },
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
        as: "Organizer",
      },
      {
        model: Venue,
        attributes: {
          exclude: ["updatedAt", "createdAt"],
        },
      },
    ],
  });
  if (!group) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found",
    });
  }

  let list = [];
  list.push(group.toJSON());

  list.forEach((item) => {
    let count = 0;
    item.Memberships.forEach((member) => {
      count++;
      item.numMembers = count;
    });
    delete item.Memberships;
  });

  res.json(list[0]);
});

router.post("/", validateGroupSignup, async (req, res, next) => {
  let { organizerId, name, about, type, private, city, state } = req.body;
  if (!organizerId) {
    organizerId = 1;
  }
  const group = await Group.create({
    organizerId,
    name,
    about,
    type,
    private,
    city,
    state,
  });
  const safeGroup = {
    id: group.id,
    organizerId: group.organizerId,
    name: group.name,
    about: group.about,
    type: group.type,
    private: group.private,
    city: group.city,
    state: group.state,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
  };

  res.status(201);
  return res.json(safeGroup);
});

router.post("/:groupId/images", async (req, res, next) => {
  let { url, preview } = req.body;
  let result = {};
  if (url) {
    result.url = url;
  }
  if (preview && preview == true) {
    result.preview = preview;
  } else {
    preview = false;
    result.preview = preview;
  }
  const group = await Group.findByPk(req.params.groupId);
  if (group) {
    let groupId = req.params.groupId;
    await GroupImage.create({ groupId, url, preview });

    result.id = group.id;
    res.json(result);
  } else {
    res.status(404);
    res.json({
      message: "Group couldn't be found",
    });
  }
});

router.put("/:groupId", validateGroupSignup, async (req, res, next) => {
  let { name, about, type, private, city, state } = req.body;
  const group = await Group.findByPk(req.params.groupId);

  if (!group) {
    res.status(404);
    res.json({
      message: "Group couldn't be found",
    });
  }

  if (name) {
    group.name = name;
  }
  if (about) {
    group.about = about;
  }
  if (type) {
    group.type = type;
  }
  if (private && private == true) {
    group.private = private;
  } else {
    private = false;
    group.private = private;
  }
  if (city) {
    group.city = city;
  }
  if (state) {
    group.state = state;
  }

  await group.save();

  res.json(group);
});

router.delete("/:groupId", async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId);
  if (!group) {
    res.status(404);
    res.json({
      message: "Group couldn't be found",
    });
  }

  await group.destroy();
  res.json({
    message: "Successfully deleted",
  });
});

router.get("/:groupId/venues", async (req, res, next) => {
  const venues = await Venue.findAll({
    where: {
      groupId: req.params.groupId,
    },
    attributes: {
      exclude: ["updatedAt", "createdAt"],
    },
  });
  if (venues.length === 0) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found",
    });
  }
  res.json({ Venues: venues });
});

router.post("/:groupId/venues", validateVenueSignup, async (req, res, next) => {
  const { address, city, state, lat, lng } = req.body;
  const groupId = req.params.groupId;
  const group = await Group.findByPk(groupId);
  if (!group) {
    res.status(404);
    res.json({
      message: "Group couldn't be found",
    });
  }
  const venue = await Venue.create({
    groupId,
    address,
    city,
    state,
    lat,
    lng,
  });
  const newVenue = {
    id: venue.id,
    groupId: venue.groupId,
    address: venue.address,
    city: venue.city,
    state: venue.state,
    lat: venue.lat,
    lng: venue.lng,
  };
  res.json(newVenue);
});

router.get("/:groupId/events", async (req, res, next) => {
  const events = await Event.findAll({
    where: {
      groupId: req.params.groupId,
    },
    attributes: {
      exclude: ["description", "capacity", "price", "updatedAt", "createdAt"],
    },
    include: [
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
      {
        model: Attendance,
      },
      {
        model: EventImage,
      },
    ],
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
  if (list.length === 0) {
    res.status(404);
    return res.json({
      message: "Group couldn't be found.",
    });
  }
  res.json({
    Events: list,
  });
});

router.post("/:groupId/events", validateEventSignup, async (req, res, next) => {
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
  const group = await Group.findByPk(req.params.groupId);
  if (!group) {
    res.status(404);
    res.json({
      message: "Group couldn't be found",
    });
  }

  const event = await Event.create({
    venueId,
    groupId: Number(req.params.groupId),
    name,
    type,
    capacity,
    price,
    description,
    startDate,
    endDate,
  });

  res.json(event);
});

module.exports = router;
