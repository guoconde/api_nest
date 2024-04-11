export abstract class HashGenarator {
  abstract hash(plain: string): Promise<string>;
}
