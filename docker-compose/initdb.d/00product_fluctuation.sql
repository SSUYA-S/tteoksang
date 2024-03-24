create table if not exists product_fluctuation
(
    count_per_ten_days int not null,
    product_id         int not null,
    product_min_rate   double not null,
    product_max_rate   double not null,
    primary key(count_per_ten_days, product_id),
    foreign key(product_id) references product(product_id) on delete cascade
);

load data infile '/docker-entrypoint-initdb.d/product_fluctuation.csv'
into table product_fluctuation
fields terminated by ','
lines terminated by '\n'
ignore 1 rows;