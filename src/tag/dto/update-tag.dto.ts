import { IsString, IsNotEmpty, IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTagReqDto {
  @ApiProperty({
    description: "The new name of the tag",
    example: "nestjs-updated",
  })
  @IsString()
  @IsNotEmpty()
  name: string; // 수정할 태그의 이름
}

export class UpdateTagResDto {
  @ApiProperty({
    description: "The ID of the updated tag",
    example: "fd3d1e80-6e11-4777-91b5-735dd2f45f8b",
  })
  @IsInt()
  id: string; // 수정된 태그의 ID

  @ApiProperty({
    description: "The name of the updated tag",
    example: "nestjs-updated",
  })
  @IsString()
  name: string; // 수정된 태그의 이름
}
