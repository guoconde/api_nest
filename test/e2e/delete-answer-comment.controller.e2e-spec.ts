/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { AnswerCommentFactory } from 'test/factories/make-answer-comment';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Delete answer comment (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerCommentFactory: AnswerCommentFactory;
  let answerFactory: AnswerFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerCommentFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);
    questionFactory = moduleRef.get<QuestionFactory>(QuestionFactory);
    answerCommentFactory = moduleRef.get<AnswerCommentFactory>(AnswerCommentFactory);
    answerFactory = moduleRef.get<AnswerFactory>(AnswerFactory);
    jwt = moduleRef.get<JwtService>(JwtService);

    await app.init();
  });

  test('[DELETE] /answers/comments/:id', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const { id: questionId } = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const { id: answerId } = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId,
    });

    const { id } = await answerCommentFactory.makePrismaAnswerComment({
      answerId,
      authorId: user.id,
    });

    const response = await request(app.getHttpServer())
      .delete(`/answers/comments/${id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(204);

    const commentOnDatabase = await prisma.comment.findUnique({
      where: {
        id: id.toString(),
      },
    });

    expect(commentOnDatabase).toBeNull();

    const questionOnDatabase = await prisma.question.findUnique({
      where: {
        id: questionId.toString(),
      },
      include: {
        comments: true,
      },
    });

    expect(questionOnDatabase?.comments).toEqual([]);
  });
});
