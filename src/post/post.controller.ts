import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  UseInterceptors,
  Headers,
  UploadedFiles,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostReqDto, CreatePostResponseDto } from "./dto/create-post.dto";
import { GetPostReqDto, GetPostResDto } from "./dto/get-post.dto";
import { GetPostsReqDto, GetPostsResDto } from "./dto/get-posts.dto";
import { GetPostIdsResDto } from "./dto/get-posts-ids.dto";
import {
  ApiParam,
  ApiTags,
  ApiExtraModels,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { UpdatePostReqDto, UpdatePostResDto } from "./dto/update-post.dto";
import {
  ApiGetResponse,
  ApiPostResponse,
} from "src/common/decorator/swagger.decorator";
import { Public } from "src/common/decorator/public.decorator";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

@ApiTags("post")
@ApiExtraModels(
  GetPostIdsResDto,
  CreatePostResponseDto,
  GetPostsResDto,
  GetPostResDto,
  UpdatePostResDto,
)
@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Public()
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("files")) // FileInterceptor -> FilesInterceptor로 변경
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
  })
  @Post("upload")
  async uploadFiles(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 최대 파일 크기 5MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Express.Multer.File[], // 여러 파일을 처리하기 위해 배열로 수정
  ) {
    console.log("files", files);
    return this.postService.uploadImages(files); // 여러 파일을 처리하는 로직으로 수정
  }

  @Public()
  @ApiBearerAuth()
  @ApiGetResponse(GetPostIdsResDto)
  @Get("/all")
  async getPostIds(): Promise<GetPostIdsResDto> {
    const posts = await this.postService.getAllPostIds();
    return {
      posts,
    };
  }

  @ApiBearerAuth()
  @ApiPostResponse(CreatePostResponseDto)
  @Post()
  async createPost(
    @Body() { title, content, tags, images }: CreatePostReqDto,
    @Headers("authorization") token: string,
  ): Promise<any> {
    // ): Promise<CreatePostResponseDto> {
    const newPost = await this.postService.createPost(
      title,
      content,
      tags,
      images,
      token,
    );
    return {
      id: newPost.id,
      title: newPost.title,
      content: newPost.content,
      // tags: newPost.postTags[""],
      // images: newPost.images["images"],
    };
  }

  @Public()
  @ApiBearerAuth()
  @ApiGetResponse(GetPostsResDto)
  @Get("/")
  async getPosts(
    @Query() { page, postsPerPage, tag }: GetPostsReqDto, // 쿼리 파라미터를 GetPostsReqDto로 받기
  ): Promise<any> {
    // 게시글 데이터를 가져오는 서비스 호출
    const result = await this.postService.getPosts(page, postsPerPage, tag);
    // 응답 형식에 맞게 반환
    return {
      totalCount: result.totalCount,
      posts: result.posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        tags: post.tags,
      })),
    };
  }

  @Public()
  @ApiBearerAuth()
  @ApiGetResponse(GetPostResDto)
  @Get(":id")
  async getPost(@Param() { id }: GetPostReqDto): Promise<GetPostResDto> {
    const postData = await this.postService.getPostById(id);
    // GetPostResDto 형식으로 응답 데이터를 반환
    return {
      id: postData.id,
      title: postData.title,
      content: postData.content,
      tags: postData.tags,
      images: postData.images,
    };
  }

  @ApiBearerAuth()
  @ApiPostResponse(UpdatePostResDto)
  @Patch(":id")
  async updatePost(
    @Param("id") id: number, // :id로부터 파라미터 받기
    @Body() { title, content, tags, images }: UpdatePostReqDto, // 수정할 데이터 받기
  ): Promise<UpdatePostResDto> {
    const updatedPost = await this.postService.updatePost(
      id,
      title,
      content,
      tags,
      images,
    );
    return {
      id: updatedPost.id,
      title: updatedPost.title,
      content: updatedPost.content,
      tags: updatedPost.tags,
      images: updatedPost.images,
    };
  }

  @ApiBearerAuth()
  @Delete(":id")
  @ApiParam({
    name: "id",
    description: "The ID of the post to delete",
    example: 1,
  })
  async deletePost(
    @Param("id") id: number,
    @Headers("authorization") token: string,
  ) {
    const result = await this.postService.deletePost(id, token);
    return result; // 삭제 성공 메시지 반환
  }
}
