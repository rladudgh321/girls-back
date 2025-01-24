import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"; // Swagger 관련 데코레이터

export class CreatePostReqDto {
  @ApiProperty({
    description: "The title of the post",
    example: "How to use NestJS with Prisma",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "The content of the post",
    example: "In this post, we will learn how to use NestJS with Prisma...",
  })
  @IsString()
  @IsNotEmpty()
  content1?: string;

  @ApiProperty({
    description: "The content of the post",
    example: "In this post, we will learn how to use NestJS with Prisma...",
  })
  @IsString()
  @IsNotEmpty()
  content2?: string;

  @ApiProperty({
    description: "The content of the post",
    example: "In this post, we will learn how to use NestJS with Prisma...",
  })
  @IsString()
  @IsNotEmpty()
  content3: string;

  @ApiPropertyOptional({
    description: "List of tag IDs associated with the post",
    example: ["nestjs", "nextjs"],
  })
  @IsOptional()
  @IsArray()
  tags?: string[]; // 태그 ID 목록

  @ApiPropertyOptional({
    description: "List of image URLs associated with the post",
    example: [
      {
        src: "https://cdn.pixabay.com/photo/2023/02/22/19/13/reading-7807231_640.jpg",
        postId: 10,
      },
      {
        src: "https://cdn.pixabay.com/photo/2024/11/21/19/04/elephant-9214527_640.jpg",
        postId: 10,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  images?: { src: string; postId: number }[]; // 이미지 URL 목록
}

export class CreatePostResponseDto {
  @ApiProperty({
    description: "The ID of the created post",
    example: 1,
  })
  @IsInt()
  id: number; // 생성된 게시글의 ID

  @ApiProperty({
    description: "The title of the post",
    example: "How to use NestJS with Prisma",
  })
  @IsString()
  title: string; // 게시글 제목

  @ApiProperty({
    description: "The content of the post",
    example: "In this post, we will learn how to use NestJS with Prisma...",
  })
  @IsString()
  content: string; // 게시글 내용

  @ApiPropertyOptional({
    description: "List of tag IDs associated with the post",
    example: [1, 2, 3],
  })
  @IsArray()
  @IsOptional()
  tags: number[]; // 연결된 태그 ID 배열 (선택적)

  @ApiPropertyOptional({
    description: "List of image URLs associated with the post",
    example: [
      {
        src: "https://cdn.pixabay.com/photo/2023/02/22/19/13/reading-7807231_640.jpg",
        postId: 10,
      },
      {
        src: "https://cdn.pixabay.com/photo/2024/11/21/19/04/elephant-9214527_640.jpg",
        postId: 10,
      },
    ],
  })
  @IsArray()
  @IsOptional()
  images?: { src: string; postId: number }[]; // 이미지 URL 목록
}
