import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { ZodValidationPipe } from '../pipes/zod-validations.pipe';

const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

type BodyRequest = z.infer<typeof answerQuestionBodySchema>;

const validationPipe = new ZodValidationPipe(answerQuestionBodySchema);

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private readonly answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Body(validationPipe) body: BodyRequest,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
  ) {
    const { content, attachments } = body;
    const userId = user.sub;

    const result = await this.answerQuestion.execute({
      content,
      attachmentsIds: attachments,
      questionId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
