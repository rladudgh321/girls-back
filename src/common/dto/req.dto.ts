import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt } from "class-validator";

export class PageReqDto {
  @ApiPropertyOptional({ description: "default page = 1" })
  @Transform(({ value }) => Number(value))
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({ description: "default postsPerPage = 10" })
  @Transform(({ value }) => Number(value))
  @IsInt()
  postsPerPage?: number = 10;
}
