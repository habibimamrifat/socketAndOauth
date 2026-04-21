export abstract class HashAbstract {
  abstract createHash(plainPassword: string): Promise<string>;
  abstract matchHash(
    plainPassword: string,
    hashedPasswordDB: string,
  ): Promise<boolean>;
}
