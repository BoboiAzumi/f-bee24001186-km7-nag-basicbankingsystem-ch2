-- Transaction deposit
BEGIN TRANSACTION;
    INSERT INTO transaksi (id_akun, jenis_transaksi, jumlah_transaksi)
    VALUES ($1, 'deposit', $2);
    
    UPDATE akun SET saldo = (saldo + $2) WHERE id_akun = $1;
COMMIT TRANSACTION;

-- Procedure withdraw
CREATE OR REPLACE PROCEDURE withdraw(IN id_akun_arg INT, IN jumlah_transaksi_arg INT)
LANGUAGE plpgsql
AS $$
DECLARE
    saldo_akun INT;
BEGIN
    SELECT saldo INTO saldo_akun
    FROM akun
    WHERE id_akun = id_akun_arg;

    IF saldo_akun >= jumlah_transaksi_arg THEN
        INSERT INTO transaksi (id_akun, jenis_transaksi, jumlah_transaksi)
            VALUES (id_akun_arg, 'withdraw', jumlah_transaksi_arg);
        UPDATE akun SET saldo = (saldo - jumlah_transaksi_arg) WHERE id_akun = id_akun_arg;
    END IF;
END;
$$;
CALL withdraw($1, $2)