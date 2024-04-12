/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Comment on answer (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);
    questionFactory = moduleRef.get<QuestionFactory>(QuestionFactory);
    answerFactory = moduleRef.get<AnswerFactory>(AnswerFactory);
    jwt = moduleRef.get<JwtService>(JwtService);

    await app.init();
  });

  test('[POST] /answers/:answerId/comments', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const { id: questionId } = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const { id } = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId,
    });

    const response = await request(app.getHttpServer())
      .post(`/answers/${id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New comments',
      });

    expect(response.status).toBe(201);

    const commentOnDatabase = await prisma.comment.findFirst({
      where: {
        content: 'New comments',
      },
    });

    expect(commentOnDatabase).toBeTruthy();
    expect(commentOnDatabase?.answerId).toBeTruthy();
    expect(commentOnDatabase?.questionId).toBeNull();
  });
});
