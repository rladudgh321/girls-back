import { Injectable, Logger } from "@nestjs/common";
import { MulterOptionsFactory } from "@nestjs/platform-express";
import * as fs from "fs";
import * as multer from "multer";
import * as path from "path";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  dirPath: string;
  constructor(private readonly logger: Logger) {
    this.dirPath = path.join(process.cwd(), "uploads");
    this.mkdir();
  }

  // uploads 폴더 생성
  mkdir() {
    try {
      fs.readdirSync(this.dirPath);
    } catch (err) {
      this.logger.warn(err);
      fs.mkdirSync(this.dirPath);
    }
  }

  createMulterOptions() {
    const dirPath = this.dirPath;
    const option = {
      storage: multer.diskStorage({
        destination(req, file, done) {
          //파일 저장 경로 설정
          done(null, dirPath);
        },

        filename(req, file, done) {
          // 파일명 설정
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext);
          const buffer = Buffer.from(name, "binary").toString("utf-8");
          done(null, `${buffer}_${Date.now()}${ext}`); //파일이름_날짜.확장자
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 용량 제한
    };
    return option;
  }
}
