create table if not exists product_fluctuation
(
    product_id         int,
    count_per_ten_days int,
    product_min_rate   int not null,
    product_max_rate   int not null,
    primary key(product_id,count_per_ten_days),
    foreign key(product_id) references product(product_id) on delete cascade
);