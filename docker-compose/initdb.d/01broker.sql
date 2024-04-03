create table if not exists broker(
    broker_level tinyint unsigned primary key,
    broker_name varchar(90),
    broker_content text,
    broker_upgrade_fee int,
    broker_fee int
);

insert into broker(broker_level, broker_name, broker_content, broker_upgrade_fee, broker_fee)
values (1,"낡은 구멍 가게","집 근처 낡은 구멍 가게",100000,10),
       (2,"구멍 가게","우리 동네 구멍 가게",300000,9),
       (3,"2층 구멍 가게","조금 큰 구멍가게",500000,8),
       (4,"슈퍼마켓","동네 슈퍼마켓",1000000,7),
       (5,"슈퍼 체인점","슈퍼 체인점",1500000,6),
       (6,"고급 슈퍼","유기농 제품 팔아요",2300000,5),
       (7,"슈퍼 고급 슈퍼","슈퍼가 두 배!",3000000,4),
       (8,"마트","마트.. 다녀오셨어요?",4000000,3),
       (9,"외국 마트","월드 와이드",5000000,2);


