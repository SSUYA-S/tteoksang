create table if not exists resource_checksum
(
    resource_name    varchar(20) primary key,
    checksum_value char(36) not null
);