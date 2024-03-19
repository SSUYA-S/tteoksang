create table if not exists profile_icon
(
    profile_icon_id   tinyint unsigned primary key auto_increment,
    profile_icon_name varchar(90) not null
);

insert into profile_icon(profile_icon_name)
VALUES ("없음"),
       ("기본 프사"),
       ("좀 멋진 프사");