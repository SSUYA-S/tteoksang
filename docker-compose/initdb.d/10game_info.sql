create table if not exists game_info(
    user_id char(36), #PK
    game_id int not null, #PK
    gold    bigint not null,
    warehouse_level tinyint not null,
    vehicle_level tinyint not null,
    broker_level tinyint not null,
    private_event_id varchar(100),
    last_play_turn int not null,
    last_connect_time timestamp not null,
    purchase_quantity int not null,
    total_product_quantity int not null,
    products blob not null,
    rent_fee bigint not null,
    foreign key(user_id) references user(user_id),
    primary key(user_id) #game_id도 PK?
);
