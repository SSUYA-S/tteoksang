create table if not exists title(
    title_id int primary key auto_increment,
    title_name varchar(300) not null,
    title_content text
);

insert into title(title_name, title_content)
VALUES ("얘 봄감자가 맛있단다","느이집엔 이런거 없지?");