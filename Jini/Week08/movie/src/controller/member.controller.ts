
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { MemberService } from '../service/member.service';
import { CreateMemberDto } from '../dto/create-member.dto';
import { MemberUpdateRequestDto } from '../dto/member-update-request.dto';

import { AuthGuard } from '../guard/auth.guard';
import type { AuthenticatedRequest } from '../guard/auth.guard';

@Controller('members')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
  ) {}

  // 실습 3: 내 정보 조회
  @Get('me')
  @UseGuards(AuthGuard)
  async getMyInfo(@Req() request: AuthenticatedRequest) {
    const result = await this.memberService.getMyInfo(
      request.memberId,
    );

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 조회했습니다.',
      result,
    };
  }

  // 실습 4: 내 정보 수정
  @Patch('me')
  @UseGuards(AuthGuard)
  async updateMyInfo(
    @Req() request: AuthenticatedRequest,
    @Body() dto: MemberUpdateRequestDto,
  ) {
    const result = await this.memberService.updateMyInfo(
      request.memberId,
      dto,
    );

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 수정했습니다.',
      result,
    };
  }

  // 닉네임 중복 확인
  @Get('nickname/:nickname')
  async checkNickname(
    @Param('nickname') nickname: string,
  ) {
    return this.memberService.checkNickname(nickname);
  }

  // 이메일 중복 확인
  @Get('email/:email')
  async checkEmail(
    @Param('email') email: string,
  ) {
    return this.memberService.checkEmail(email);
  }

  // 회원별 평점 조회
  @Get(':memberId/ratings')
  async getMemberRatings(
    @Param('memberId') memberId: string,
  ) {
    return this.memberService.getMemberRatings(memberId);
  }

  // 회원가입
  @Post()
  async signUp(@Body() dto: CreateMemberDto) {
    return this.memberService.signUp(dto);
  }
}
