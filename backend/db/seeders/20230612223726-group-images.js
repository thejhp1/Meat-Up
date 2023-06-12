'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const { GroupImage } = require('../models');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.validate = true
    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: 'https://static.designboom.com/wp-content/uploads/2022/01/adidas-parley-floating-tennis-court-recycled-australia-designboom-600.jpg',
        preview: true
      },
      {
        groupId: 2,
        url: 'https://secure.meetupstatic.com/photos/event/8/a/8/2/600_513515458.webp?w=384',
        preview: true
      },
      {
        groupId: 3,
        url: 'https://www.zoaroutdoor.com/wp-content/uploads/2020/04/group-rafting-scaled.jpg',
        preview: false
      },
      {
        groupId: 4,
        url: 'https://th-thumbnailer.cdn-si-edu.com/sWf0xF1il7OWYO8j-PGqwBvxTAE=/1000x750/filters:no_upscale():focal(2550x1724:2551x1725)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer_public/9a/d7/9ad71c28-a69d-4bc0-b03d-37160317bb32/gettyimages-577674005.jpg',
        preview: true
      },
      {
        groupId: 5,
        url: 'https://www.cesarsway.com/wp-content/uploads/2015/06/6-tips-for-mastering-the-dog-walk.jpg',
        preview: false
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'GroupImages'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1,2,3,4,5] }
    }, {});
  }
};
