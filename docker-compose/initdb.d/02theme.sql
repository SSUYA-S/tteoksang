create table if not exists theme
(
    theme_id   tinyint unsigned primary key auto_increment,
    theme_name varchar(90) not null
);

insert into theme(theme_name)
values ("화창한 집"),
       ("바다가 보이는 집"),
       ("기본 테마");

