create table if not exists warehouse(
    warehouse_level tinyint unsigned primary key,
    warehouse_name varchar(30),
    warehouse_content varchar(100),
    warehouse_upgrade_fee int,
    max_holding_quantity int
);

insert into warehouse(warehouse_level, warehouse_name, warehouse_content, warehouse_upgrade_fee, max_holding_quantity)
values (1,"상자","작지만 뭔가를 보관할 수는 있다",0,40),
       (2,"작은 창고","낡고 좁아터진 창고",100,100),
       (3,"최신 작은 창고","낡지는 않았다.",200,200),
       (4,"2층 창고","층이 2배인 창고",300,300),
       (5,"최신 2층 창고","냉장, 냉동 완비",400,400),
       (6,"매우 큰 2층 창고","뒤에 공간 있어요",500,500),
       (7,"Cyberpunk 물류","쿠팡 물류센터급",600,600),
       (8,"중국 창고","크다",700,700),
       (9,"일본 창고","짱크다",800,800),
       (10,"나만의 창고","세들어 살지 말자",900,900);