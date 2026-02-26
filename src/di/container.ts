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
} from '@/application/usecases';
import {
  IBookRepository,
  IVerseRepositoryPort,
  ITranslationRepository,
  IUserRepository,
  IBookmarkRepositoryPort,
  IHadiRepository,
} from '@/application/ports';
import {
  AuthRepository,
  ChapterRepository,
  VerseRepository,
  TranslationRepository,
  UserRepository,
  BookmarkRepository,
  HadiRepository,
} from '@/infrastructure/repositories';
import { AuthService } from '@/infrastructure/services';
import { createHttpClient } from '@/infrastructure/http';
import { BookRepository } from '@/infrastructure/repositories/book.repository';
import { IChapterRepository } from '@/application/ports/repository/chapter.repository.port';

/**
 * Dependency Injection Container
 *
 * Factory untuk membuat instances dengan dependencies yang di-inject.
 * Centralized wiring untuk seluruh aplikasi.
 */

// Infrastructure
// Use /api/proxy as baseURL so all requests go through the proxy route
// which handles bearer token injection from HttpOnly cookies
const httpClient = createHttpClient({
  baseURL: '/api/proxy',
});

// Services
const authService = new AuthService();

// Repositories
const authRepository = new AuthRepository(httpClient);
const bookRepository: IBookRepository = new BookRepository(httpClient);
const chapterRepository: IChapterRepository = new ChapterRepository(httpClient);
const verseRepository: IVerseRepositoryPort = new VerseRepository(httpClient);
const translationRepository: ITranslationRepository = new TranslationRepository(
  httpClient
);
const userRepository: IUserRepository = new UserRepository(httpClient);
const bookmarkRepository: IBookmarkRepositoryPort = new BookmarkRepository(
  httpClient
);
const hadiRepository: IHadiRepository = new HadiRepository(httpClient);

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
