import { container } from '@/di/container';
import { CreateHadiDTO, ListHadiDTO, UpdateHadiDTO } from '@/application/dto';
import { useCallback } from 'react';

export const useHadi = () => {
  const listHadi = useCallback(async (dto: ListHadiDTO) => {
    return await container.listHadiUseCase.execute(dto);
  }, []);

  const createHadi = useCallback(async (dto: CreateHadiDTO) => {
    return await container.createHadiUseCase.execute(dto);
  }, []);

  const updateHadi = useCallback(async (id: number, dto: UpdateHadiDTO) => {
    return await container.updateHadiUseCase.execute(id, dto);
  }, []);

  const deleteHadi = useCallback(async (id: number) => {
    return await container.deleteHadiUseCase.execute(id);
  }, []);

  const findHadi = useCallback(async (id: number) => {
    return await container.findHadiUseCase.execute(id);
  }, []);

  return {
    listHadi,
    createHadi,
    updateHadi,
    deleteHadi,
    findHadi,
  };
};
