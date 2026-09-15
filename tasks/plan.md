# Plan: Chapter Media (Audio) CRUD

## Objective
Implement full CRUD buat tabel `chapter_media` (udah ada di Supabase, belum diimplementasi di codebase). Audio per-chapter (bukan per-verse kayak `verse_media`), simpan file ke Supabase Storage. Mekanisme identik `verse-media`: DTO bawa `File` langsung, repository upload ke bucket lalu insert row, form pakai FFmpeg buat kompresi audio ke opus sebelum upload.

## Schema (sudah ada, read-only reference)
```
chapter_media
  id            serial pk
  chapter_id    int not null → chapters(id)
  hadi_id       int null → hadi(id)
  media_url     text not null
  file_size     int null
  duration      int null        -- gak diisi (verse_media juga gak isi ini, no scope creep)
  description   text null
  rodad_cabang  varchar null    -- free text, no check constraint, tabel kosong (0 rows) jadi gak ada existing value buat referensi
  deleted_at    timestamptz null
  created_at / updated_at
```
RLS tabel udah aktif & permissive (`authenticated` ALL, `anon` SELECT) — gak perlu ubah.

## Assumptions
1. Bucket baru: `chapter-media` — public, 10MB limit, audio mime whitelist — copy persis config bucket `verse-media`.
2. Storage RLS: public SELECT, authenticated INSERT/UPDATE/DELETE — mirror `verse-media`.
3. Storage path: `{hadiSlug}/{chapterSlug}/{categorySlug}/{timestamp}-{filename}.opus` — sama pola verse-media, tinggal hilangin level verse.
4. Form kompresi audio pake FFmpeg → opus, sama persis logic yg ada di `VerseMediaUploadForm.tsx` (duplicate function, bukan extract shared util — ikutin pola existing codebase yg juga gak share function ini).
5. `rodad_cabang` — free text Input (optional), gak ada enum krn no check constraint & no existing data.
6. `hadi_id` optional, sama UX kayak verse-media (SearchableSelect + tombol "Tambah Hadi Baru" inline).
7. Delete: hard delete row (matches pola `verse_media`/`hadi` delete()) + best-effort delete file storage, non-blocking kalau gagal.
8. `duration` field dibiarin null (verse_media juga gak isi ini — no scope creep nambah audio-duration extraction).
9. Update: ganti file audio re-upload ke path baru (timestamp beda), file lama TIDAK dihapus — sama persis behavior verse-media update sekarang (orphan dibiarin, konsisten).
10. Sidebar nav: entry baru "Chapter Media" di grup yang sama kayak "Verse Media", reuse icon `VerseMediaIcon` (gak bikin icon baru).

## Components & Order (mirror struktur `verse-media` vertical slice)
1. Supabase: bucket `chapter-media` + 4 RLS storage policies — migration via MCP.
2. `src/core/entities/chapter-media.entity.ts` — `ChapterMediaEntity`, `ChapterMediaEntityList`.
3. `src/application/dto/chapter-media.dto.ts` — Create/Update/List DTO (`file: File`, `storagePath: string`, dst — sama shape verse-media dto minus `verseId`/`mediaType`, plus `rodadCabang`).
4. `src/infrastructure/models/chapter-media.model.ts` — snake_case API response type.
5. `src/infrastructure/mappers/chapter-media.mapper.ts`.
6. `src/application/ports/repository/chapter-media.repository.port.ts` — `IChapterMediaRepository`.
7. `src/infrastructure/repositories/chapter-media.repository.ts` — upload/update/delete/getById/getAll, pola sama persis `VerseMediaRepository`.
8. `src/application/usecases/chapter-media/*` — upload/update/delete/find/list use case (5 file + index), copy pola verse-media usecases.
9. `src/di/container.ts` — wire repository + 5 use cases.
10. `src/presentation/hooks/useChapterMedia.ts` + daftar di `hooks/index.ts`.
11. `src/presentation/view-models/chapter-media/ChapterMediaViewModel.ts` + `.types.ts` + index, daftar di `view-models/index.ts`.
12. `src/presentation/components/chapter-media/` — `ChapterMediaToolbar.tsx`, `ChapterMediaList.tsx` (reuse `AudioPlayer` dari verse-media, gak duplicate), `ChapterMediaUploadForm.tsx` (FFmpeg compress + book→chapter cascade select, gak ada verse level), `index.ts`.
13. `src/app/(auth)/chapter-media/page.tsx` — copy struktur `verse-media/page.tsx`.
14. `src/presentation/components/layouts/Sidebar.tsx` — tambah nav item.

## Risks
- Bucket create di Supabase project shared (ISHARI) — remote tapi reversible.
- FFmpeg WASM compression logic ke-duplicate 2x (verse-media & chapter-media) — sesuai konvensi existing codebase yg emang gak extract shared util buat ini, jadi bukan regresi, cuma bukan best-practice DRY. Gak masalah, ikutin existing pattern.

## Verification
- `bun lint` clean di semua file baru.
- `bunx tsc --noEmit` clean (gak nambah error baru).
- Manual: create chapter media baru w/ file audio → row `chapter_media` keisi, file muncul di bucket `chapter-media`.
- Manual: edit ganti file → `media_url` berubah.
- Manual: delete → row hilang, storage delete attempt gak throw.
- Manual: list + filter by hadi/chapter jalan, AudioPlayer bisa play.
