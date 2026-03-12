import { CreateBookDTO, UpdateBookDTO } from "@/application";
import { BookEntityList } from "@/core/entities";

/**
 * Book List ViewModel State
 */
export interface BookViewModelState {
  isLoading: boolean;
  error: string | null;
  bookList: BookEntityList | null;
}

/**
 * Book List ViewModel Actions
 */
export interface BookViewModelActions {
  // List books
  getBookList: (page?: number, search?: string, options?: { silent?: boolean }) => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;

  // Create book
  storeBook: (dto: CreateBookDTO) => Promise<boolean>;

  // Update book
  updateBook: (id: number, dto: UpdateBookDTO) => Promise<boolean>;

  // Delete book
  removeBook: (id: number) => Promise<boolean>;
}

/**
 * Book List ViewModel Return Type
 */
export type BookViewModel = BookViewModelState & BookViewModelActions;
