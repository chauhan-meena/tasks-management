import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  public email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  public password!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  public name!: string;
}

export class LoginDto {
  @IsEmail()
  public email!: string;

  @IsString()
  @MinLength(6)
  public password!: string;
}
