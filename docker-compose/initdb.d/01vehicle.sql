create table if not exists vehicle(
    vehicle_level tinyint unsigned primary key,
    vehicle_name varchar(90),
    vehicle_content text,
    vehicle_upgrade_fee int,
    max_purchase_quantity int
);

insert into vehicle(vehicle_level, vehicle_name, vehicle_content, vehicle_upgrade_fee, max_purchase_quantity)
VALUES (1,"장바구니와 운동화", "아직 체력 팔팔! 걸어다니자!",0,20),
       (2,"손수레","몸으로 때우자",100,100),
       (3,"자전거","싸구려 자전거",200,200),
       (4,"트랙터","드디어 자동차가 생겼다.",300,300),
       (5,"1935년식 자동차","어디서 구한거야",400,400),
       (6,"1950년식 자동차","우리의 든든한 친구",500,500),
       (7, "물류 트럭","트레일러는 낭만이다.",600,600),
       (8,"10톤 트럭","솔직히 이정도는 되어야 장사하지",700,700),
       (9,"2020년식 트럭","이게 미래다",800,800),
       (10,"푸드 트럭","가공과 판매를 동시에",900,900);