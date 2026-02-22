import { ITranslationRepository } from '@/application/ports';
import { VerseDropdown } from '@/core/entities';
import { Result } from '@/core/types';

export class GetTranslationDropdownUseCase {
  constructor(private readonly translationRepository: ITranslationRepository) {}

  async execute(): Promise<
    Result<{
      verses: VerseDropdown[];
      translators: string[];
      languages: string[];
    }>
  > {
    return this.translationRepository.getDataDropdown();
  }
}
