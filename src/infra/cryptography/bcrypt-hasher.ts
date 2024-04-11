import { hash, compare } from 'bcrypt';
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { HashGenarator } from '@/domain/forum/application/cryptography/hash-generator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptHasher implements HashGenarator, HashComparer {
  private HASH_SALT_LENGTH = 9;

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  compare(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed);
  }
}
