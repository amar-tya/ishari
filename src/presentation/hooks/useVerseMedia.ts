import { container } from '@/di/container';
import {
  CreateVerseMediaDTO,
  ListVerseMediaDTO,
  UpdateVerseMediaDTO,
} from '@/application/dto';
import { useCallback } from 'react';

export const useVerseMedia = () => {
  const listVerseMedia = useCallback(async (dto: ListVerseMediaDTO) => {
    return await container.listVerseMediaUseCase.execute(dto);
  }, []);

  const uploadVerseMedia = useCallback(async (dto: CreateVerseMediaDTO) => {
    return await container.uploadVerseMediaUseCase.execute(dto);
  }, []);

  const updateVerseMedia = useCallback(
    async (id: number, dto: UpdateVerseMediaDTO) => {
      return await container.updateVerseMediaUseCase.execute(id, dto);
    },
    []
  );

  const deleteVerseMedia = useCallback(
    async (id: number, storagePath: string) => {
      return await container.deleteVerseMediaUseCase.execute(id, storagePath);
    },
    []
  );

  const findVerseMedia = useCallback(async (id: number) => {
    return await container.findVerseMediaUseCase.execute(id);
  }, []);

  const getRandomVerseMedia = useCallback(async () => {
    return await container.getRandomVerseMediaUseCase.execute();
  }, []);

  return {
    listVerseMedia,
    uploadVerseMedia,
    updateVerseMedia,
    deleteVerseMedia,
    findVerseMedia,
    getRandomVerseMedia,
  };
};
