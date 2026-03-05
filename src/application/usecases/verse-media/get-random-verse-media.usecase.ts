import { IVerseMediaRepository } from '@/application/ports/repository/verse-media.repository.port';
import { VerseMediaEntity } from '@/core/entities';
import { Result } from '@/core/types';

export class GetRandomVerseMediaUseCase {
  constructor(private readonly repository: IVerseMediaRepository) {}

  async execute(): Promise<Result<VerseMediaEntity>> {
    return this.repository.getRandomWithAudio();
  }
}
