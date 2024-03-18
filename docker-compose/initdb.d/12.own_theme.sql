create table if not exists own_theme(
    user_id char(36), #uuid
    theme_id tinyint unsigned,
    foreign key(user_id) references user(user_id),
    foreign key(theme_id) references theme(theme_id) ON DELETE CASCADE,
    primary key(user_id, theme_id)
    );