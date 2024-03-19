create table if not exists own_profile_frame(
    user_id char(36), #uuid
    profile_frame_id tinyint unsigned,
    foreign key(user_id) references user(user_id),
    foreign key(profile_frame_id) references profile_frame(profile_frame_id) ON DELETE CASCADE,
    primary key(user_id, profile_frame_id)
    );