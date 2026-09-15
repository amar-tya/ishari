# Todo: Chapter Media (Audio) CRUD

- [ ] Task: Supabase bucket `chapter-media` + RLS policies
  - Acceptance: bucket public, 10MB limit, audio mime whitelist, 4 policies (select public, insert/update/delete authenticated)
  - Verify: query `storage.buckets` & `pg_policies`
  - Files: remote migration only

- [ ] Task: Core layer — entity + DTO
  - Acceptance: `ChapterMediaEntity`, `ChapterMediaEntityList`, Create/Update/List DTO types compile
  - Verify: `bunx tsc --noEmit`
  - Files: src/core/entities/chapter-media.entity.ts, src/core/entities/index.ts, src/application/dto/chapter-media.dto.ts, src/application/dto/index.ts

- [ ] Task: Infrastructure — model, mapper, repository
  - Acceptance: `ChapterMediaRepository` implements upload (compress-free, raw file upload)/update/delete/getById/getAll mirroring `VerseMediaRepository`, uses bucket `chapter-media`
  - Verify: `bunx tsc --noEmit`
  - Files: src/infrastructure/models/chapter-media.model.ts, src/infrastructure/mappers/chapter-media.mapper.ts, src/application/ports/repository/chapter-media.repository.port.ts, src/application/ports/repository/index.ts, src/infrastructure/repositories/chapter-media.repository.ts, src/infrastructure/repositories/index.ts

- [ ] Task: Application — use cases
  - Acceptance: upload/update/delete/find/list use cases, each one-liner delegating to repository
  - Verify: `bunx tsc --noEmit`
  - Files: src/application/usecases/chapter-media/*.ts, src/application/usecases/index.ts

- [ ] Task: DI wiring
  - Acceptance: repository + 5 use cases constructed & exported from container
  - Verify: `bunx tsc --noEmit`
  - Files: src/di/container.ts

- [ ] Task: Presentation — hook + view-model
  - Acceptance: `useChapterMedia` hook wraps use cases; `useChapterMediaViewModel` manages list/CRUD state mirroring `VerseMediaViewModel`
  - Verify: `bunx tsc --noEmit`
  - Files: src/presentation/hooks/useChapterMedia.ts, src/presentation/hooks/index.ts, src/presentation/view-models/chapter-media/*, src/presentation/view-models/index.ts

- [ ] Task: Presentation — components
  - Acceptance: Toolbar (search + hadi filter + upload button), List (table w/ AudioPlayer reuse, edit/delete actions), UploadForm (book→chapter cascade select, hadi select w/ inline create, FFmpeg opus compression, rodad_cabang text input, description)
  - Verify: `bun lint`
  - Files: src/presentation/components/chapter-media/ChapterMediaToolbar.tsx, ChapterMediaList.tsx, ChapterMediaUploadForm.tsx, index.ts

- [ ] Task: Page route + sidebar nav
  - Acceptance: `/chapter-media` page works, listed in sidebar under same group as Verse Media
  - Verify: manual browser check — create/edit/delete/list/play audio
  - Files: src/app/(auth)/chapter-media/page.tsx, src/presentation/components/layouts/Sidebar.tsx
