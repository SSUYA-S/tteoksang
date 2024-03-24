create table if not exists product(
    product_id int primary key,
    product_code int not null,
    product_name varchar(90) not null,
    product_type enum('ALL','SPRING','SUMMER','FALL','WINTER') not null,
    product_default_cost int not null,
    product_avg_cost double not null,
    product_unit varchar(10) not null
) ENGINE innoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

load data infile '/docker-entrypoint-initdb.d/product.csv'
into table product
fields terminated by ','
lines terminated by '\n'
ignore 1 rows;

