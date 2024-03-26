create table user
(
    user_id               CHAR(36) primary key,
    user_google_id        CHAR(25) unique  not null,
    user_email            VARCHAR(40) unique,
    user_google_name      VARCHAR(45) unique,
    user_nickname         VARCHAR(45) unique,
    user_profile_icon_id  TINYINT unsigned not null,
    user_profile_frame_id TINYINT unsigned not null,
    user_theme_id         TINYINT unsigned not null,
    user_title_id         INT unsigned     not null,
    created_at            TIMESTAMP        not null default current_timestamp,
    deleted_at            TIMESTAMP        null,
    career                INT,
    CONSTRAINT `profile_icon_constraint` FOREIGN KEY (`user_profile_icon_id`) REFERENCES `profile_icon` (`profile_icon_id`),
    CONSTRAINT `profile_frame_constraint` FOREIGN KEY (`user_profile_frame_id`) REFERENCES `profile_frame` (`profile_frame_id`),
    CONSTRAINT `theme_constraint` FOREIGN KEY (`user_theme_id`) REFERENCES `theme` (`theme_id`),
    CONSTRAINT `title_constraint` FOREIGN KEY (`user_title_id`) REFERENCES `title` (`title_id`)
);