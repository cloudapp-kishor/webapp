const request = require('supertest');
const app = require('../server.js');
const { sequelize } = require('../databaseConfig/databaseConnect.js');
const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');
require('dotenv').config();

describe('User Routes Integration Tests', () => {
  // Reset the database before each test
  beforeEach(async () => {
    await sequelize.sync();
  });

  // Close the database connection after all tests
  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /user', () => {
    it('should not create a user and return 400', async () => {
      const userData = {
        first_name: 'kishor',
        last_name: 'kashid',
        email: 'kishorkashid@gmail.com',
        password: 'Kishor@1',
      };

      const response = await request(app)
        .post('/v1/user')
        .send(userData)
        .expect(400);

      expect(response.body.message).toContain('User already exists with this email');
    });

    it('should return 400 if invalid data is provided', async () => {
      const invalidUserData = {
        first_name: 'kishor',
        last_name: 'kashid',
        email: 'kishorkashid@gmail.com',
        password: 'Kishor@1',
        age: 25
      };

      const response = await request(app)
        .post('/v1/user')
        .send(invalidUserData)
        .expect(400);

      expect(response.body.message).toContain('Invalid Request Body');
    });
  });

  describe('GET /user/self', () => {
    let user;

    beforeEach(async () => {
      // Create a user for testing
      user = ({
        first_name: 'kishor',
        last_name: 'kashid',
        email: 'kishorkashid1@gmail.com',
        password: await bcrypt.hash('Kishor@1', 10),
      });
    });

    it('should return user data for the authenticated user', async () => {
      const base64Token = Buffer.from(`${user.email}:Kishor@1`).toString('base64');
      
      const response = await request(app)
        .get('/v1/user/self')
        .set('Authorization', `Basic ${base64Token}`)
        .expect(200);

      expect(response.body.email).toBe(user.email);
      expect(response.body.first_name).toBe(user.first_name);
      expect(response.body.last_name).toBe(user.last_name);
    });

    it('should return 400 if query parameters are present', async () => {
      const base64Token = Buffer.from(`${user.email}:Kishor@1`).toString('base64');

      const response = await request(app)
        .get('/v1/user/self?name="kishor"')
        .set('Authorization', `Basic ${base64Token}`)
        .expect(400);
    });
  });
});

