import { UserValidateDto } from './user-validate.dto';

export class ResponseValidateDto {
  valid: boolean;
  user: UserValidateDto;
}
