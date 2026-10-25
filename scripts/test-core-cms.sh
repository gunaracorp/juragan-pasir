#!/bin/bash
# E2E SMOKE TEST — Core CMS v1 (Juragan Pasir tenant pilot)
PHP=/home/z/php-bin/php
CORE=/home/z/my-project/download/core_cms
PORT=8099
BASE="http://127.0.0.1:$PORT"
JAR=/home/z/my-project/scripts/cookies.txt
PASS=0; FAIL=0

say()  { echo -e "\n\033[1;36m== $1 ==\033[0m"; }
ok()   { PASS=$((PASS+1)); echo "  ✅ $1"; }
bad()  { FAIL=$((FAIL+1)); echo "  ❌ $1"; }
check(){ if echo "$2" | grep -q "$3"; then ok "$1"; else bad "$1 (tidak menemukan: $3)"; echo "---- output awal:"; echo "$2" | head -5; fi; }

# Reset kondisi uji
rm -f "$JAR" $CORE/storage/install.lock $CORE/config/config.php $CORE/config/tenants.php $CORE/storage/cms.sqlite*
rm -rf $CORE/storage/cache $CORE/storage/uploads
mkdir -p $CORE/storage/cache $CORE/storage/uploads $CORE/storage/logs

# Bunuh server lama yang masih memegang port (hindari state basi)
pkill -f "dev-server.php" 2>/dev/null; sleep 0.6

say "1. Nyalakan server dev"
$PHP -S 127.0.0.1:$PORT $CORE/dev-server.php > /home/z/my-project/scripts/dev-server.log 2>&1 &
SRV=$!
sleep 1
curl -s -o /dev/null -w "server status: %{http_code}\n" $BASE/

say "2. Halaman installer tampil"
R=$(curl -s -b "$JAR" -c "$JAR" $BASE/install)
check "GET /install 200 + form" "$R" "Instalasi Awal"

say "3. Ambil CSRF lalu POST instalasi (SQLite mode)"
CSRF=$(echo "$R" | grep -oP 'name="_csrf" value="\K[^"]+' | head -1)
R=$(curl -s -b "$JAR" -c "$JAR" -X POST $BASE/install \
  -d "_csrf=$CSRF&driver=sqlite&db_host=&db_name=&db_user=&db_pass=&prefix=t1_&site_title=Juragan+Pasir+Galunggung&admin_user=admin&admin_pass=juragan2026")
check "Instalasi sukses" "$R" "Berhasil"
check "Tabel dibuat" "$R" "t1_"
check "Seed konten" "$R" "Seed konten Juragan Pasir"
check "Installer terkunci" "$R" "terkunci"

say "4. Beranda publik + SEO"
H1=$(curl -s -D - -o /dev/null $BASE/)
check "Header X-Core-Cache MISS" "$H1" "X-Core-Cache: MISS"
R=$(curl -s $BASE/)
check "Hero tampil" "$R" "Pasir Galunggung"
check "Meta title" "$R" "<title>Juragan Pasir Galunggung"
check "Canonical" "$R" "rel=\"canonical\""
check "OG tag" "$R" "property=\"og:title\""
check "JSON-LD WebSite" "$R" '"@type":"WebSite"'
check "JSON-LD LocalBusiness" "$R" '"@type":"LocalBusiness"'
check "JSON-LD FAQPage" "$R" '"@type":"FAQPage"'
check "Grid produk otomatis" "$R" "Pasir Galunggung Cor"
check "Grid testimoni otomatis" "$R" "Budi Santoso"
check "FAQ accordion" "$R" "<details"
check "Animasi reveal class" "$R" "class=\"card prod reveal\""
check "Counter data-count" "$R" "data-count=\"12480\""
check "Tombol WA" "$R" "wa.me/6281316516524"

say "5. Cache HIT pada kunjungan kedua"
H=$(curl -s -D - -o /dev/null $BASE/)
check "Cache HIT" "$H" "X-Core-Cache: HIT"

say "6. Halaman tentang + artikel + 404"
R=$(curl -s $BASE/tentang-kami)
check "Halaman tentang" "$R" "Tambang di Tangan"
R=$(curl -s $BASE/artikel/pasir-silika-vulkanik)
check "Detail produk" "$R" "SiO2"
check "JSON-LD Article" "$R" '"@type":"Article"'
S=$(curl -s -o /dev/null -w "%{http_code}" $BASE/tidak-ada-xyz)
[ "$S" = "404" ] && ok "404 status benar" || bad "404 status (dapat: $S)"

say "7. Sitemap & robots"
R=$(curl -s $BASE/sitemap.xml)
check "Sitemap XML" "$R" "<urlset"
check "Sitemap isi produk" "$R" "/artikel/pasir-galunggung-cor"
R=$(curl -s $BASE/robots.txt)
check "robots.txt" "$R" "Sitemap:"

