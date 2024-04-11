import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { HashGenarator } from '@/domain/forum/application/cryptography/hash-generator';

export class FakeHasher implements HashGenarator, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed');
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash;
  }
}
