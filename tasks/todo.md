# Todo: Hadi Photo Upload

- [ ] Task: Create Supabase bucket `hadi-photos` + RLS policies
  - Acceptance: bucket public, 5MB limit, image mime whitelist, 4 policies (select public, insert/update/delete authenticated)
  - Verify: query `storage.buckets` & `pg_policies` show new rows
  - Files: (remote, no repo file — Supabase migration)

- [ ] Task: Add `photo?: File` to CreateHadiDTO/UpdateHadiDTO
  - Acceptance: types compile, `image_url` stays for internal use
  - Verify: `bun lint`
  - Files: src/application/dto/hadi.dto.ts

- [ ] Task: HadiRepository upload logic
  - Acceptance: create()/update() upload `photo` to `hadi-photos` bucket when present, set `image_url` from public URL; update() also best-effort deletes OLD photo storage object when replaced; delete() best-effort removes storage object from `image_url` path
  - Verify: `bun lint`, manual create/edit/delete test
  - Files: src/infrastructure/repositories/hadi.repository.ts

- [ ] Task: HadiForm.tsx — file upload UI
  - Acceptance: Photo URL text input replaced with `<input type="file" accept="image/*">`, shows current photo preview on edit, client-side size validation (5MB)
  - Verify: `bun lint`, manual form test in browser
  - Files: src/presentation/components/hadi/HadiForm.tsx
