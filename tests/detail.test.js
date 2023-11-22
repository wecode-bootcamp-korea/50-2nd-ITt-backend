const request =require("supertest");
const createApp = require('../app');
const appDataSoure = require('../src/utils/database')

//get itemDetail
describe("getItemDetail" , () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await appDataSoure.initialize();
        await appDataSoure.query(`
        INSERT INTO categories(id, name)
        VALUES (1, "로맨스")
        `)
        await appDataSoure.query(`
        INSERT INTO items (id, title, image, running_time, viewer_age, price, category_id, item_notice, created_at, updated_at)
        VALUES (1, 'test_title', 'test.image', 60, '7세이상' , 50000, 1, '월~금 3:00 / 5:00 / 7:30', '2023-11-19 09:04:28', '2023-11-20 07:26:28')
        `);
        await appDataSoure.query(`
        INSERT INTO locations (id, name, coordinate_x, coordinate_y)
        VALUES (1, "수원", "37.11", "102.2134")
        `)
        await appDataSoure.query(`
        INSERT INTO item_options (id, event_date , event_time, item_id)
        VALUES (1, '2023-12-04', '15:00:00', 1)
        `)
        await appDataSoure.query(`
        INSERT INTO locations_items(id,location_id, item_id)
        VALUES (1, 1, 1)
        `)
        await appDataSoure.query(`
        INSERT INTO actors (id, name, item_id)
        VALUES (1, '원준석', 1)
        `)
    });

    afterEach(async ()=>{
        await appDataSoure.query(`SET foreign_key_checks = 0;`);
        await appDataSoure.query(`TRUNCATE items`);
        await appDataSoure.query(`TRUNCATE item_options`);
        await appDataSoure.query(`TRUNCATE actors`);
        await appDataSoure.query(`TRUNCATE locations_items`);
        await appDataSoure.query(`TRUNCATE categories`);
        await appDataSoure.query(`TRUNCATE locations`);
        await appDataSoure.query(`SET foreign_key_checks = 1;`);
        await appDataSoure.destroy();
    });
        test("SUCCESS: get itemDetail", async ()=>{
        const itemId = 1;
        const res = await request(app)
        .get(`/detail/${itemId}`)
        .send()

        expect(res.body).toEqual({
            data: {
            actorsInfoByitemId: [
                {
                name: "원준석",
                },
            ],
            calenderTime: [
                {
                eventDate: "2023-12-04",
                eventTime: "15:00",
                id: 1,
                },
            ],
            itemInfo: [
                {
                image: "test.image",
                itemId: 1,
                itemNotice: "월~금 3:00 / 5:00 / 7:30",
                lat: "37.11000000000000",
                lng: "102.21340000000000",
                locationId: 1,
                locationName: "수원",
                price: 50000,
                runningTime: 60,
                title: "test_title",
                viewerAge: "7세이상",
                },
              ],
             },
            });
        expect(res.statusCode).toBe(200);

        });
       
});
//post detailseat
describe("getItemDetail" , () => {
    let app;

    beforeAll(async () => {
        app = createApp();
        await appDataSoure.initialize();
        await appDataSoure.query(`
        INSERT INTO users(id, email, kakao_id, name, credit, created_at, deleted_status, is_admin, phone_number)
        VALUES (3, 'pc0bum@gmail.com', '3159703924', '김영범', 410000, Now(), 0, 0, '010-1111-1111')
        `)
        await appDataSoure.query(`
        INSERT INTO categories(id, name)
        VALUES (1, "로맨스")
        `)
        await appDataSoure.query(`
        INSERT INTO items (id, title, image, running_time, viewer_age, price, category_id, item_notice, created_at, updated_at)
        VALUES (2, 'test_title', 'test.image', 60, '7세이상' , 50000, 1, '월~금 3:00 / 5:00 / 7:30', '2023-11-19 09:04:28', '2023-11-20 07:26:28')
        `);
        await appDataSoure.query(`
        INSERT INTO locations (id, name, coordinate_x, coordinate_y)
        VALUES (1, "수원", 37.11, 102.2134)
        `)
        await appDataSoure.query(`
        INSERT INTO item_options (id, event_date , event_time, item_id)
        VALUES (1, '2023-12-04', '15:00:00', 2)
        `)
        await appDataSoure.query(`
        INSERT INTO locations_items(id,location_id, item_id)
        VALUES (1, 1, 2)
        `)
        await appDataSoure.query(`
        INSERT INTO actors (id, name, item_id)
        VALUES (1, '원준석', 2)
        `)
        await appDataSoure.query(`
        INSERT INTO seats (id, seat_row, seat_col, location_id, is_booked)
        VALUES (1, 'A', 1, 1, 0)
        `)
    });

    afterAll(async ()=>{
        await appDataSoure.query(`SET foreign_key_checks = 0;`);
        await appDataSoure.query(`TRUNCATE users`);
        await appDataSoure.query(`TRUNCATE items`);
        await appDataSoure.query(`TRUNCATE item_options`);
        await appDataSoure.query(`TRUNCATE actors`);
        await appDataSoure.query(`TRUNCATE locations_items`);
        await appDataSoure.query(`TRUNCATE categories`);
        await appDataSoure.query(`TRUNCATE locations`);
        await appDataSoure.query(`TRUNCATE seats`);
        await appDataSoure.query(`SET foreign_key_checks = 1;`);
        await appDataSoure.destroy();
    });
    test("FAILED : TOKEN_REQUIRED!", async ()=>{
        const token = ``
        const res = await request(app)
        .post(`/detail`)
        .set(`Authorization`, `${token}`)
        .send({locationId : 1, itemId : 2})
        .expect(401)
        .expect({message : "TOKEN_REQUIRED"})

    expect(res.body).toEqual
    })

    test("SUCCESS: post-seat", async ()=>{
        const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJwYzBidW1AZ21haWwuY29tIiwibmFtZSI6Iuq5gOyYgeuylCIsImlhdCI6MTcwMDExNDU4Nn0.GbMPNLlMF27ThioX5DnQUqLMcQNVl58Ux4Ww_IuGmTc`;
        const res = await request(app)
        .post(`/detail`)
        .set('Authorization', `${token}`)
        .send({locationId : 1, itemId : 2})

    expect(res.body).toEqual({
            data: {
              remainSeats: {
                remainSeats: '1',
              },
              seatInfo: [
                {
                  id: 1,
                  isBooked: 0,
                  seatCol: 1,
                  seatRow: 'A',
                },
              ],
            },
          });

        expect(res.statusCode).toBe(200);
        });
        

        
       
});