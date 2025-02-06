import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as path from "path";

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async tokenCheck(token: string) {
    const decoded = this.jwtService.verify(token.slice(7), {
      secret: this.configService.get("jwt").secret,
    });
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user) {
      throw new NotFoundException("작성자를 찾을 수 없습니다.");
    }
  }

  async uploadImages(files: {
    images1?: Express.Multer.File[];
    images2?: Express.Multer.File[];
    images3?: Express.Multer.File[];
  }) {
    // 각 필드에 대해 파일이 있는지 확인하고 처리
    const imageUrls: string[] = [];

    // image1 필드에 있는 파일들을 처리
    if (files.images1 && files.images1.length > 0) {
      files.images1.forEach((file) => {
        const fileName = path.basename(file.path); // 경로에서 파일 이름 추출
        imageUrls.push(fileName);
      });
    }

    // image2 필드에 있는 파일들을 처리
    if (files.images2 && files.images2.length > 0) {
      files.images2.forEach((file) => {
        const fileName = path.basename(file.path);
        imageUrls.push(fileName);
      });
    }

    // image3 필드에 있는 파일들을 처리
    if (files.images3 && files.images3.length > 0) {
      files.images3.forEach((file) => {
        const fileName = path.basename(file.path);
        imageUrls.push(fileName);
      });
    }

    // 파일이 하나도 없는 경우 예외 처리
    if (imageUrls.length === 0) {
      throw new BadRequestException("파일을 찾을 수 없습니다.");
    }

    return imageUrls; // 여러 파일의 URL을 배열로 반환
  }

  async createPost(
    title: string,
    tags: string[],
    images1: { src: string }[], // images1 필드
    images2: { src: string }[], // images2 필드
    images3: { src: string }[], // images3 필드
    token: string,
    content3: string,
    content1?: string,
    content2?: string,
  ) {
    // Token 확인 함수 (예시)
    this.tokenCheck(token);

    // 태그가 전달되었을 경우, 태그가 존재하는지 확인하고 연결
    const tagData =
      tags.length > 0
        ? await Promise.all(
            tags.map(async (tagname) => {
              const tag = await this.prisma.tag.findUnique({
                where: { name: tagname },
              });

              if (!tag) {
                throw new NotFoundException(`Tag with ID ${tagname} not found`);
              }

              return { name: tagname }; // 존재하는 태그만 연결
            }),
          )
        : [];

    // 게시글 생성
    const newPost = await this.prisma.post.create({
      data: {
        title,
        content1: content1.length > 0 ? content1 : null,
        content2: content2.length > 0 ? content2 : null,
        content3,
        images1:
          images1.length > 0
            ? { create: images1.map((image) => ({ src: image.src })) }
            : { create: [] }, // 이미지가 있을 경우에만 생성
        images2:
          images2.length > 0
            ? { create: images2.map((image) => ({ src: image.src })) }
            : { create: [] }, // 이미지가 있을 경우에만 생성
        images3:
          images3.length > 0
            ? { create: images3.map((image) => ({ src: image.src })) }
            : { create: [] }, // 이미지가 있을 경우에만 생성
        postTags:
          tagData.length > 0
            ? {
                create: tagData.map((tag) => ({
                  tag: {
                    connect: { name: tag.name }, // 존재하는 태그 연결
                  },
                })),
              }
            : undefined, // 태그가 있을 경우에만 생성
      },
      include: {
        postTags: {
          select: {
            tag: {
              select: {
                id: true, // 태그 ID만 선택
              },
            },
          },
        },
        images1: {
          select: {
            src: true, // 이미지 src만 선택
          },
        },
        images2: {
          select: {
            src: true, // 이미지 src만 선택
          },
        },
        images3: {
          select: {
            src: true, // 이미지 src만 선택
          },
        },
      },
    });

    return newPost;
  }

  async deletePost(id: string, token: string) {
    this.tokenCheck(token);
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
    id: string,
    title: string,
    content1: string,
    content2: string,
    content3: string,
    tags: string[],
    images1: string[],
    images2: string[],
    images3: string[],
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
        content1: content1 ?? existingPost.content1, // 내용이 없으면 기존 내용 사용
        content2: content2 ?? existingPost.content2, // 내용이 없으면 기존 내용 사용
        content3: content3 ?? existingPost.content3, // 내용이 없으면 기존 내용 사용
        images1: images1
          ? {
              deleteMany: {}, // 기존 이미지 삭제
              create: images1.map((src) => ({ src })), // 새 이미지 추가
            }
          : undefined,
        images2: images2
          ? {
              deleteMany: {}, // 기존 이미지 삭제
              create: images2.map((src) => ({ src })), // 새 이미지 추가
            }
          : undefined,
        images3: images3
          ? {
              deleteMany: {}, // 기존 이미지 삭제
              create: images3.map((src) => ({ src })), // 새 이미지 추가
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
        images1: {
          // 이미지 정보도 포함하여 반환
          select: {
            src: true, // 이미지 src만 선택
          },
        },
        images2: {
          // 이미지 정보도 포함하여 반환
          select: {
            src: true, // 이미지 src만 선택
          },
        },
        images3: {
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
      content1: updatedPost.content1,
      content2: updatedPost.content2,
      content3: updatedPost.content3,
      tags: updatedPost.postTags.map((postTag) => postTag.tag.id), // postTags에서 tag.id를 가져옴
      images1: updatedPost.images1.map((image) => image.src), // images에서 src를 가져옴
      images2: updatedPost.images2.map((image) => image.src), // images에서 src를 가져옴
      images3: updatedPost.images3.map((image) => image.src), // images에서 src를 가져옴
    };
  }

  async getPostById(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        postTags: {
          select: {
            tag: true,
          },
        },
        images1: {
          select: {
            src: true,
          },
        },
        images2: {
          select: {
            src: true,
          },
        },
        images3: {
          select: {
            src: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    const {
      id,
      title,
      content1,
      content2,
      content3,
      postTags,
      images1,
      images2,
      images3,
    } = post;

    const responseData = {
      id,
      title,
      content1,
      content2,
      content3,
      tags: postTags ? postTags.map((tag) => tag.tag) : [],
      images1: images1 ? images1.map((image) => image.src) : [],
      images2: images2 ? images2.map((image) => image.src) : [],
      images3: images3 ? images3.map((image) => image.src) : [],
    };

    return responseData;
  }

  async getAllPostIds() {
    // Prisma를 사용하여 'posts' 테이블에서 'id'만 선택
    const posts = await this.prisma.post.findMany({
      select: { id: true, createdAt: true }, // id만 선택
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
        content1: true,
        content2: true,
        content3: true,
        postTags: {
          select: {
            tag: true,
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

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content1: post.content1,
      content2: post.content2,
      content3: post.content3,
      tags: post.postTags.map((postTag) => ({
        id: postTag.tag.id,
        name: postTag.tag.name,
      })),
    }));

    return { totalCount, posts: formattedPosts };
  }
}
