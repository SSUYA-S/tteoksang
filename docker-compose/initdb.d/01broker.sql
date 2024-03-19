create table if not exists broker(
    broker_level tinyint unsigned primary key,
    broker_name varchar(90),
    broker_content text,
    broker_upgrade_fee int,
    broker_fee int
);

insert into broker(broker_level, broker_name, broker_content, broker_upgrade_fee, broker_fee)
values (1,"작은 중개소","나의 작고 소중한 중개소",0,100);
