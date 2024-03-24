create table if not exists theme
(
    theme_id   tinyint unsigned primary key auto_increment,
    theme_name varchar(90) not null
);

insert into theme(theme_id, theme_name)
values (1, '화창한 집'),
       (2, '바다가 보이는 집'),
       (3, '회의실 앞 바닷가'),
       (4, '마법사의 집'),
       (5, '시골 문구점'),
       (6, '아침의 축제'),
       (7, '덥디 더운 여름'),
       (8, '한적한 테라스'),
       (9, '어느 화가의 공방'),
       (10, '떡상의 문단속');

