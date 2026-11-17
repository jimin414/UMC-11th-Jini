
import {
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { QueryFailedError } from 'typeorm';

import { MemberRepository } from '../repository/member.repository';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { UpdateRatingDto } from '../dto/update-rating.dto';
import { ApiException } from '../exception/api.exception';

@Injectable()
export class RatingService {
  constructor(
    private readonly memberRepository: MemberRepository,
  ) {}

  async createRating(memberId: string, dto: CreateRatingDto) {
    const memberExists =
      await this.memberRepository.existsMemberById(memberId);

    if (!memberExists) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'MEMBER404_1',
        '존재하지 않는 회원입니다.',
      );
    }

    const movieId = String(dto.movieId);

    const existingRating =
      await this.memberRepository.findRatingByMemberAndMovie(
        memberId,
        movieId,
      );

    if (existingRating) {
      throw new ApiException(
        HttpStatus.CONFLICT,
        'RATING409_1',
        '이미 평점을 등록한 영화입니다.',
      );
    }

    try {
      const savedRating = await this.memberRepository.saveRating(
        memberId,
        movieId,
        dto.score,
        dto.comment,
      );

      return {
        ratingId: Number(savedRating.ratingId),
        memberId: Number(savedRating.memberId),
        movieId: Number(savedRating.movieId),
        score: savedRating.score,
        comment: savedRating.comment,
        createdAt: savedRating.createdAt,
        updatedAt: savedRating.updatedAt,
      };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as {
          code?: string;
        };

        if (driverError.code === 'ER_DUP_ENTRY') {
          throw new ApiException(
            HttpStatus.CONFLICT,
            'RATING409_1',
            '이미 평점을 등록한 영화입니다.',
          );
        }
      }

      throw error;
    }
  }

  async getRatingsByMember(memberId: number) {
    const memberExists =
      await this.memberRepository.existsMemberById(
        String(memberId),
      );

    if (!memberExists) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'MEMBER404_1',
        '존재하지 않는 회원입니다.',
      );
    }

    const ratings =
      await this.memberRepository.findRatingsByMemberId(
        String(memberId),
      );

    return ratings.map((rating) => ({
      ratingId: Number(rating.ratingId),
      movieId: Number(rating.movieId),
      score: rating.score,
      comment: rating.comment,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt,
    }));
  }

  async updateRating(
    memberId: string,
    ratingId: string,
    dto: UpdateRatingDto,
  ) {
    const rating =
      await this.memberRepository.findRatingById(ratingId);

    if (!rating) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'RATING404_1',
        '존재하지 않는 평점입니다.',
      );
    }

    if (String(rating.memberId) !== memberId) {
      throw new ApiException(
        HttpStatus.FORBIDDEN,
        'RATING403_1',
        '본인이 작성한 평점만 수정할 수 있습니다.',
      );
    }

    const updatedRating =
      await this.memberRepository.updateRating(
        rating,
        dto.score,
        dto.comment,
      );

    return {
      ratingId: Number(updatedRating.ratingId),
      memberId: Number(updatedRating.memberId),
      movieId: Number(updatedRating.movieId),
      score: updatedRating.score,
      comment: updatedRating.comment,
      createdAt: updatedRating.createdAt,
      updatedAt: updatedRating.updatedAt,
    };
  }

  async deleteRating(
    memberId: string,
    ratingId: string,
  ): Promise<void> {
    const rating =
      await this.memberRepository.findRatingById(ratingId);

    if (!rating) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'RATING404_1',
        '존재하지 않는 평점입니다.',
      );
    }

    if (String(rating.memberId) !== memberId) {
      throw new ApiException(
        HttpStatus.FORBIDDEN,
        'RATING403_1',
        '본인이 작성한 평점만 삭제할 수 있습니다.',
      );
    }

    await this.memberRepository.deleteRating(rating);
  }
}
