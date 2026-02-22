# Agent Rules - Ishari Admin Next

## Project Overview

Admin panel dengan **Next.js 16** dan **Clean Architecture**.

## Architecture Layers

### 1. Core (Domain Layer) - `src/core/`

Pusat business logic, **tidak boleh depend ke layer lain**.

| Folder      | Isi                                                 |
| ----------- | --------------------------------------------------- |
| `entities/` | Domain entities (BookEntity, AuthEntity)            |
| `errors/`   | Custom error classes (ValidationError, ServerError) |
| `types/`    | Shared types (Result, ApiResponse)                  |

### 2. Application Layer - `src/application/`

Use cases dan port definitions.

| Folder              | Isi                                                          |
| ------------------- | ------------------------------------------------------------ |
| `usecases/`         | Business logic per feature (LoginUseCase, CreateBookUseCase) |
| `ports/repository/` | Repository interfaces (IBookRepository)                      |
| `ports/service/`    | Service interfaces (IAuthService)                            |
| `dto/`              | Data Transfer Objects (CreateBookDTO, UpdateBookDTO)         |

### 3. Infrastructure Layer - `src/infrastructure/`

Implementasi external services.

| Folder          | Isi                                         |
| --------------- | ------------------------------------------- |
| `repositories/` | Repository implementations (BookRepository) |
| `services/`     | Service implementations (AuthService)       |
| `http/`         | HTTP client configuration                   |
| `mappers/`      | API response to Entity mappers              |
| `models/`       | API response types (snake_case)             |

### 4. Presentation Layer - `src/presentation/`

UI components dan state management.

| Folder         | Isi                                   |
| -------------- | ------------------------------------- |
| `components/`  | Reusable UI components                |
| `hooks/`       | Custom React hooks (useBook, useAuth) |
| `view-models/` | Per-feature state management          |
| `stores/`      | Global state                          |

### 5. DI Container - `src/di/`

Dependency injection wiring.

---

## Coding Rules

### ✅ DO

1. **Use Cases**: Selalu akses repository via Use Case, bukan langsung

   ```typescript
   // ✅ Benar
   const { createBookUseCase } = container;
   createBookUseCase.execute(dto);
   ```

2. **DTOs**: Gunakan DTO untuk input user, bukan Entity

   ```typescript
   // ✅ Benar
   async execute(dto: CreateBookDTO): Promise<Result<BookEntity>>
   ```

3. **Naming Convention**:
   - Entity: `camelCase` (publishedYear, createdAt)
   - API Model: `snake_case` (published_year, created_at)
   - Mapper handles conversion

4. **Result Type**: Gunakan `Result<T>` untuk return type, bukan throw error

   ```typescript
   return success(data); // ✅
   return failure(error); // ✅
   throw new Error(); // ❌
   ```

5. **Mappers**: Convert API response (snake_case) ke Entity (camelCase)

   ```typescript
   BookMapper.toDomain(apiResponse);
   BookMapper.toEntityList(paginatedResponse);
   ```

6. **Instruksi Update Otomatis**: Jika kamu membuat Folder Utama atau Modul baru, kamu WAJIB mengupdate bagian 'Project Map' di file ini
7. **Validasi Langkah**: Cek AGENT.md bagian Project Map. Tentukan di folder mana kamu akan meletakkan file baru ini sebelum menulis kode.

### ❌ DON'T

1. **Jangan** import infrastructure dari core/application layer
2. **Jangan** bypass Use Case (langsung akses repository dari hook)
3. **Jangan** pakai Entity sebagai input parameter (gunakan DTO)
4. **Jangan** hardcode API response type di repository (gunakan models/)

---

## File Creation Patterns

### New Feature Checklist

1. **Entity** → `src/core/entities/{feature}.entity.ts`
2. **DTO** → `src/application/dto/{feature}.dto.ts`
3. **Repository Port** → `src/application/ports/repository/{feature}.repository.port.ts`
4. **Use Case** → `src/application/usecases/{feature}/`
5. **API Model** → `src/infrastructure/models/{feature}.model.ts`
6. **Mapper** → `src/infrastructure/mappers/{feature}.mapper.ts`
7. **Repository** → `src/infrastructure/repositories/{feature}.repository.ts`
8. **Hook** → `src/presentation/hooks/use{Feature}.ts`
9. **Register DI** → `src/di/container.ts`

---

## Commands

```bash
bun dev          # Development server
bun build        # Production build
bun test         # Run tests
bun lint         # ESLint
```
