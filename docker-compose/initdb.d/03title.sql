create table if not exists title
(
    title_id      int unsigned primary key auto_increment,
    title_name    varchar(300) not null,
    title_content text
);

insert into title(title_name, title_content)
VALUES ('없음', '없음'),
       ('초심자', '초심자의 행운을 기원하며!'),
       ('농부', '농부 그 잡채'),
       ('토마토마토','기러기 토마토 역삼역 ... '),
       ('무(지성) 투자자','투자는 즐거워!'),
       ('당근판매왕','당근이지~');