say "8. Admin: proteksi + login"
S=$(curl -s -o /dev/null -w "%{http_code}" -D /home/z/my-project/scripts/h.txt $BASE/admin)
check "Redirect ke login" "$(cat /home/z/my-project/scripts/h.txt)" "Location: /admin/login"
R=$(curl -s -b "$JAR" -c "$JAR" $BASE/admin/login)
CSRF=$(echo "$R" | grep -oP 'name="_csrf" value="\K[^"]+' | head -1)
R=$(curl -s -b "$JAR" -c "$JAR" -X POST $BASE/admin/login -d "_csrf=$CSRF&username=admin&password=juragan2026" -D - -o /dev/null)
check "Login sukses → /admin" "$R" "Location: /admin"
R=$(curl -s -b "$JAR" -c "$JAR" $BASE/admin)
check "Dashboard tampil" "$R" "Kesehatan SEO"
check "Statistik konten" "$R" "Artikel"

say "9. Edit konten via admin → cache purge → frontend berubah"
R=$(curl -s -b "$JAR" -c "$JAR" $BASE/admin/pages)
PID=$(echo "$R" | grep -oP '/admin/pages/\K\d+' | head -1)
R=$(curl -s -b "$JAR" -c "$JAR" $BASE/admin/pages/$PID/edit)
CSRF=$(echo "$R" | grep -oP 'name="_csrf" value="\K[^"]+' | head -1)
R=$(curl -s -b "$JAR" -c "$JAR" -X POST $BASE/admin/pages/save \
  --data-urlencode "_csrf=$CSRF" --data-urlencode "id=$PID" \
  --data-urlencode "title=Beranda Uji" --data-urlencode "slug=" \
  --data-urlencode "content=<h1 class='reveal'>KONTEN-BARU-XYZ</h1>" \
  --data-urlencode "is_home=1" --data-urlencode "is_published=1" \
  --data-urlencode "meta_title=" --data-urlencode "meta_description=" --data-urlencode "og_image=" \
  --data-urlencode "sort_order=0" -D - -o /dev/null)
check "Simpan sukses → redirect" "$R" "Location: /admin/pages"
R=$(curl -s $BASE/)
check "Frontend langsung berubah (cache purge bekerja)" "$R" "KONTEN-BARU-XYZ"

say "10. Media + pengaturan"
CSRF=$(curl -s -b "$JAR" -c "$JAR" $BASE/admin/media | grep -oP 'name="_csrf" value="\K[^"]+' | head -1)
printf 'PNG' > /home/z/my-project/scripts/fake.png
/home/z/php-bin/php -r 'file_put_contents("/home/z/my-project/scripts/fake.png", base64_decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="));'
R=$(curl -s -b "$JAR" -c "$JAR" -X POST $BASE/admin/media/upload -F "_csrf=$CSRF" -F "file=@/home/z/my-project/scripts/fake.png;type=image/png" -D - -o /dev/null)
check "Upload media sukses" "$R" "Location: /admin/media"
MF=$(curl -s -b "$JAR" $BASE/admin/media | grep -oP '/media/\K[a-z0-9-]+\.png' | head -1)
S=$(curl -s -o /dev/null -w "%{http_code}" $BASE/media/$MF)
[ "$S" = "200" ] && ok "Media tersaji 200" || bad "Media tersaji (status $S)"

say "11. Tambah tenant (mode 2)"
R=$(curl -s -b "$JAR" -c "$JAR" $BASE/install)
CSRF=$(echo "$R" | grep -oP 'name="_csrf" value="\K[^"]+' | head -1)
R=$(curl -s -b "$JAR" -c "$JAR" -X POST $BASE/install \
  -d "_csrf=$CSRF&tenant_name=Toko+Kedua&prefix=t2_&admin_user=admin&admin_pass=juragan2026")
check "Tenant kedua dibuat" "$R" "Toko Kedua"

say "12. Logout & proteksi kembali"
CSRF=$(curl -s -b "$JAR" -c "$JAR" $BASE/admin | grep -oP 'name="_csrf" value="\K[^"]+' | head -1)
curl -s -b "$JAR" -c "$JAR" -X POST $BASE/admin/logout -d "_csrf=$CSRF" -o /dev/null
S=$(curl -s -o /dev/null -w "%{http_code}" -D /home/z/my-project/scripts/h.txt $BASE/admin)
check "Setelah logout: redirect login" "$(cat /home/z/my-project/scripts/h.txt)" "Location: /admin/login"

kill $SRV 2>/dev/null
echo ""
echo "=========================================="
echo "HASIL: $PASS lulus, $FAIL gagal"
echo "=========================================="
exit $FAIL
