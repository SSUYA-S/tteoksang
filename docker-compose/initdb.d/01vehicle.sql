create table if not exists vehicle(
    vehicle_level tinyint unsigned primary key,
    vehicle_name varchar(90),
    vehicle_content text,
    vehicle_upgrade_fee int,
    max_purchase_quantity int
);

insert into vehicle(vehicle_level, vehicle_name, vehicle_content, vehicle_upgrade_fee, max_purchase_quantity)
VALUES (1,"손수레","몸으로 때우자",100000,200),
       (2,"자전거","싸구려 자전거",200000,300),
       (3,"트랙터","드디어 자동차가 생겼다.",400000,400),
       (4,"1935년식 자동차","어디서 구한거야",700000,500),
       (5,"1950년식 자동차","우리의 든든한 친구",1000000,600),
       (6, "물류 트럭","트레일러는 낭만이다.",1400000,700),
       (7,"10톤 트럭","솔직히 이정도는 되어야 장사하지",1900000,800),
       (8,"2020년식 트럭","이게 미래다",2500000,900),
       (9,"푸드 트럭","가공과 판매를 동시에",3300000,1000);