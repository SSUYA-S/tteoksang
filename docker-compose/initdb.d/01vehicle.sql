create table if not exists vehicle(
    vehicle_level tinyint unsigned primary key,
    vehicle_name varchar(90),
    vehicle_content text,
    vehicle_upgrade_fee int,
    max_purchase_quantity int
);

insert into vehicle(vehicle_level, vehicle_name, vehicle_content, vehicle_upgrade_fee, max_purchase_quantity)
VALUES (1,"장바구니와 운동화", "아직 체력 팔팔! 걸어다니자!",0,15)