import {
  BulkDeleteChapterUseCase,
  CreateBookUseCase,
  CreateChapterUseCase,
  CreateVerseUseCase,
  DeleteBookUseCase,
  DeleteChapterUseCase,
  DeleteVerseUseCase,
  DeleteBulkVerseUseCase,
  FindChapterUseCase,
  FindVerseUseCase,
  GetAllBooksUseCase,
  LoginUseCase,
  UpdateBookUseCase,
  UpdateChapterUseCase,
  UpdateVerseUseCase,
  FindTranslationUseCase,
  CreateTranslationUseCase,
  UpdateTranslationUseCase,
  DeleteTranslationUseCase,
  BulkDeleteTranslationUseCase,
  GetTranslationDropdownUseCase,
  FindUserUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  BulkDeleteUserUseCase,
  FindBookmarkUseCase,
  CreateBookmarkUseCase,
  UpdateBookmarkUseCase,
  DeleteBookmarkUseCase,
  CreateHadiUseCase,
  UpdateHadiUseCase,
  DeleteHadiUseCase,
  FindHadiUseCase,
  ListHadiUseCase,
  GetDashboardStatsUseCase,
} from '@/application/usecases';
import {
  IBookRepository,
  IVerseRepositoryPort,
  ITranslationRepository,
  IUserRepository,
  IBookmarkRepositoryPort,
  IHadiRepository,
  IStatsRepository,
} from '@/application/ports';
import {
  AuthRepository,
  ChapterRepository,
  VerseRepository,
  TranslationRepository,
  UserRepository,
  BookmarkRepository,
  HadiRepository,
  StatsRepository,
} from '@/infrastructure/repositories';
import { AuthService } from '@/infrastructure/services';
import { BookRepository } from '@/infrastructure/repositories/book.repository';
import { IChapterRepository } from '@/application/ports/repository/chapter.repository.port';
import { supabaseBrowserClient } from '@/infrastructure/supabase';

/**
 * Dependency Injection Container
 *
 * Factory untuk membuat instances dengan dependencies yang di-inject.
 * Centralized wiring untuk seluruh aplikasi.
 */

// Services
const authService = new AuthService();

// Repositories
const authRepository = new AuthRepository(supabaseBrowserClient);
const bookRepository: IBookRepository = new BookRepository(
  supabaseBrowserClient
);
const chapterRepository: IChapterRepository = new ChapterRepository(
  supabaseBrowserClient
);
const verseRepository: IVerseRepositoryPort = new VerseRepository(
  supabaseBrowserClient
);
const translationRepository: ITranslationRepository = new TranslationRepository(
  supabaseBrowserClient
);
const userRepository: IUserRepository = new UserRepository(
  supabaseBrowserClient
);
const bookmarkRepository: IBookmarkRepositoryPort = new BookmarkRepository(
  supabaseBrowserClient
);
const hadiRepository: IHadiRepository = new HadiRepository(
  supabaseBrowserClient
);
const statsRepository: IStatsRepository = new StatsRepository(
  supabaseBrowserClient
);

// Use Cases - Auth
const loginUseCase = new LoginUseCase(authRepository, authService);

// Use Cases - Book
const createBookUseCase = new CreateBookUseCase(bookRepository);
const updateBookUseCase = new UpdateBookUseCase(bookRepository);
const deleteBookUseCase = new DeleteBookUseCase(bookRepository);
// const getBookByIdUseCase = new GetBookByIdUseCase(bookRepository);
const getAllBooksUseCase = new GetAllBooksUseCase(bookRepository);

// Use Cases - Chapter
const findChapterUseCase = new FindChapterUseCase(chapterRepository);
const createChapterUseCase = new CreateChapterUseCase(chapterRepository);
const updateChapterUseCase = new UpdateChapterUseCase(chapterRepository);
const deleteChapterUseCase = new DeleteChapterUseCase(chapterRepository);
const bulkDeleteChapterUseCase = new BulkDeleteChapterUseCase(
  chapterRepository
);

