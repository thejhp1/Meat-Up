"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
const { Venue } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.validate = true;
    await Venue.bulkCreate(
      [
        {
          groupId: 1,
          address: "123 New York Way",
          city: "New York",
          state: "NY",
          lat: 40.72931,
          lng: -74.001569,
        },
        {
          groupId: 2,
          address: "123 San Francisco Road",
          city: "San Francisco",
          state: "CA",
          lat: 37.7645358,
          lng: -122.4730327,
        },
        {
          groupId: 3,
          address: "123 Raleigh Avenue",
          city: "Raleigh",
          state: "NC",
          lat: 35.772743,
          lng: -78.632166,
        },
        {
          groupId: 4,
          address: "123 Los Angeles Lane",
          city: "Los Angeles",
          state: "CA",
          lat: 33.934866,
          lng: -118.278711,
        },
        {
          groupId: 5,
          address: "123 Philadelphia Drive",
          city: "Philadelphia",
          state: "PA",
          lat: 39.934675,
          lng: -75.189441,
        },
      ],
      options
    ).catch((err) => {
      throw new Error(err);
    });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Venues";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        city: {
          [Op.in]: [
            "New York",
            "San Francisco",
            "Raleigh",
            "Los Angeles",
            "Philadelphia",
          ],
        },
      },
      {}
    );
  },
};
