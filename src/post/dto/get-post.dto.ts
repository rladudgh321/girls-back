import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"; // Swagger 관련 데코레이터
import { IsArray, IsInt, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class GetPostReqDto {
  @ApiProperty({
    description: "The ID of the post",
    example: "123",
  })
  @Transform(({ value }) => Number(value))
  @IsInt()
  id: string; // 게시글 ID
}

export class GetPostResDto {
  @ApiProperty({
    description: "The ID of the post",
    example: 1,
  })
  @IsInt()
  id: number; // 게시글 ID

  @ApiProperty({
    description: "The title of the post",
    example: "How to use NestJS with Prisma",
  })
  @IsString()
  title: string; // 게시글 제목

  @ApiProperty({
    description: "The content the post was created",
    example: "hello everyone", // ISO 8601 형식 예시
  })
  @IsString()
  content: string; // 게시글 작성일

  @ApiPropertyOptional({
    description: "List of tag IDs associated with the post",
    example: ["nestjs", "nextjs"],
  })
  @IsArray()
  @IsOptional()
  tags: { id: number; name: string }[]; // 게시글에 연결된 태그 ID 배열

  @ApiPropertyOptional({
    description: "List of image URLs associated with the post",
    example: [
      "https://cdn.pixabay.com/photo/2023/02/22/19/13/reading-7807231_640.jpg",
      "https://cdn.pixabay.com/photo/2024/11/21/19/04/elephant-9214527_640.jpg",
    ],
  })
  @IsArray()
  @IsOptional()
  images: string[]; // 게시글에 연결된 이미지 src 배열
}
