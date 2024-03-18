create table if not exists honor (
    user_id char(36), #PK
    title_id int, #PK
    honored_date timestamp not null,
    foreign key(user_id) references user(user_id),
    foreign key(title_id) references title(title_id) ON DELETE CASCADE,
    primary key(user_id, title_id)
);
