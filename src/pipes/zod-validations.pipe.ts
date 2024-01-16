import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value);

      return value;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(error.issues);
      }

      throw new BadRequestException('Validation failed');
    }
  }
}
