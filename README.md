1. 주의 사항

const decoded = this.jwtService.verify(token.slice(7), {
      secret: this.configService.get("jwt").secret,
    });

    this.jwtService.verify(A,B)
    A는 Bearer 값이 없는 순수 토큰값
    B는 비밀키 string값 -> temp secret