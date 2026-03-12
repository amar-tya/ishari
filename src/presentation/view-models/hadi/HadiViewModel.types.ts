import { HadiEntityList } from '@/core/entities';
import { CreateHadiDTO, UpdateHadiDTO } from '@/application/dto';

export interface HadiViewModelState {
  isLoading: boolean;
  error: string | null;
  hadiList: HadiEntityList | null;
}

export interface HadiViewModelActions {
  getHadiList: (page?: number, search?: string, options?: { silent?: boolean }) => Promise<void>;
  storeHadi: (dto: CreateHadiDTO) => Promise<boolean>;
  updateHadi: (id: number, dto: UpdateHadiDTO) => Promise<boolean>;
  removeHadi: (id: number) => Promise<boolean>;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
}

export interface HadiViewModel
  extends HadiViewModelState, HadiViewModelActions {}
