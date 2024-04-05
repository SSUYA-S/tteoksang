create table if not exists warehouse(
    warehouse_level tinyint unsigned primary key,
    warehouse_name varchar(30),
    warehouse_content varchar(100),
    warehouse_upgrade_fee int,
    max_holding_quantity int
);

insert into warehouse(warehouse_level, warehouse_name, warehouse_content, warehouse_upgrade_fee, max_holding_quantity)
values (1,"작은 창고","낡고 좁아터진 창고",100000,400),
       (2,"최신 작은 창고","낡지는 않았다.",200000,600),
       (3,"2층 창고","층이 2배인 창고",300000,800),
       (4,"최신 2층 창고","냉장, 냉동 완비",700000,1000),
       (5,"매우 큰 2층 창고","뒤에 공간 있어요",1000000,1200),
       (6,"Cyberpunk 물류","쿠팡 물류센터급",1400000,1400),
       (7,"중국 창고","크다",1900000,1600),
       (8,"일본 창고","짱크다",2500000,1800),
       (9,"나만의 창고","세들어 살지 말자",3300000,2000);