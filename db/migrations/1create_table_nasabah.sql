-- create ENUM
CREATE TYPE jenis_kelamin_enum as ENUM('Laki-laki', 'Perempuan');

-- migration:up
CREATE TABLE IF NOT EXISTS nasabah(
    id_nasabah SERIAL PRIMARY KEY,
    nik VARCHAR(20) NOT NULL,
    nama VARCHAR(120) NOT NULL,
    tempat_lahir VARCHAR(120) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin jenis_kelamin_enum NOT NULL,
    alamat TEXT NOT NULL,
    email VARCHAR(120) NOT NULL,
    no_hp CHAR(20) NOT NULL
)

-- create index
CREATE INDEX IF NOT EXISTS nasabah_idx ON nasabah(nama);

-- drop index
DROP INDEX nasabah_idx;

-- migration:down
DROP TABLE IF EXISTS nasabah;

-- delete ENUM
DROP TYPE IF EXISTS jenis_kelamin_enum;