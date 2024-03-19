create table if not exists achievement(
    achievement_id int primary key auto_increment,
    achievement_name varchar(300) not null,
    achievement_content text,
    statistics_name varchar(100),
    achievement_goal int,
    achievement_reward_type char(10),
    achievement_reward_id int
);

insert into achievement(achievement_name, achievement_content, statistics_name, achievement_goal, achievement_reward_type, achievement_reward_id)
VALUES ("초보 도매상: 감자를 사요", "감자를 좋아하시나봐요! 벌써 50개를 샀어요", "AccTotalPotatoCount", 50, "PRODUCT", 1);