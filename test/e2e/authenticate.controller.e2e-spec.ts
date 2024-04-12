/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';
import request from 'supertest';
import { StudentFactory } from 'test/factories/make-student';

describe('Authenticate account (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);

    await app.init();
  });

  test('[POST] /sessions', async () => {
    await studentFactory.makePrismaStudent({
      email: 'jhondoe@example.com',
      password: await hash('123456', 8),
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'jhondoe@example.com',
      password: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('access_token');
  });
});
