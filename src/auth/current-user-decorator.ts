/* eslint-disable import/no-extraneous-dependencies */
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { UserPayload } from './jwt.strategy';

export const CurrentUser = createParamDecorator((_: never, context: ExecutionContext) => {
  const request: Request = context.switchToHttp().getRequest();

  return request.user as UserPayload;
});
