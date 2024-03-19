import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { expect, test } from 'vitest';

test('it should be able to create a new slug from text', () => {
  const slug = Slug.createFromText('Example question title');

  expect(slug.value).toBe('example-question-title');
});
