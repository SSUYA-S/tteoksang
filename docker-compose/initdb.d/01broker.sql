create table if not exists broker(
    broker_level tinyint unsigned primary key,
    broker_name varchar(90),
    broker_content text,
    broker_upgrade_fee int,
    broker_fee int
);

insert into broker(broker_level, broker_name, broker_content, broker_upgrade_fee, broker_fee)
values (1,"낡은 구멍 가게","집 근처 낡은 구멍 가게",0,20),
       (2,"구멍 가게","우리 동네 구멍 가게",100,18),
       (3,"2층 구멍 가게","조금 큰 구멍가게",200,16),
       (4,"슈퍼마켓","동네 슈퍼마켓",300,14),
       (5,"슈퍼 체인점","슈퍼 체인점",400,12),
       (6,"고급 슈퍼","유기농 제품 팔아요",500,10),
       (7,"슈퍼 고급 슈퍼","슈퍼가 두 배!",600,8),
       (8,"마트","마트.. 다녀오셨어요?",800,6),
       (9,"외국 마트","월드 와이드",900,4);