// Use Cases - Verse
const findVerseUseCase = new FindVerseUseCase(verseRepository);
const createVerseUseCase = new CreateVerseUseCase(verseRepository);
const updateVerseUseCase = new UpdateVerseUseCase(verseRepository);
const deleteVerseUseCase = new DeleteVerseUseCase(verseRepository);
const deleteBulkVerseUseCase = new DeleteBulkVerseUseCase(verseRepository);

// Use Cases - Translation
const findTranslationUseCase = new FindTranslationUseCase(
  translationRepository
);
const createTranslationUseCase = new CreateTranslationUseCase(
  translationRepository
);
const updateTranslationUseCase = new UpdateTranslationUseCase(
  translationRepository
);
const deleteTranslationUseCase = new DeleteTranslationUseCase(
  translationRepository
);
const bulkDeleteTranslationUseCase = new BulkDeleteTranslationUseCase(
  translationRepository
);
const getTranslationDropdownUseCase = new GetTranslationDropdownUseCase(
  translationRepository
);

// Use Cases - User
const findUserUseCase = new FindUserUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const bulkDeleteUserUseCase = new BulkDeleteUserUseCase(userRepository);

// Use Cases - Bookmark
const findBookmarkUseCase = new FindBookmarkUseCase(bookmarkRepository);
const createBookmarkUseCase = new CreateBookmarkUseCase(bookmarkRepository);
const updateBookmarkUseCase = new UpdateBookmarkUseCase(bookmarkRepository);
const deleteBookmarkUseCase = new DeleteBookmarkUseCase(bookmarkRepository);

// Use Cases - Hadi
const createHadiUseCase = new CreateHadiUseCase(hadiRepository);
const updateHadiUseCase = new UpdateHadiUseCase(hadiRepository);
const deleteHadiUseCase = new DeleteHadiUseCase(hadiRepository);
const findHadiUseCase = new FindHadiUseCase(hadiRepository);
const listHadiUseCase = new ListHadiUseCase(hadiRepository);

// Use Cases - Stats
const getDashboardStatsUseCase = new GetDashboardStatsUseCase(statsRepository);

/**
 * Container exports
 */
export const container = {
  // Use Cases - Auth
  loginUseCase,

  // Use Cases - Book
  createBookUseCase,
  updateBookUseCase,
  deleteBookUseCase,
  // getBookByIdUseCase,
  getAllBooksUseCase,

  // Use Cases - Chapter
  findChapterUseCase,
  createChapterUseCase,
  updateChapterUseCase,
  deleteChapterUseCase,
  bulkDeleteChapterUseCase,

  // Use Cases - Verse
  findVerseUseCase,
  createVerseUseCase,
  updateVerseUseCase,
  deleteVerseUseCase,
  deleteBulkVerseUseCase,

  // Use Cases - Translation
  findTranslationUseCase,
  createTranslationUseCase,
  updateTranslationUseCase,
  deleteTranslationUseCase,
  bulkDeleteTranslationUseCase,
  getTranslationDropdownUseCase,

  // Use Cases - User
  findUserUseCase,
  createUserUseCase,
  updateUserUseCase,
  deleteUserUseCase,
  bulkDeleteUserUseCase,

  // Use Cases - Bookmark
  findBookmarkUseCase,
  createBookmarkUseCase,
  updateBookmarkUseCase,
  deleteBookmarkUseCase,

  // Use Cases - Hadi
  createHadiUseCase,
  updateHadiUseCase,
  deleteHadiUseCase,
  findHadiUseCase,
  listHadiUseCase,

  // Use Cases - Stats
  getDashboardStatsUseCase,

  // Services
  authService,

  // Repositories
  authRepository,
  bookRepository,
  chapterRepository,
  verseRepository,
  translationRepository,
  userRepository,
  bookmarkRepository,
  hadiRepository,
} as const;

export type Container = typeof container;
