create table if not exists product(
    product_id int primary key auto_increment,
    product_name varchar(90) not null,
    product_basic_cost int not null,
    product_type char(10) not null,
    product_unit varchar(10) not null,
    product_min_rate  int not null,
    product_max_rate  int not null
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

insert into product(product_name, product_basic_cost, product_type, product_unit, product_min_rate, product_max_rate)
values ("감자",1200,"COMMON","개",2,5),
       ("고구마",1200,"COMMON","개",2,5);
