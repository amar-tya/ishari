import {
  BookmarkCreateRequest,
  BookmarkFilter,
  BookmarkResponse,
  BookmarkUpdateRequest,
} from '@/application/dto';

export interface BookmarkViewModelState {
  isLoading: boolean;
  error: string | null;
  bookmarkList: BookmarkResponse | null;
}

export interface BookmarkViewModelActions {
  findBookmark: (criteria?: Partial<BookmarkFilter>, options?: { silent?: boolean }) => Promise<void>;
  createBookmark: (data: BookmarkCreateRequest) => Promise<boolean>;
  updateBookmark: (data: BookmarkUpdateRequest) => Promise<boolean>;
  deleteBookmark: (id: number) => Promise<boolean>;
  setCriteria: (criteria: BookmarkFilter) => void;
}

export type BookmarkViewModel = BookmarkViewModelState &
  BookmarkViewModelActions;
