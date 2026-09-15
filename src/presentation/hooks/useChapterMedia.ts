import { container } from '@/di/container';
import {
  CreateChapterMediaDTO,
  ListChapterMediaDTO,
  UpdateChapterMediaDTO,
} from '@/application/dto';
import { useCallback } from 'react';

export const useChapterMedia = () => {
  const listChapterMedia = useCallback(async (dto: ListChapterMediaDTO) => {
    return await container.listChapterMediaUseCase.execute(dto);
  }, []);

  const uploadChapterMedia = useCallback(
    async (dto: CreateChapterMediaDTO) => {
      return await container.uploadChapterMediaUseCase.execute(dto);
    },
    []
  );

  const updateChapterMedia = useCallback(
    async (id: number, dto: UpdateChapterMediaDTO) => {
      return await container.updateChapterMediaUseCase.execute(id, dto);
    },
    []
  );

  const deleteChapterMedia = useCallback(
    async (id: number, storagePath: string) => {
      return await container.deleteChapterMediaUseCase.execute(
        id,
        storagePath
      );
    },
    []
  );

  const findChapterMedia = useCallback(async (id: number) => {
    return await container.findChapterMediaUseCase.execute(id);
  }, []);

  return {
    listChapterMedia,
    uploadChapterMedia,
    updateChapterMedia,
    deleteChapterMedia,
    findChapterMedia,
  };
};
