'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const { Group } = require('../models');

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
    options.tableName = 'Groups'
    await Group.bulkCreate(options, [
      {
        organizerId: 1,
        name: "Evening Tennis on the Water",
        about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
        type: "In person",
        private: true,
        city: "New York",
        state: "NY",
      },
      // {
      //   organizerId: 2,
      //   name: "Evening Tennis on the Water",
      //   about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
      //   type: "In person",
      //   private: true,
      //   city: "San Francisco",
      //   state: "CA",
      // },
      // {
      //   organizerId: 3,
      //   name: "Evening Tennis on the Water",
      //   about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
      //   type: "In person",
      //   private: true,
      //   city: "Raleigh",
      //   state: "NC",
      // },
      // {
      //   organizerId: 4,
      //   name: "Evening Tennis on the Water",
      //   about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
      //   type: "In person",
      //   private: true,
      //   city: "Los Angeles",
      //   state: "CA",
      // },
      // {
      //   organizerId: 5,
      //   name: "Evening Tennis on the Water",
      //   about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
      //   type: "In person",
      //   private: true,
      //   city: "Philadelphia",
      //   state: "PA",
      // },
    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Groups'
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      city: { [Op.in]: ['New York', 'San Francisco', 'Raleigh', 'Los Angeles', 'Philadelphia'] }
    }, {});
  }
};
