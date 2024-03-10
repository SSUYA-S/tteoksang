CREATE TABLE IF NOT EXISTS user (
    user_id char(36) primary key,
    user_email varchar(100) not null,
    user_nickname varchar(50) not null,
    created_at timestamp not null default current_timestamp(),
    deleted_at timestamp null default null
);
