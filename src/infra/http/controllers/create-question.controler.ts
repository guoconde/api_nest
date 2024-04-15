import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { ZodValidationPipe } from '../pipes/zod-validations.pipe';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

type BodyRequest = z.infer<typeof createQuestionBodySchema>;

const validationPipe = new ZodValidationPipe(createQuestionBodySchema);

@Controller('/questions')
export class CreateQuestionController {
  constructor(private readonly createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(@Body(validationPipe) body: BodyRequest, @CurrentUser() user: UserPayload) {
    const { title, content, attachments } = body;
    const userId = user.sub;

    const result = await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const { question } = result.value;

    return {
      question,
    };
  }
}
