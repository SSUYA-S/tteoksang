create table if not exists warehouse(
    warehouse_level tinyint unsigned primary key,
    warehouse_name varchar(30),
    warehouse_content varchar(100),
    warehouse_upgrade_fee int,
    max_holding_quantity int
);

insert into warehouse(warehouse_level, warehouse_name, warehouse_content, warehouse_upgrade_fee, max_holding_quantity)
values (1,"상자","작지만 뭔가를 보관할 수는 있다",100000,200),
       (2,"작은 창고","낡고 좁아터진 창고",200000,400),
       (3,"최신 작은 창고","낡지는 않았다.",400000,600),
       (4,"2층 창고","층이 2배인 창고",700000,800),
       (5,"최신 2층 창고","냉장, 냉동 완비",1000000,1000),
       (6,"매우 큰 2층 창고","뒤에 공간 있어요",1400000,1200),
       (7,"Cyberpunk 물류","쿠팡 물류센터급",1900000,1400),
       (8,"중국 창고","크다",2500000,1600),
       (9,"일본 창고","짱크다",3300000,1800),
       (10,"나만의 창고","세들어 살지 말자",4000000,2000);