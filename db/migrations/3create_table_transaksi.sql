-- create ENUM
CREATE TYPE jenis_transaksi_enum as ENUM('deposit', 'withdraw');

CREATE TABLE IF NOT EXISTS transaksi(
    id_transaksi SERIAL PRIMARY KEY,
    id_akun INT NOT NULL,
    jenis_transaksi jenis_transaksi_enum NOT NULL,
    jumlah_transaksi INT NOT NULL,
    tanggal_transaksi DATE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_id_akun FOREIGN KEY (id_akun) REFERENCES akun(id_akun)
);

-- create index
CREATE INDEX IF NOT EXISTS transaksi_idx ON transaksi(jenis_transaksi, tanggal_transaksi);

-- drop index
DROP INDEX IF EXISTS transaksi_idx;

-- migration:down
DROP TABLE IF EXISTS transaksi;

-- drop jenis_transaksi_enum
DROP TYPE IF EXISTS jenis_transaksi_enum;