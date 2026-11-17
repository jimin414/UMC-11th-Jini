
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { RatingService } from '../service/rating.service';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { UpdateRatingDto } from '../dto/update-rating.dto';

import { AuthGuard } from '../guard/auth.guard';
import type { AuthenticatedRequest } from '../guard/auth.guard';

@Controller()
export class RatingController {
  constructor(
    private readonly ratingService: RatingService,
  ) {}

  // 기존 회원별 평점 조회: 인증 없이 사용 가능
  @Get('members/:memberId/ratings')
  async getMemberRatings(
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  // 실습 5: JWT로 인증된 회원의 평점 등록
  @Post('ratings')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createRating(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateRatingDto,
  ) {
    const result = await this.ratingService.createRating(
      String(request.memberId),
      dto,
    );

    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '평점 등록에 성공했습니다.',
      result,
    };
  }

  // 실습 5: 본인이 작성한 평점 수정
  @Patch('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateRating(
    @Req() request: AuthenticatedRequest,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    const result = await this.ratingService.updateRating(
      String(request.memberId),
      String(ratingId),
      dto,
    );

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점 수정에 성공했습니다.',
      result,
    };
  }

  // 실습 5: 본인이 작성한 평점 삭제
  @Delete('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteRating(
    @Req() request: AuthenticatedRequest,
    @Param('ratingId', ParseIntPipe) ratingId: number,
  ) {
    await this.ratingService.deleteRating(
      String(request.memberId),
      String(ratingId),
    );

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점 삭제에 성공했습니다.',
      result: null,
    };
  }
}
