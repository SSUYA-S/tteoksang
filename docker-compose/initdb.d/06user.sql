CREATE TABLE IF NOT EXISTS user (
    user_id char(36) primary key,
    user_google_id char(25) unique,
    user_email varchar(100) not null,
    user_nickname varchar(50) not null,
    user_profile_icon_id tinyint unsigned,
    user_profile_frame_id tinyint unsigned,
    user_theme_id tinyint unsigned,
    created_at timestamp not null default current_timestamp(),
    deleted_at timestamp null default null,
    foreign key(user_profile_frame_id) references profile_frame(profile_frame_id),
    foreign key(user_profile_icon_id) references profile_icon(profile_icon_id),
    foreign key(user_theme_id) references theme(theme_id)
);
