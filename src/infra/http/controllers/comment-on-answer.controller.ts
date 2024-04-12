import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';
import { z } from 'zod';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer';
import { ZodValidationPipe } from '../pipes/zod-validations.pipe';

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
});

type BodyRequest = z.infer<typeof commentOnAnswerBodySchema>;

const validationPipe = new ZodValidationPipe(commentOnAnswerBodySchema);

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private readonly commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @Body(validationPipe) body: BodyRequest,
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnAnswer.execute({
      content,
      answerId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
