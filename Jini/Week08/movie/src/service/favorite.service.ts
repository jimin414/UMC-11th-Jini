import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Favorite } from '../entity/favorite.entity';
import { Member } from '../entity/member.entity';

import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { FavoriteResponseDto } from '../dto/favorite-response.dto';
import { FavoriteStatusResponseDto } from '../dto/favorite-status-response.dto';

import { ApiException } from '../exception/api.exception';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  // 즐겨찾기 등록
  async create(
    memberId: string,
    dto: CreateFavoriteDto,
  ): Promise<FavoriteResponseDto> {
    const member = await this.memberRepository.findOne({
      where: { memberId: String(memberId) },
    });

    if (!member) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'MEMBER404_1',
        '해당 회원을 찾을 수 없습니다.',
      );
    }

    const existing = await this.favoriteRepository.findOne({
      where: {
        member: { memberId: String(memberId) },
        movieId: String(dto.movieId),
      },
    });

    if (existing) {
      throw new ApiException(
        HttpStatus.CONFLICT,
        'FAVORITE409_1',
        '이미 이 영화를 즐겨찾기하셨습니다.',
      );
    }

    const favorite = this.favoriteRepository.create({
      member,
      movieId: String(dto.movieId),
    });

    const saved = await this.favoriteRepository.save(favorite);

    return FavoriteResponseDto.from(saved);
  }

  // 내 즐겨찾기 목록 조회
  async getMyFavorites(
    memberId: string,
  ): Promise<FavoriteResponseDto[]> {
    const favorites = await this.favoriteRepository.find({
      where: {
        member: { memberId: String(memberId) },
      },
      order: {
        favoriteId: 'DESC',
      },
    });

    return favorites.map((favorite) =>
      FavoriteResponseDto.from(favorite),
    );
  }

  // 특정 영화 즐겨찾기 여부 조회
  async getStatus(
    memberId: string,
    movieId: number,
  ): Promise<FavoriteStatusResponseDto> {
    const isFavorite = await this.favoriteRepository.exists({
      where: {
        member: { memberId: String(memberId) },
        movieId: String(movieId),
      },
    });

    return FavoriteStatusResponseDto.from(isFavorite);
  }

  // 즐겨찾기 해제
  async delete(memberId: string, movieId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: {
        member: { memberId: String(memberId) },
        movieId: String(movieId),
      },
    });

    if (!favorite) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'FAVORITE404_1',
        '즐겨찾기한 영화를 찾을 수 없습니다.',
      );
    }

    await this.favoriteRepository.remove(favorite);
  }
}