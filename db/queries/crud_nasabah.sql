-- QUERY INSERT
INSERT INTO nasabah (nik, nama, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, email, no_hp)
VALUES
('1234567890123456', 'Andi Wijaya', 'Jakarta', '1990-01-15', 'Laki-laki', 'Jl. Merdeka No. 123, Jakarta', 'andi.wijaya@example.com', '081234567890'),
('2345678901234567', 'Budi Santoso', 'Bandung', '1985-03-22', 'Laki-laki', 'Jl. Braga No. 45, Bandung', 'budi.santoso@example.com', '081234567891'),
('3456789012345678', 'Citra Dewi', 'Surabaya', '1992-05-30', 'Perempuan', 'Jl. Tunjungan No. 67, Surabaya', 'citra.dewi@example.com', '081234567892'),
('4567890123456789', 'Deni Saputra', 'Medan', '1988-07-18', 'Laki-laki', 'Jl. Gatot Subroto No. 89, Medan', 'deni.saputra@example.com', '081234567893'),
('5678901234567890', 'Eka Wulandari', 'Yogyakarta', '1995-09-12', 'Perempuan', 'Jl. Malioboro No. 10, Yogyakarta', 'eka.wulandari@example.com', '081234567894');

-- QUERY SELECT ALL
SELECT * FROM nasabah;

-- QUERY SELECT WHERE (jenis_kelamin = Laki-laki / Perempuan)
SELECT * FROM nasabah WHERE jenis_kelamin = $0;
SELECT * FROM nasabah WHERE nama like CONCAT('%', $1, '%');

-- QUERY SELECT DESC
SELECT * FROM nasabah ORDER BY id_nasabah DESC;

-- QUERY SELECT ASC
SELECT * FROM nasabah ORDER BY id_nasabah ASC;

-- QUERY UPDATE
UPDATE nasabah SET nama = $1 where id_nasabah = $2;

-- QUERY DELETE
DELETE FROM nasabah WHERE id_nasabah = $1