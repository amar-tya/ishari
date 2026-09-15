# Plan: Hadi Photo Upload

## Objective
Ganti field "Photo URL" (text input) di form Hadi (create/edit) jadi upload file gambar langsung ke Supabase Storage. Ikut pola `verse-media` yang udah ada (upload file di repository layer, DTO bawa `File` langsung).

## Assumptions
1. Bucket baru: `hadi-photos` — public, mime `image/jpeg,image/png,image/webp,image/gif`, limit 5MB. Nama ikut konvensi bucket lain (`verse-media`, `book-pages`).
2. Policy storage: public SELECT, authenticated INSERT/UPDATE/DELETE — sama persis pola `verse-media`.
3. Photo tetap optional di create & edit (match field lama yg optional).
4. Edit: kosongin file input = foto lama gak berubah (sama kayak VerseMediaUploadForm).
5. Ganti foto saat edit: file lama di storage DIHAPUS otomatis (best-effort, non-blocking) sebelum/sesudah upload foto baru — beda dari verse-media (yg orphan), krn user minta storage bersih.
6. Delete Hadi: best-effort hapus file storage (extract path dari `image_url`), non-blocking kalau gagal — sama pola verse-media delete.
7. DTO tetap terima `image_url?: string` (dipakai internal repo buat delete-path extraction / kompatibilitas), tambah `photo?: File` baru buat upload. Form gak lagi expose text input url manual.
8. Storage path: `{slug-nama-hadi}-{timestamp}.{ext}` di root bucket (hadi gak punya chapter/category context kayak verse-media).

## Components & Order
1. Supabase: create bucket `hadi-photos` + 4 RLS policies (mirror verse-media) — migration via MCP.
2. `src/application/dto/hadi.dto.ts` — tambah `photo?: File` ke Create/UpdateHadiDTO.
3. `src/infrastructure/repositories/hadi.repository.ts` — create()/update() upload file ke bucket kalau `photo` ada, baru insert/update `image_url`. delete() best-effort remove storage object.
4. `src/presentation/components/hadi/HadiForm.tsx` — ganti `Input` Photo URL jadi file input (accept image/*), preview foto existing pas edit, validasi ukuran client-side.

## Risks
- Bucket create di Supabase project shared (ISHARI) — remote, tapi reversible (bucket bisa dihapus kalau salah).
- Old photo orphan di storage saat replace — acceptable, sama kayak verse-media, no scope creep buat cleanup job.

## Verification
- `bun lint` clean di file yg diubah.
- Manual: create Hadi baru w/ foto → cek row `image_url` keisi URL publik & file muncul di bucket `hadi-photos`.
- Manual: edit Hadi ganti foto → url berubah, foto lama masih ada di storage (expected, no cleanup).
- Manual: edit Hadi tanpa pilih file baru → `image_url` gak berubah.
- Manual: delete Hadi → row hilang, storage object attempt delete gak error walau gagal (non-blocking).
