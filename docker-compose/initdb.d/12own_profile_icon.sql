create table if not exists own_profile_icon(
    user_id char(36), #uuid
    profile_icon_id tinyint unsigned,
    foreign key(user_id) references user(user_id),
    foreign key(profile_icon_id) references profile_icon(profile_icon_id) ON DELETE CASCADE,
    primary key(user_id, profile_icon_id)
    );