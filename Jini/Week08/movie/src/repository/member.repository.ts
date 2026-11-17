
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { Member } from '../entity/member.entity';
import { Rating } from '../entity/rating.entity';

@Injectable()
export class MemberRepository {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async existsByNickname(nickname: string): Promise<boolean> {
    return this.memberRepository.exists({
      where: { nickname },
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.memberRepository.exists({
      where: { email },
    });
  }

  async findRatingsByMemberId(memberId: string): Promise<Rating[]> {
    return this.ratingRepository.find({
      where: { memberId },
      order: { createdAt: 'DESC' },
    });
  }

  async saveMember(
    email: string,
    hashedPassword: string,
    nickname: string,
  ): Promise<Member> {
    const member = this.memberRepository.create({
      email,
      password: hashedPassword,
      nickname,
    });

    return this.memberRepository.save(member);
  }

  async existsMemberById(memberId: string): Promise<boolean> {
    return this.memberRepository.exists({
      where: { memberId },
    });
  }

  async findRatingByMemberAndMovie(
    memberId: string,
    movieId: string,
  ): Promise<Rating | null> {
    return this.ratingRepository.findOne({
      where: { memberId, movieId },
    });
  }

  async saveRating(
    memberId: string,
    movieId: string,
    score: number,
    comment?: string,
  ): Promise<Rating> {
    const rating = this.ratingRepository.create({
      memberId,
      movieId,
      score,
      comment: comment ?? null,
    });

    return this.ratingRepository.save(rating);
  }

  async findRatingById(ratingId: string): Promise<Rating | null> {
    return this.ratingRepository.findOne({
      where: { ratingId },
    });
  }

  async findById(memberId: number): Promise<Member | null> {
    return this.memberRepository.findOne({
      where: { memberId: String(memberId) },
    });
  }

  async updateRating(
    rating: Rating,
    score?: number,
    comment?: string,
  ): Promise<Rating> {
    if (score !== undefined) {
      rating.score = score;
    }

    if (comment !== undefined) {
      rating.comment = comment;
    }

    return this.ratingRepository.save(rating);
  }

  async deleteRating(rating: Rating): Promise<void> {
    await this.ratingRepository.remove(rating);
  }
  async findOtherMemberByNickname(
    nickname: string,
    memberId: number,
  ): Promise<Member | null> {
    return this.memberRepository.findOne({
      where: {
        nickname,
        memberId: Not(String(memberId)),
      },
    });
  }

  async saveUpdatedMember(member: Member): Promise<Member> {
    return this.memberRepository.save(member);
  }
}
