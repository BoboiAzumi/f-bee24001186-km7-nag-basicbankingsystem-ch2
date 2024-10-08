-- create ENUM
CREATE TYPE tipe_akun_enum as ENUM('basic', 'premium', 'bisnis');

-- migrate:up
CREATE TABLE IF NOT EXISTS akun(
    id_akun SERIAL PRIMARY KEY,
    id_nasabah INT NOT NULL,
    username CHAR(32),
    pin_keamanan CHAR(6),
    tipe_akun tipe_akun_enum NOT NULL,
    saldo INT NOT NULL,
    CONSTRAINT fk_nasabah FOREIGN KEY (id_nasabah) REFERENCES nasabah(id_nasabah)
)

-- create index
CREATE INDEX IF NOT EXISTS akun_idx ON akun(username, saldo, tipe_akun)

-- drop index
DROP INDEX IF EXISTS akun_idx;

-- migration:down
DROP TABLE IF EXISTS akun;

-- delete ENUM
DROP TYPE IF EXISTS tipe_akun_enum