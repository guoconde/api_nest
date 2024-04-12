/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);
    questionFactory = moduleRef.get<QuestionFactory>(QuestionFactory);
    jwt = moduleRef.get<JwtService>(JwtService);

    await app.init();
  });

  test('[GET] /questions', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    await Promise.all([
      questionFactory.makePrismaQuestion({ authorId: user.id, title: 'First question' }),
      questionFactory.makePrismaQuestion({ authorId: user.id, title: 'Second question' }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'First question' }),
        expect.objectContaining({ title: 'Second question' }),
      ],
    });
  });
});
