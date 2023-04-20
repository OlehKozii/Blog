import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ParseToIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    const integer = parseInt(value);
    if (isNaN(integer)) {
      throw new BadRequestException();
    }
    return integer;
  }
}
