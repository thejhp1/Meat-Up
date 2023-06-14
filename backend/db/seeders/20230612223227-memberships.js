'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const { Membership } = require('../models');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.validate = true
    await Membership.bulkCreate([
      {
        userId: 1,
        groupId: 1,
        status: 'co-host'
      },
      {
        userId: 2,
        groupId: 2,
        status: 'member'
      },
      {
        userId: 3,
        groupId: 3,
        status: 'member'
      },
      {
        userId: 4,
        groupId: 4,
        status: 'pending'
      },
      {
        userId: 5,
        groupId: 5,
        status: 'member'
      },
      {
        userId: 6,
        groupId: 1,
        status: 'member'
      },
      {
        userId: 7,
        groupId: 2,
        status: 'co-host'
      },
      {
        userId: 8,
        groupId: 3,
        status: 'co-host'
      },
      {
        userId: 9,
        groupId: 4,
        status: 'co-host'
      },
      {
        userId: 10,
        groupId: 5,
        status: 'co-host'
      },
    ], options).catch((err) => {
      throw new Error(err)
    })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Memberships'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      status: { [Op.in]: ['co-host', 'member', 'pending'] }
    }, {});
  }
};
