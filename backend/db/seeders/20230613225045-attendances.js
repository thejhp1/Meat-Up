'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const { Attendance } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.validate = true
    await Attendance.bulkCreate([
      {
        eventId: 1,
        userId: 1,
        status: 'pending'
      },
      {
        eventId: 2,
        userId: 2,
        status: 'pending'
      },
      {
        eventId: 2,
        userId: 3,
        status: 'waitlist'
      },
      {
        eventId: 3,
        userId: 4,
        status: 'attending'
      },
      {
        eventId: 4,
        userId: 5,
        status: 'waitlist'
      },
      {
        eventId: 5,
        userId: 6,
        status: 'pending'
      },
      {
        eventId: 4,
        userId: 7,
        status: 'attending'
      },
      {
        eventId: 2,
        userId: 8,
        status: 'attending'
      },
      {
        eventId: 5,
        userId: 9,
        status: 'attending'
      },
      {
        eventId: 3,
        userId: 10,
        status: 'attending'
      }
    ], options).catch((err) => {
      throw new Error(err)
    })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Attendances'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      status: { [Op.in]: ['attending', 'waitlist', 'pending'] }
    }, {});
  }
};
