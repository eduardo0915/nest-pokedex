import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreatePokemonDto {
  @IsInt({ message: 'El valor tiene que ser entero' })
  @IsPositive({ message: 'El valor tiene que ser un numero positivo' })
  @Min(1, { message: 'El campo tiene que tener como minimo 1' })
  no: number;

  @IsString({ message: 'El valor tiene que ser un string' })
  @MinLength(1, { message: 'El valor tiene que tener minimo un caracter' })
  name: string;
}
