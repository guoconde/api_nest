import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException, Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { hash } from 'bcrypt';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/pipes/zod-validations.pipe';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type BodyRequest = z.infer<typeof createAccountBodySchema>;

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: BodyRequest) {
    const { name, email, password } = body;

    const hasPasword = await hash(password, 8);

    const emailAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailAlreadyExists) {
      throw new ConflictException('E-mail already exists');
    }

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hasPasword,
      },
    });
  }
}
