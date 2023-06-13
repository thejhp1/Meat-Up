'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const { Event } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  //   options.validate = true
  //   await Event.bulkCreate([
  //     {
  //       groupId: 1,
  //       venueId: '',
  //       name: '',
  //       type: '',

  //     },
  //     {
  //       groupId: 2,
  //     },
  //     {
  //       groupId: 3,
  //     },
  //     {

  //       groupId: 4,
  //     },
  //     {
  //       groupId: 5,
  //     },
  //   ], options).catch((err) => {
  //     throw new Error(err)
  //   })
  },

  async down (queryInterface, Sequelize) {
    // options.tableName = 'Events'
    // const Op = Sequelize.Op;
    // return queryInterface.bulkDelete(options, {
    //   status: { [Op.in]: ['co-host', 'member', 'pending'] }
    // }, {});
  }
};
