/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { StudentFactory } from 'test/factories/make-student';

describe('Create question (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);
    jwt = moduleRef.get<JwtService>(JwtService);

    await app.init();
  });

  test('[POST] /questions', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'How to create a new question',
        content: 'I want to create a new question, how can I do that?',
      });

    expect(response.status).toBe(201);

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'How to create a new question',
      },
    });

    expect(questionOnDatabase).toBeTruthy();
  });
});
