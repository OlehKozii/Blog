import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export function handleErrors(error) {
  console.log(error);
  if (error instanceof BadRequestException) {
    throw new BadRequestException(error.message);
  }
  if (error instanceof UnauthorizedException) {
    throw new UnauthorizedException(error.message);
  }
  if (error instanceof ForbiddenException) {
    throw new ForbiddenException(error.message);
  }
  if (error instanceof NotFoundException) {
    throw new NotFoundException(error.message);
  }
  if (error instanceof ConflictException) {
    throw new ConflictException(error.message);
  }
  throw new InternalServerErrorException();
}
