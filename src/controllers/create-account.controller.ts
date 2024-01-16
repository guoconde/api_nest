import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { hash } from 'bcrypt';

@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
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
        password,
      },
    });
  }
}
