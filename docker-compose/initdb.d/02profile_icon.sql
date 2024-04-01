create table if not exists profile_icon
(
    profile_icon_id   tinyint unsigned primary key auto_increment,
    profile_icon_name varchar(90) not null
);

insert into profile_icon(profile_icon_name)
VALUES ("여자1"),
       ("캐주얼1"),
       ("고양이1"),
       ("고양이2"),
       ("고양이3"),
       ("여우1"),
       ("여자2"),
       ("돼지1"),
       ("돼지2"),
       ("부유섬1"),
       ("여자3"),
       ("남자1");