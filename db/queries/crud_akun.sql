-- QUERY INSERT
INSERT INTO akun (id_nasabah, username, pin_keamanan, tipe_akun, saldo)
VALUES
(1, 'andi_wijaya', '123456', 'basic', 5000000),
(2, 'budi_santoso', '654321', 'basic', 3000000),
(3, 'citra_dewi', '111222', 'bisnis', 0),
(4, 'deni_saputra', '333444', 'premium', 7500000),
(5, 'eka_wulandari', '555666', 'bisnis', 2000000);

-- QUERY SELECT ALL
SELECT * FROM akun;

-- QUERY SELECT WHERE (tipe_akun = basic, premium, bisnis)
SELECT * FROM akun WHERE tipe_akun = $0;
SELECT * FROM akun WHERE saldo > $1;

-- QUERY SELECT DESC
SELECT * FROM akun ORDER BY id_akun DESC;

-- QUERY SELECT ASC
SELECT * FROM akun ORDER BY id_akun ASC;

-- QUERY UPDATE
UPDATE akun SET pin_keamanan = $1 where id_akun = $2;

-- QUERY DELETE
DELETE FROM akun WHERE id_akun = $1