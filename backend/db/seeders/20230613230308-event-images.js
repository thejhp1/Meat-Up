'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const { EventImage } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.validate = true
    await EventImage.bulkCreate([
      {
        eventId: 1,
        url: 'https://2.bp.blogspot.com/-6ckW4zHz5rY/ThSTsyh_tmI/AAAAAAAAB_Y/IFPW7hRTP7Q/s1600/MatchMaker_Tennis_beginner_tennis_lesson-21.jpg',
        preview: true
      },
      {
        eventId: 2,
        url: 'https://imageio.forbes.com/specials-images/imageserve/6318ff5764472947cad70386/US-Open-Tennis/960x0.jpg?height=399&width=711&fit=bounds',
        preview: true
      },
      {
        eventId: 3,
        url: 'https://uploads-ssl.webflow.com/60c3fa3e3841a23d7491e8b1/60c8308027c673a044ec728c_1_CBqNbB8Ln3V3tX-cpe75LQ.jpeg',
        preview: false
      },
      {
        eventId: 4,
        url: 'https://www.watersportswhiz.com/wp-content/uploads/2021/04/eduard-labar-DI3SW1QKCGo-unsplash-1.jpg',
        preview: true
      },
      {
        eventId: 5,
        url: 'https://www.fusd.net/cms/lib/CA50000190/Centricity/Domain/775/Library/HPRC.png',
        preview: true
      },
    ], options).catch((err) => {
      throw new Error(err)
    })
},

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1,2,3,4,5] }
    }, {});
  }
};
