import {
  VerseRequest,
  VerseResponse,
  VerseCreateRequest,
  VerseUpdateRequest,
} from '@/application/dto';

export interface VerseViewModelState {
  isLoading: boolean;
  error: string | null;
  verseList: VerseResponse | null;
}

export interface VerseViewModelActions {
  findVerse: (criteria?: Partial<VerseRequest>, options?: { silent?: boolean }) => Promise<void>;
  setCriteria: (criteria: VerseRequest) => void;
  createVerse: (data: VerseCreateRequest) => Promise<boolean>;
  updateVerse: (data: VerseUpdateRequest) => Promise<boolean>;
  deleteVerse: (id: number) => Promise<boolean>;
  bulkDeleteVerse: (ids: number[]) => Promise<boolean>;
}

export type VerseViewModel = VerseViewModelState & VerseViewModelActions;
