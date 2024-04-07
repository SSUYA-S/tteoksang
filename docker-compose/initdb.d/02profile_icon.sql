create table if not exists profile_icon
(
    profile_icon_id   tinyint unsigned primary key auto_increment,
    profile_icon_name varchar(90) not null
);

insert into profile_icon(profile_icon_name)
VALUES ("여자1"),
       ("토끼1"),
       ("고양이1"),
       ("고양이2"),
       ("고양이3"),
       ("여우1"),
       ("쥐1"),
       ("돼지1"),
       ("돼지2"),
       ("카피바라1"),
       ("낙타1"),
       ("개1"),
       ("하마1"),
       ("사자1"),
       ("핑크고래1"),
       ("곰1"),
       ("부유섬1"),
       ("여자2"),
       ("남자1"),
       ("여자3");