create table if not exists profile_frame(
    profile_frame_id tinyint unsigned primary key auto_increment,
    profile_frame_name varchar(90) not null
);

insert into profile_frame(profile_frame_name)
VALUES ("기본 프레임"),
       ("귀여운 프레임");
