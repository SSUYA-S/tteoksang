create table honor
(
    user_id      CHAR(36)     not null,
    title_id     INT unsigned not null,
    honored_date TIMESTAMP    not null default current_timestamp,
    PRIMARY KEY (`user_id`, `title_id`),
    CONSTRAINT `honor_user_constraint` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
    CONSTRAINT `honor_title_constraint` FOREIGN KEY (`title_id`) REFERENCES `title` (`title_id`)
);