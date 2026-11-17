import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Member } from '../entity/member.entity';
import { Rating } from '../entity/rating.entity';
import { Favorite } from '../entity/favorite.entity';

import { CreateMovieRecordDto } from '../dto/create-movie-record.dto';
import { MovieRecordResponseDto } from '../dto/movie-record-response.dto';

import { ApiException } from '../exception/api.exception';

@Injectable()
export class MovieRecordService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

  async create(
    memberId: string,
    dto: CreateMovieRecordDto,
  ): Promise<MovieRecordResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      // 트랜잭션 내부 Repository
      const memberRepository = manager.getRepository(Member);
      const ratingRepository = manager.getRepository(Rating);
      const favoriteRepository = manager.getRepository(Favorite);

      // 1. 회원 존재 확인
      const member = await memberRepository.findOne({
        where: { memberId: String(memberId) },
      });

      if (!member) {
        throw new ApiException(
          HttpStatus.NOT_FOUND,
          'MEMBER404_1',
          '해당 회원을 찾을 수 없습니다.',
        );
      }

      const movieId = String(dto.movieId);

      // 2. 평점 중복 확인
      const existingRating = await ratingRepository.findOne({
        where: {
          memberId: String(memberId),
          movieId,
        },
      });

      if (existingRating) {
        throw new ApiException(
          HttpStatus.CONFLICT,
          'RATING409_1',
          '이미 이 영화에 평점을 등록하셨습니다.',
        );
      }

      // 3. 즐겨찾기 중복 확인
      if (dto.addToFavorites) {
        const existingFavorite = await favoriteRepository.findOne({
          where: {
            member: { memberId: String(memberId) },
            movieId,
          },
        });

        if (existingFavorite) {
          throw new ApiException(
            HttpStatus.CONFLICT,
            'FAVORITE409_1',
            '이미 이 영화를 즐겨찾기하셨습니다.',
          );
        }
      }

      // 4. 평점 저장
      const rating = ratingRepository.create({
        memberId: String(memberId),
        movieId,
        score: dto.score,
        comment: dto.comment ?? null,
      });

      const savedRating = await ratingRepository.save(rating);

      // 5. 즐겨찾기 저장
      let savedFavorite: Favorite | null = null;

      if (dto.addToFavorites) {
        const favorite = favoriteRepository.create({
          member,
          movieId,
        });

        savedFavorite = await favoriteRepository.save(favorite);
      }

      // 6. 결과 반환
      return MovieRecordResponseDto.from(
        savedRating,
        savedFavorite,
      );
    });
  }
}