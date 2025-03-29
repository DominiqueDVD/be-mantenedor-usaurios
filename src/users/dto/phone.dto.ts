import { IsNotEmpty, IsString } from 'class-validator';

export class PhoneDto {
  @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
  @IsString()
  number: string;

  @IsNotEmpty({ message: 'El código de ciudad es obligatorio' })
  @IsString()
  citycode: string;

  @IsNotEmpty({ message: 'El código de país es obligatorio' })
  @IsString()
  countrycode: string;
}
