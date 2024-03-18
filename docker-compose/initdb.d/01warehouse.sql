create table if not exists warehouse(
    warehouse_level tinyint unsigned primary key,
    warehouse_name varchar(30),
    warehouse_content varchar(100),
    warehouse_upgrade_fee int,
    max_holding_quantity int
);

insert into warehouse(warehouse_level, warehouse_name, warehouse_content, warehouse_upgrade_fee, max_holding_quantity)
values (1,"상자","작지만 뭔가를 보관할 수는 있다",0,20);
