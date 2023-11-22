const request = require("supertest");
const createApp = require("../app");
const appDataSource = require("../src/utils/database");
const { setupDatabase, resetDatabase } = require("../test/testSetup");
const userToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJwYzBidW1AZ21haWwuY29tIiwibmFtZSI6Iuq5gOyYgeuylCIsImlhdCI6MTcwMDExNDU4Nn0.GbMPNLlMF27ThioX5DnQUqLMcQNVl58Ux4Ww_IuGmTc";

describe("예약 추가", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
    await setupDatabase(appDataSource);
  });

  afterEach(async () => {
    await resetDatabase(appDataSource);
  });

  test("SUCCESS : 예약 추가", async () => {
    const response = await request(app)
      .post("/orders/1")
      .set("Authorization", userToken)
      .send({
        seatIds: [1, 2, 3],
        itemOptionsId: 1,
        price: 1000,
      });

    expect(response.body).toEqual({});
  });
});
