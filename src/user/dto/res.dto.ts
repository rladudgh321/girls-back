import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsUUID } from "class-validator";
import { Role } from "../enum/role.enum";

export class FindUserResDto {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsEmail()
  email: string;
}

export class GetUserIdResDto {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ required: true, enum: Role })
  role: string;
}
