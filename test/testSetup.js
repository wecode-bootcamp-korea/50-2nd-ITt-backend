async function setupDatabase(appDataSource) {
  await appDataSource.query(`
    INSERT INTO users (name, kakao_id, email, phone_number)
    VALUES
    ('김영범' , 3159703924,'pc0bum@gmail.com','+82 10-2296-3745')
    `);

  await appDataSource.query(`
    INSERT INTO categories (name)
    VALUES
    ('로맨스'),
    ('코미디'),
    ('공포'),
    ('뮤지컬')
    `);

  await appDataSource.query(`
    INSERT INTO items (title, image, running_time, viewer_age, price, category_id, item_notice)
    VALUES 
    ('파우스트', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%91%E1%85%A1%E1%84%8B%E1%85%AE%E1%84%89%E1%85%B3%E1%84%90%E1%85%B3.jpg', 90, '8세 이상 이용가', 30000 , 4 ,"월~금 3:00 / 5:00 / 7:30"),
    ('레미제라블', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%85%E1%85%A6%E1%84%86%E1%85%B5%E1%84%8C%E1%85%A6%E1%84%85%E1%85%A1%E1%84%87%E1%85%B3%E1%86%AF.jpg', 60, '전체 이용가',25000, 4 ,"월~금 : 3시, 5시20분, 7시30분"),
    ('리진:빛의여인', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%87%E1%85%B5%E1%86%BE%E1%84%8B%E1%85%B4%E1%84%8B%E1%85%A7%E1%84%8B%E1%85%B5%E1%86%AB.jpg', 60, '15세 이상 이용가',30000, 4,"월~금 : 3시, 5시20분, 7시30분"),
    ('시스터액트', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%89%E1%85%B5%E1%84%89%E1%85%B3%E1%84%90%E1%85%A5%E1%84%8B%E1%85%A2%E1%86%A8%E1%84%90%E1%85%B3.jpg', 60, '8세 이상 이용가',25000, 4 , "월~금 : 3시, 5시20분, 7시30분"),
    ('맘마미아', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%86%E1%85%A1%E1%86%B7%E1%84%86%E1%85%A1%E1%84%86%E1%85%B5%E1%84%8B%E1%85%A1.jpg', 90, '전체 이용가',25000, 4,"월~금 3:00 / 5:00 / 7:30"),
    ('지킬앤하이드', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%8C%E1%85%B5%E1%84%8F%E1%85%B5%E1%86%AF%E1%84%8B%E1%85%A2%E1%86%AB%E1%84%92%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B3.jpg', 60, '15세 이상 이용가',25000, 4,"월~금 : 3시, 5시20분, 7시30분"),
    ('더 데빌:에덴', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%83%E1%85%A5+%E1%84%83%E1%85%A6%E1%84%87%E1%85%B5%E1%86%AF.jpg', 90, '15세 이상 이용가',30000, 4,"월~금 3:00 / 5:00 / 7:30"),
    ('오페라의 유령', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%8B%E1%85%A9%E1%84%91%E1%85%A6%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B4+%E1%84%8B%E1%85%B2%E1%84%85%E1%85%A7%E1%86%BC.jpg', 90, '8세 이상 이용가',25000, 4,"월~금 3:00 / 5:00 / 7:30"),
    ('삼총사', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%89%E1%85%A1%E1%86%B7%E1%84%8E%E1%85%A9%E1%86%BC%E1%84%89%E1%85%A1.jpg', 60, '전체 이용가',30000, 4 ,"월~금 : 3시, 5시20분, 7시30분"),
    ('키다리아저씨', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%8F%E1%85%B5%E1%84%83%E1%85%A1%E1%84%85%E1%85%B5+%E1%84%8B%E1%85%A1%E1%84%8C%E1%85%A5%E1%84%8A%E1%85%B5.jpg', 60, '15세 이상 이용가',30000, 4, "월~금 : 3시, 5시20분, 7시30분")
    ('택시안에','https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%90%E1%85%A2%E1%86%A8%E1%84%89%E1%85%B5%E1%84%8B%E1%85%A1%E1%86%AB%E1%84%8B%E1%85%A6.jpg', 60, '전체 이용가',23000, 2, "월~금 : 3시, 5시20분, 7시30분"),
    ('딜리버리', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%83%E1%85%B5%E1%86%AF%E1%84%85%E1%85%B5%E1%84%87%E1%85%A5%E1%84%85%E1%85%B5.jpg', 90, '전체 이용가',30000, 2,"월~금 3:00 / 5:00 / 7:30"),
    ('수상한 흥신소', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%89%E1%85%AE%E1%84%89%E1%85%A1%E1%86%BC%E1%84%92%E1%85%A1%E1%86%AB+%E1%84%92%E1%85%B3%E1%86%BC%E1%84%89%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A9.jpg',60, '전체 이용가',25000, 2, "월~금 : 3시, 5시20분, 7시30분"),
    ('소녀시대', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%89%E1%85%A9%E1%84%82%E1%85%A7%E1%84%89%E1%85%B5%E1%84%83%E1%85%A2.jpg', 60, '전체 이용가',30000, 2, "월~금 : 3시, 5시20분, 7시30분"),
    ('춤바람', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%8E%E1%85%AE%E1%86%B7%E1%84%87%E1%85%A1%E1%84%85%E1%85%A1%E1%86%B7.jpg', 90, '전체 이용가',30000, 2,"월~금 : 3시, 5시20분, 7시30분"),
    ('엄마 휴지 좀...', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%8B%E1%85%A5%E1%86%B7%E1%84%86%E1%85%A1+%E1%84%92%E1%85%B2%E1%84%8C%E1%85%B5+%E1%84%8C%E1%85%A9%E1%86%B7....jpg', 60, '전체 이용가',25000, 2, "월~금 : 3시, 5시20분, 7시30분"),
    ('그가 머문 자리엔 꽃향기가 남아', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%80%E1%85%B3%E1%84%80%E1%85%A1+%E1%84%86%E1%85%A5%E1%84%86%E1%85%AE%E1%86%AB+%E1%84%8C%E1%85%A1%E1%84%85%E1%85%B5%E1%84%8B%E1%85%A6+%E1%84%81%E1%85%A9%E1%86%BE%E1%84%92%E1%85%A3%E1%86%BC%E1%84%80%E1%85%B5%E1%84%80%E1%85%A1+%E1%84%82%E1%85%A1%E1%86%B7%E1%84%8B%E1%85%A1.jpg', 60, '전체 이용가',25000, 2, "월~금 : 3시, 5시20분, 7시30분"),
    ('원펀치 쓰리강냉이', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%8B%E1%85%AF%E1%86%AB%E1%84%91%E1%85%A5%E1%86%AB%E1%84%8E%E1%85%B5+%E1%84%8A%E1%85%B3%E1%84%85%E1%85%B5%E1%84%80%E1%85%A1%E1%86%BC%E1%84%82%E1%85%A2%E1%86%BC%E1%84%8B%E1%85%B5.jpg', 90, '전체 이용가',30000, 2,"월~금 : 3시, 5시20분, 7시30분"),
    ('I can 후라이', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%8B%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%8F%E1%85%A2%E1%86%AB%E1%84%92%E1%85%AE%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5.png', 90, '전체 이용가',30000, 2,"월~금 : 3시, 5시20분, 7시30분"),
    ('털보아저씨의 여행록', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%90%E1%85%A5%E1%86%AF%E1%84%87%E1%85%A9%E1%84%8B%E1%85%A1%E1%84%8C%E1%85%A5%E1%84%8A%E1%85%B5%E1%84%8B%E1%85%B4+%E1%84%8B%E1%85%A7%E1%84%92%E1%85%A2%E1%86%BC%E1%84%85%E1%85%A9%E1%86%A8.png',60, '전체 이용가',30000, 2, "월~금 : 3시, 5시20분, 7시30분"),
    ('오마이갓', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%8B%E1%85%A9%E1%84%86%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%80%E1%85%A1%E1%86%BA.jpg', 60, '15세 이상 이용가',30000, 3, "월~금 : 3시, 5시20분, 7시30분"),
    ('진짜나쁜소녀', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%8C%E1%85%B5%E1%86%AB%E1%84%8D%E1%85%A1%E1%84%82%E1%85%A1%E1%84%88%E1%85%B3%E1%86%AB%E1%84%89%E1%85%A9%E1%84%82%E1%85%A7.jpg', 90, '15세 이상 이용가',30000, 3,"월~금 3:00 / 5:00 / 7:30"),
    ('이방인의 뜰', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%8B%E1%85%B5%E1%84%87%E1%85%A1%E1%86%BC%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%8B%E1%85%B4+%E1%84%84%E1%85%B3%E1%86%AF.jpg', 60, '15세 이상 이용가',25000, 3, "월~금 : 3시, 5시20분, 7시30분"),
    ('조각 : 사라진 기억', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%89%E1%85%A1%E1%84%85%E1%85%A1%E1%84%8C%E1%85%B5%E1%86%AB+%E1%84%80%E1%85%B5%E1%84%8B%E1%85%A5%E1%86%A8.jpg', 90, '15세 이상 이용가',30000, 3,"월~금 3:00 / 5:00 / 7:30"),
    ('스위치', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%89%E1%85%B3%E1%84%8B%E1%85%B1%E1%84%8E%E1%85%B5.jpg', 60, '15세 이상 이용가',24000, 3, "월~금 : 3시, 5시20분, 7시30분"),
    ('오래된 아이', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%8B%E1%85%A9%E1%84%85%E1%85%A2%E1%84%83%E1%85%AC%E1%86%AB+%E1%84%8B%E1%85%A1%E1%84%8B%E1%85%B5.jpg', 60, '15세 이상 이용가',30000, 3, "월~금 : 3시, 5시20분, 7시30분"),
    ('말할 수 없는 입', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%86%E1%85%A1%E1%86%AF%E1%84%92%E1%85%A1%E1%86%AF+%E1%84%89%E1%85%AE+%E1%84%8B%E1%85%A5%E1%86%B9%E1%84%82%E1%85%B3%E1%86%AB+%E1%84%8B%E1%85%B5%E1%86%B8.jpg', 90, '15세 이상 이용가',25000, 3,"월~금 3:00 / 5:00 / 7:30"),
    ('심', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%89%E1%85%B5%E1%86%B7.jpg', 90, '15세 이상 이용가',30000, 3,"월~금 3:00 / 5:00 / 7:30"),
    ('그림자 탈출', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%80%E1%85%B3%E1%84%85%E1%85%B5%E1%86%B7%E1%84%8C%E1%85%A1+%E1%84%90%E1%85%A1%E1%86%AF%E1%84%8E%E1%85%AE%E1%86%AF.jpg', 60, '15세 이상 이용가',25000, 3, "월~금 : 3시, 5시20분, 7시30분"),
    ('생각지상주의자들의 요람', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%89%E1%85%A2%E1%86%BC%E1%84%80%E1%85%A1%E1%86%A8%E1%84%8C%E1%85%B5%E1%84%89%E1%85%A1%E1%86%BC%E1%84%8C%E1%85%AE%E1%84%8B%E1%85%B4%E1%84%8C%E1%85%A1%E1%84%83%E1%85%B3%E1%86%AF%E1%84%8B%E1%85%B4+%E1%84%8B%E1%85%AD%E1%84%85%E1%85%A1%E1%86%B7.jpg', 60, '15세 이상 이용가',24000, 3, "월~금 : 3시, 5시20분, 7시30분"),
    ('이 생을 마칠때까지', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%8B%E1%85%B5+%E1%84%89%E1%85%A2%E1%86%BC%E1%84%8B%E1%85%B3%E1%86%AF+%E1%84%86%E1%85%A1%E1%84%8E%E1%85%B5%E1%86%AF%E1%84%84%E1%85%A2%E1%84%81%E1%85%A1%E1%84%8C%E1%85%B5.jpg', 60, '15세 이상 이용가',30000, 1 ,"월~금 : 3시, 5시20분, 7시30분"),
    ('너무 안맞는 우리', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%82%E1%85%A5%E1%84%86%E1%85%AE+%E1%84%8B%E1%85%A1%E1%86%AB%E1%84%86%E1%85%A1%E1%86%BD%E1%84%82%E1%85%B3%E1%86%AB+%E1%84%8B%E1%85%AE%E1%84%85%E1%85%B5.jpg', 90, '15세 이상 이용가', 30000,1,"월~금 3:00 / 5:00 / 7:30"),
    ('장미빛 인생', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%8C%E1%85%A1%E1%86%BC%E1%84%86%E1%85%B5%E1%84%87%E1%85%B5%E1%86%BE+%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A2%E1%86%BC.jpg', 60, '15세 이상 이용가',25000, 1 ,"월~금 : 3시, 5시20분, 7시30분"),
    ('우리도 될까요?', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%8B%E1%85%AE%E1%84%85%E1%85%B5%E1%84%83%E1%85%A9+%E1%84%83%E1%85%AC%E1%86%AF%E1%84%81%E1%85%A1%E1%84%8B%E1%85%AD.jpg', 60, '15세 이상 이용가',25000, 1, "월~금 : 3시, 5시20분, 7시30분"),
    ('가면 무도회', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%80%E1%85%A1%E1%84%86%E1%85%A7%E1%86%AB+%E1%84%86%E1%85%AE%E1%84%83%E1%85%A9%E1%84%92%E1%85%AC.jpg', 90, '15세 이상 이용가', 25000,1,"월~금 3:00 / 5:00 / 7:30"),
    ('무인도 30일', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%86%E1%85%AE%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%83%E1%85%A9+30%E1%84%8B%E1%85%B5%E1%86%AF.jpg', 60, '8세 이상 이용가',30000,1, "월~금 : 3시, 5시20분, 7시30분"),
    ('마카롱 로즈', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%86%E1%85%A1%E1%84%8F%E1%85%A1%E1%84%85%E1%85%A9%E1%86%BC+%E1%84%85%E1%85%A9%E1%84%8C%E1%85%B3.jpg', 90, '전체 이용가', 25000,1,"월~금 3:00 / 5:00 / 7:30"),
    ('검지와 중지', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/%E1%84%80%E1%85%A5%E1%86%B7%E1%84%8C%E1%85%B5%E1%84%8B%E1%85%AA+%E1%84%8C%E1%85%AE%E1%86%BC%E1%84%8C%E1%85%B5.jpg', 90, '15세 이상 이용가', 30000,1,"월~금 3:00 / 5:00 / 7:30"),
    ('비포 선라이즈', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/before+sunrise.jpg', 90, '15세 이상 이용가',25000,1,"월~금 3:00 / 5:00 / 7:30"),
    ('Mr & Mrs', 'https://itcatbucket.s3.ap-northeast-2.amazonaws.com/itemImages/Mr+%26+Mrs.jpg',60, '8세 이상 이용가',25000,1, "월~금 : 3시, 5시20분, 7시30분");
`);

  await appDataSource.query(`
    INSERT INTO item_options (item_id, event_date, event_time)
    VALUES 
    (1, '2023-12-04', '15:00'),
    (1, '2023-12-04', '17:20'),
    (1, '2023-12-04', '19:30'),
    (1, '2023-12-05', '15:00'),
    (1, '2023-12-05', '17:20'),
    (1, '2023-12-05', '19:30'),
    (1, '2023-12-06', '15:00'),
    (1, '2023-12-06', '17:20'),
    (1, '2023-12-06', '19:30'),
    (1, '2023-12-07', '15:00'),
    (1, '2023-12-07', '17:20'),
    (1, '2023-12-07', '19:30'),
    (1, '2023-12-08', '15:00'),
    (1, '2023-12-08', '17:20'),
    (1, '2023-12-08', '19:30');
    `);

  await appDataSource.query(`
  INSERT INTO locations (id , name)
  VALUES
  (1,'대학로 아트포레스트'),
  (2,'JNT 아트홀'),
  (3, '틴틴홀'),
  (4, '바탕골 소극장'),
  (5, '티오엠')
  `);

  await appDataSource.query(`
    INSERT INTO seats (seat_row , seat_col , location_id , is_booked)
    VALUES
    ('A',1,1,0),
    ('A',2,1,0),
    ('A',3,1,0)
  `);

  await appDataSource.query(`
  INSERT INTO actors (name, item_id)
  VALUES
  ('송은우', 1), ('이소헌', 1), ('홍래영', 1), ('이승윤', 1), ('윤치웅', 1)
  `);

  await appDataSource.query(`
  INSERT INTO locations_items (location_id , item_id)
  VALUES
  (1 ,  1)
  `);
}

async function resetDatabase(appDataSource) {
  await appDataSource.query(`SET foreign_key_checks = 0;`);
  await appDataSource.query(`TRUNCATE TABLE users`);
  await appDataSource.query(`TRUNCATE TABLE categories;`);
  await appDataSource.query(`TRUNCATE TABLE items;`);
  await appDataSource.query(`TRUNCATE TABLE item_options;`);
  await appDataSource.query(`TRUNCATE TABLE locations;`);
  await appDataSource.query(`TRUNCATE TABLE seats;`);
  await appDataSource.query(`TRUNCATE TABLE actors;`);
  await appDataSource.query(`TRUNCATE TABLE locations_items;`);
  await appDataSource.query(`TRUNCATE TABLE reservations;`);
  await appDataSource.query(`SET foreign_key_checks = 1;`);
  await appDataSource.destroy();
}

module.exports = {
  setupDatabase,
  resetDatabase,
};
