import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(
    title: string,
    content: string,
    tags: number[],
    images: string[],
  ) {
    // 태그가 전달되었을 경우, 태그가 존재하는지 확인하고 연결
    const tagData = tags
      ? await Promise.all(
          tags.map(async (tagId) => {
            const tag = await this.prisma.tag.findUnique({
              where: { id: tagId },
            });

            if (!tag) {
              throw new NotFoundException(`Tag with ID ${tagId} not found`);
            }

            return { id: tagId }; // 존재하는 태그만 연결
          }),
        )
      : [];

    // 게시글 생성
    const newPost = await this.prisma.post.create({
      data: {
        title,
        content,
        images: {
          create: images?.map((src) => ({ src })), // 이미지 생성
        },
        postTags: {
          create: tagData.map((tag) => ({
            tag: {
              connect: { id: tag.id }, // 존재하는 태그 연결
            },
          })),
        },
      },
      include: {
        postTags: {
          // postTags를 포함하여 반환
          select: {
            tag: {
              select: {
                id: true, // 태그 ID만 선택
              },
            },
          },
        },
        images: {
          // 이미지 정보도 포함하여 반환
          select: {
            src: true, // 이미지 src만 선택
          },
        },
      },
    });

    return newPost;
  }

  async deletePost(id: number) {
    // 해당 게시글이 존재하는지 확인
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new NotFoundException("Post not found");
    }

    // 게시글 삭제 (연관된 데이터는 자동으로 Cascade에 의해 삭제됨)
    await this.prisma.post.delete({
      where: { id },
    });

    return { message: "Post deleted successfully" };
  }

  async updatePost(
    id: number,
    title: string,
    content: string,
    tags: number[],
    images: string[],
  ) {
    // 해당 게시글이 존재하는지 확인
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new NotFoundException("Post not found");
    }

    // 게시글 수정
    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        title: title ?? existingPost.title, // 제목이 없으면 기존 제목 사용
        content: content ?? existingPost.content, // 내용이 없으면 기존 내용 사용
        images: images
          ? {
              deleteMany: {}, // 기존 이미지 삭제
              create: images.map((src) => ({ src })), // 새 이미지 추가
            }
          : undefined,
        postTags: tags
          ? {
              deleteMany: {}, // 기존 태그 삭제
              create: tags.map((tagId) => ({
                tag: {
                  connect: { id: tagId },
                },
              })),
            }
          : undefined,
      },
      include: {
        postTags: {
          // postTags를 포함하여 반환
          select: {
            tag: {
              select: {
                id: true, // 태그 ID만 선택
              },
            },
          },
        },
        images: {
          // 이미지 정보도 포함하여 반환
          select: {
            src: true, // 이미지 src만 선택
          },
        },
      },
    });

    // 응답 형식에 맞게 반환
    return {
      id: updatedPost.id,
      title: updatedPost.title,
      content: updatedPost.content,
      tags: updatedPost.postTags.map((postTag) => postTag.tag.id), // postTags에서 tag.id를 가져옴
      images: updatedPost.images.map((image) => image.src), // images에서 src를 가져옴
    };
  }

  async getPostById(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: Number(postId) },
      include: {
        postTags: {
          select: {
            tag: {
              select: {
                id: true,
              },
            },
          },
        },
        images: {
          select: {
            src: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    const { id, title, createdAt, postTags, images } = post;

    const responseData = {
      id,
      title,
      date: createdAt,
      tags: postTags ? postTags.map((tag) => tag.tag.id) : [],
      images: images ? images.map((image) => image.src) : [],
    };

    return responseData;
  }

  async getAllPostIds() {
    // Prisma를 사용하여 'posts' 테이블에서 'id'만 선택
    const posts = await this.prisma.post.findMany({
      select: { id: true }, // id만 선택
    });

    if (!posts || posts.length === 0) {
      throw new NotFoundException("No posts found");
    }

    return posts;
  }

  async getPosts(
    page: number = 1,
    postsPerPage: number = 10,
    tag: string = "",
  ) {
    const offset = (page - 1) * postsPerPage;

    // tag가 있을 경우 해당 태그의 게시물만 필터링
    let whereCondition: any = {};

    if (tag) {
      const tagData = await this.prisma.tag.findMany({
        where: { name: tag },
        select: { id: true },
      });

      if (tagData.length === 0) {
        throw new NotFoundException(`Tag "${tag}" not found`);
      }

      whereCondition = {
        postTags: {
          some: {
            tagId: { in: tagData.map((tag) => tag.id) },
          },
        },
      };
    }

    // 총 게시물 수
    const totalCount = await this.prisma.post.count({
      where: whereCondition,
    });

    // 게시물 데이터
    const posts = await this.prisma.post.findMany({
      where: whereCondition,
      select: {
        id: true,
        title: true,
        createdAt: true,
        postTags: {
          select: {
            tagId: true,
          },
        },
      },
      skip: offset,
      take: postsPerPage,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (posts.length === 0) {
      throw new NotFoundException("No posts found");
    }

    return { totalCount, posts };
  }
}