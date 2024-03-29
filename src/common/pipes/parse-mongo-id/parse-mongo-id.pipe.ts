import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    //console.log({ value, metadata });

    if (!isValidObjectId(value)) {
      throw new BadRequestException(
        `${value} no es un valor valido de MongoID`,
      );
    }
    return value;
  }
}
