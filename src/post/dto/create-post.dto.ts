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

  @ApiPropertyOptional({
    description: "The content of the post",
    example: "In this post, we will learn how to use NestJS with Prisma...",
  })
  content1?: string;

  @ApiPropertyOptional({
    description: "The content of the post",
    example: "In this post, we will learn how to use NestJS with Prisma...",
  })
  content2?: string;

  @ApiPropertyOptional({
    description: "The content of the post",
    example: "In this post, we will learn how to use NestJS with Prisma...",
  })
  @IsString()
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
  images1?: { src: string; postId: number }[]; // 이미지 URL 목록

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
  images2?: { src: string; postId: number }[]; // 이미지 URL 목록

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
  images3: { src: string; postId: number }[]; // 이미지 URL 목록
}

export class CreatePostResponseDto {
  @ApiProperty({
    description: "The ID of the created post",
    example: "166d4a0c-8e8c-41ca-b485-5150d8e58283",
  })
  @IsInt()
  id: string; // 생성된 게시글의 ID

  @ApiProperty({
    description: "The title of the post",
    example: "How to use NestJS with Prisma",
  })
  @IsString()
  title: string; // 게시글 제목

  @ApiPropertyOptional({
    description: "The content of the post",
    example: "In this post, we will learn how to use NestJS with Prisma...",
  })
  content1?: string; // 게시글 내용

  @ApiPropertyOptional({
    description: "The content of the post",
    example: "In this post, we will learn how to use NestJS with Prisma...",
  })
  content2?: string; // 게시글 내용

  @ApiProperty({
    description: "The content of the post",
    example: "In this post, we will learn how to use NestJS with Prisma...",
  })
  @IsString()
  content3?: string; // 게시글 내용

  @ApiPropertyOptional({
    description: "List of tag IDs associated with the post",
    example: [
      "166d4a0c-8e8c-41ca-b485-5150d8e5828j",
      "166d4a0c-8e8c-41ca-b485-5150d8e5828a",
      "166d4a0c-8e8c-41ca-b485-5150d8e58286",
    ],
  })
  @IsArray()
  @IsOptional()
  tags: { tag: { id: string } }[]; // 연결된 태그 ID 배열 (선택적)

  @ApiPropertyOptional({
    description: "List of image URLs associated with the post",
    example: [
      {
        src: "https://cdn.pixabay.com/photo/2023/02/22/19/13/reading-7807231_640.jpg",
        postId: "166d4a0c-8e8c-b1ca-b485-5150d8eb8283",
      },
      {
        src: "https://cdn.pixabay.com/photo/2024/11/21/19/04/elephant-9214527_640.jpg",
        postId: "166d4a0c-8e8c-a1ca-b485-5150d8e5828h",
      },
    ],
  })
  @IsArray()
  @IsOptional()
  images1?: { src: string }[]; // 이미지 URL 목록

  @ApiPropertyOptional({
    description: "List of image URLs associated with the post",
    example: [
      {
        src: "https://cdn.pixabay.com/photo/2023/02/22/19/13/reading-7807231_640.jpg",
        postId: "166d4a0c-8e8c-41ca-b48j-5150d8eb8283",
      },
      {
        src: "https://cdn.pixabay.com/photo/2024/11/21/19/04/elephant-9214527_640.jpg",
        postId: "166d4a0c-8e8c-41ca-b483-5150d8e5828h",
      },
    ],
  })
  @IsArray()
  @IsOptional()
  images2?: { src: string }[]; // 이미지 URL 목록

  @ApiPropertyOptional({
    description: "List of image URLs associated with the post",
    example: [
      {
        src: "https://cdn.pixabay.com/photo/2023/02/22/19/13/reading-7807231_640.jpg",
        postId: "166d4a0c-8e8c-41ca-b485-5150d8eb8283",
      },
      {
        src: "https://cdn.pixabay.com/photo/2024/11/21/19/04/elephant-9214527_640.jpg",
        postId: "166d4a0c-8e8c-41ca-b485-5150d8e5828h",
      },
    ],
  })
  @IsArray()
  @IsOptional()
  images3?: { src: string }[]; // 이미지 URL 목록
}
