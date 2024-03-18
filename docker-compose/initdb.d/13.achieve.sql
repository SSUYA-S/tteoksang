create table if not exists achieve (
   user_id char(36), #PK
    achievement_id int, #PK
    achieved_date timestamp not null,
    foreign key(user_id) references user(user_id),
    foreign key(achievement_id) references achievement(achievement_id) ON DELETE CASCADE,
    primary key(user_id, achievement_id)
    );

