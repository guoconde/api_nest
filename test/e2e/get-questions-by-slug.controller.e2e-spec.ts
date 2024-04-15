/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments';
import { StudentFactory } from 'test/factories/make-student';

describe('Get question by slug (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionAttachmentFactory, AttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);
    questionFactory = moduleRef.get<QuestionFactory>(QuestionFactory);
    questionAttachmentFactory = moduleRef.get<QuestionAttachmentFactory>(QuestionAttachmentFactory);
    attachmentFactory = moduleRef.get<AttachmentFactory>(AttachmentFactory);
    jwt = moduleRef.get<JwtService>(JwtService);

    await app.init();
  });

  test('[GET] /questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent({ name: 'John Doe' });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      title: 'First question',
      slug: Slug.create('first-question'),
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: 'Some attachment',
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const response = await request(app.getHttpServer())
      .get(`/questions/first-question`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: 'First question',
        author: 'John Doe',
        attachments: expect.arrayContaining([
          expect.objectContaining({
            title: 'Some attachment',
          }),
        ]) as unknown,
      }) as unknown,
    });
  });
});
