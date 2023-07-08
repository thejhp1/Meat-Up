"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
const { GroupImage } = require("../models");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.validate = true;
    await GroupImage.bulkCreate(
      [
        {
          groupId: 1,
          url: "https://static.designboom.com/wp-content/uploads/2022/01/adidas-parley-floating-tennis-court-recycled-australia-designboom-600.jpg",
          preview: true,
        },
        {
          groupId: 2,
          url: "https://secure.meetupstatic.com/photos/event/8/a/8/2/600_513515458.webp?w=384",
          preview: true,
        },
        {
          groupId: 3,
          url: "https://www.zoaroutdoor.com/wp-content/uploads/2020/04/group-rafting-scaled.jpg",
          preview: false,
        },
        {
          groupId: 4,
          url: "https://i.guim.co.uk/img/media/d305370075686a053b46f5c0e6384e32b3c00f97/0_50_5231_3138/master/5231.jpg?width=620&quality=85&dpr=1&s=none",
          preview: true,
        },
        {
          groupId: 5,
          url: "https://www.cesarsway.com/wp-content/uploads/2015/06/6-tips-for-mastering-the-dog-walk.jpg",
          preview: false,
        },
        {
          groupId: 7,
          url: "https://cdn-icons-png.flaticon.com/512/5651/5651475.png",
          preview: false,
        },
      ],
      options
    ).catch((err) => {
      throw new Error(err);
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        groupId: { [Op.in]: [1, 2, 3, 4, 5] },
      },
      {}
    );
  },
};
