# 1. 개발 환경 (Development stage)
FROM node:20 AS development

# 2. 작업 디렉토리 설정
WORKDIR /app

# 5. 패키지 파일 복사
COPY package.json yarn.lock ./ 

# 3. Corepack 활성화 (Yarn을 관리할 수 있도록)
RUN corepack prepare yarn@stable --activate
RUN yarn set version berry

# Yarn 캐시 지우기 및 의존성 재설치
RUN export NODE_TLS_REJECT_UNAUTHORIZED=0 && yarn cache clean
RUN export NODE_TLS_REJECT_UNAUTHORIZED=0 && yarn install --pnp
RUN export NODE_TLS_REJECT_UNAUTHORIZED=0 && yarn install

# Prisma 디렉토리 복사 (절대 경로 확인)
COPY prisma /app/prisma

# Prisma 엔진과 Debug 패키지를 Unplug 처리
RUN yarn unplug @prisma/engines
RUN yarn unplug @prisma/debug

# @nestjs/cli 글로벌 설치
RUN yarn global add @nestjs/cli

# Prisma 삭제
RUN yarn remove @prisma/client prisma

# Prisma 재설치
RUN yarn add @prisma/client prisma

# Prisma generate 실행
RUN yarn pnpify prisma generate

# 9. 소스 코드 복사
COPY . .

# 11. 애플리케이션 빌드
RUN yarn build

# 15. 프로덕션 환경 (Production stage)
FROM node:20 AS production

# 16. 작업 디렉토리 설정
WORKDIR /app

# 17. package.json과 yarn.lock 복사
COPY --from=development /app/package.json /app/yarn.lock /app/

# 19. 프로젝트에 맞는 Yarn 버전 설정 (Yarn 2 이상)
RUN corepack enable

# 21. 프로덕션 의존성만 설치 (yarn workspaces focus 사용)
RUN yarn workspaces focus --production

# 22. 빌드된 파일만 복사
COPY --from=development /app/dist /app/dist

# 23. Prisma 디렉토리 복사 (production 스테이지에도 필요)
COPY --from=development /app/prisma /app/prisma

# 24. wait-for-it 스크립트 복사
COPY ./wait-for-it.sh /app/wait-for-it.sh

# 24.1. sed로 CRLF 라인 종료 문자 제거
RUN sed -i 's/\r//' /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

# 26. Prisma 마이그레이션 전에 PostgreSQL 연결 준비를 기다리도록 설정 (프로덕션 스테이지에서 실행)
RUN yarn pnpify prisma generate

# 27. 프로덕션 환경에서 실행
EXPOSE 443
CMD ["node", "dist/main"]
