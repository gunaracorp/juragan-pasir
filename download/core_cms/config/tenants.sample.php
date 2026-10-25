<?php
/**
 * PETA TENANT — "Satu Kode, Banyak Kerajaan" (Masterplan BAB 4.3)
 * Installer menulis file ini otomatis untuk domain pertama.
 * Tambahkan domain baru dengan pola yang sama, lalu buat tabelnya
 * lewat /install (mode "Tambah Tenant") di domain manapun.
 *
 * 'prefix' = prefiks tabel di database akun hosting (harus unik & diakhiri _)
 * 'theme'  = nama folder tema di themes/
 */
return [
    // 'domainku.com' => ['prefix' => 't1_', 'name' => 'Judul Situs', 'theme' => 'juragan'],
    // 'www.domainku.com' tetap tercakup otomatis (varian www/non-www dicocokkan).
    // 'toko-lain.com' => ['prefix' => 't2_', 'name' => 'Toko Lain', 'theme' => 'juragan'],
    'default' => ['prefix' => 'main_', 'name' => 'Juragan Core', 'theme' => 'juragan'],
];
