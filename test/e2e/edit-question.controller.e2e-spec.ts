/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments';
import { StudentFactory } from 'test/factories/make-student';

describe('Edit question (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionAttachmentFactory, AttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);
    studentFactory = moduleRef.get<StudentFactory>(StudentFactory);
    questionFactory = moduleRef.get<QuestionFactory>(QuestionFactory);
    questionAttachmentFactory = moduleRef.get<QuestionAttachmentFactory>(QuestionAttachmentFactory);
    attachmentFactory = moduleRef.get<AttachmentFactory>(AttachmentFactory);
    jwt = moduleRef.get<JwtService>(JwtService);

    await app.init();
  });

  test('[PUT] /questions/:id', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const firstAttachment = await attachmentFactory.makePrismaAttachment();
    const secondAttachment = await attachmentFactory.makePrismaAttachment();

    const { id } = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: firstAttachment.id,
      questionId: id,
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: secondAttachment.id,
      questionId: id,
    });

    const tirdAttachment = await attachmentFactory.makePrismaAttachment();

    const response = await request(app.getHttpServer())
      .put(`/questions/${id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New Question',
        content: 'New Content',
        attachments: [firstAttachment.id.toString(), tirdAttachment.id.toString()],
      });

    expect(response.status).toBe(204);

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'New Question',
      },
    });

    expect(questionOnDatabase).toBeTruthy();

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDatabase?.id,
      },
    });

    expect(attachmentsOnDatabase).toHaveLength(2);
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: firstAttachment.id.toString(),
        }),
        expect.objectContaining({
          id: tirdAttachment.id.toString(),
        }),
      ]),
    );
  });
});
