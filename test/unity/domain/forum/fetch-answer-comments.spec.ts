import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    );
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    inMemoryStudentsRepository.items.push(student);

    const firstComment = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    });
    const secondComment = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    });
    const tirdComment = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    });

    await inMemoryAnswerCommentsRepository.create(firstComment);

    await inMemoryAnswerCommentsRepository.create(secondComment);

    await inMemoryAnswerCommentsRepository.create(tirdComment);

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: firstComment.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: secondComment.id,
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: tirdComment.id,
        }),
      ]),
    );
  });

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    inMemoryStudentsRepository.items.push(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        }),
      );
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
