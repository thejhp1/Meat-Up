'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        email: 'user1@user.io',
        firstName: 'Fake',
        lastName: 'One',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        email: 'user2@user.io',
        firstName: 'Fakee',
        lastName: 'Two',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user3@user.io',
        firstName: 'Fakeee',
        lastName: 'Three',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password3')
      }
      ,
      {
        email: 'user4@user.io',
        firstName: 'Fakeeee',
        lastName: 'Four',
        username: 'FakeUser4',
        hashedPassword: bcrypt.hashSync('password4')
      }
      ,
      {
        email: 'user5@user.io',
        firstName: 'Fakeeeee',
        lastName: 'Five',
        username: 'FakeUser5',
        hashedPassword: bcrypt.hashSync('password5')
      }
      ,
      {
        email: 'user6@user.io',
        firstName: 'Fakeeeeee',
        lastName: 'Six',
        username: 'FakeUser6',
        hashedPassword: bcrypt.hashSync('password6')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['FakeUser1', 'FakeUser2', 'FakeUser3', 'FakeUser4', 'FakeUser5', 'FakeUser6'] }
    }, {});
  }
};
