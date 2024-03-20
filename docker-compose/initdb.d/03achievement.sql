create table if not exists achievement
(
    achievement_id          int primary key auto_increment,
    achievement_name        varchar(300) not null,
    achievement_content     text,
    statistics_name         varchar(100),
    achievement_goal        int,
    achievement_reward_type enum ('NONE','TITLE', 'ICON','FRAME','THEME') not null,
    achievement_reward_id   int
);

insert into achievement(achievement_name, achievement_content, statistics_name, achievement_goal,
                        achievement_reward_type, achievement_reward_id)
VALUES ("초보 도매상: 감자를 사요", "감자를 좋아하시나봐요! 벌써 50개를 샀어요", "AccTotalPotatoCount", 50, "NONE", 0),
       ("강원도의 전설","강원도의 전설이 되어보세요.","AccProductPurchaseQunatity,1",30,'NONE',0),
       ("아침드라마","답답하다.","AccProductPurchaseQunatity,2",30,'NONE',0),
       ("당근마켓 온도 100도","당근마켓에 당근 팔아요^^","AccProductPurchaseQunatity,3",10,"FRAME",2),
       ("무트코인은 떡상한다.","대량 매수가 답이다","AccProductPurchaseQunatity,4",100,"TITLE",5),
       ("토마토","거꾸로 말해도 토마토","AccProductPurchaseQunatity,5",100,"TITLE",3)
;
