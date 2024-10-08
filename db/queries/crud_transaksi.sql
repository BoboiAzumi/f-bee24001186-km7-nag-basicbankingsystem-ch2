INSERT INTO transaksi (id_akun, jenis_transaksi, jumlah_transaksi, tanggal_transaksi)
VALUES
(3, 'deposit', 1000000, '2024-10-01'),
(2, 'withdraw', 500000, '2024-10-02'),
(2, 'deposit', 1500000, '2024-10-03'),
(3, 'deposit', 2000000, '2024-10-04'),
(4, 'withdraw', 1000000, '2024-10-05'),
(5, 'withdraw', 500000, '2024-10-06');

-- QUERY SELECT ALL
SELECT * FROM transaksi;

-- QUERY SELECT WHERE (jenis_transaksi = deposit, withdraw)
SELECT * FROM transaksi WHERE jenis_transaksi = $0;
SELECT * FROM transaksi WHERE jumlah_transaksi > $1;

-- QUERY SELECT DESC
SELECT * FROM transaksi ORDER BY id_transaksi DESC;

-- QUERY SELECT ASC
SELECT * FROM transaksi ORDER BY id_transaksi ASC;

-- QUERY UPDATE
UPDATE transaksi SET jumlah_transaksi = $1 where id_transaksi = $2;

-- QUERY DELETE
DELETE FROM transaksi WHERE id_transaksi = $1