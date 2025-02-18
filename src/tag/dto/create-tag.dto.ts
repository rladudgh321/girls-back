// create-tag-req.dto.ts
import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTagReqDto {
  @ApiProperty({
    description: "The name of the tag to be created",
    example: "nestjs",
  })
  @IsString()
  @IsNotEmpty()
  name: string; // 태그 이름
}

export class CreateTagResDto {
  @ApiProperty({
    description: "The ID of the created tag",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string; // 생성된 태그의 ID

  @ApiProperty({
    description: "The name of the created tag",
    example: "nestjs",
  })
  @IsString()
  name: string; // 생성된 태그 이름
}
