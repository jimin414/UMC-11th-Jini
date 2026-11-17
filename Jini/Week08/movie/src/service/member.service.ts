
import {
  Injectable,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { MemberRepository } from '../repository/member.repository';
import { CheckResponseDto } from '../dto/check-response.dto';
import { CreateMemberDto } from '../dto/create-member.dto';
import { MemberInfoResponseDto } from '../dto/member-info-response.dto';
import { ApiException } from '../exception/api.exception';
import { MemberUpdateRequestDto } from '../dto/member-update-request.dto';

@Injectable()
export class MemberService {
  async updateMyInfo(
    memberId: number,
    dto: MemberUpdateRequestDto,
  ): Promise<MemberInfoResponseDto> {
    const member = await this.memberRepository.findById(memberId);

    if (!member) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'MEMBER404_1',
        '존재하지 않는 회원입니다.',
      );
    }

    const duplicateMember =
      await this.memberRepository.findOtherMemberByNickname(
        dto.nickname,
        memberId,
      );

    if (duplicateMember) {
      throw new ApiException(
        HttpStatus.CONFLICT,
        'MEMBER409_1',
        '이미 사용 중인 닉네임입니다.',
      );
    }

    member.nickname = dto.nickname;

    const updatedMember =
      await this.memberRepository.saveUpdatedMember(member);

    return MemberInfoResponseDto.from(updatedMember);
  }
  constructor(
    private readonly memberRepository: MemberRepository,
  ) {}

  async getMyInfo(memberId: number): Promise<MemberInfoResponseDto> {
    const member = await this.memberRepository.findById(memberId);

    if (!member) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        'MEMBER404_1',
        '존재하지 않는 회원입니다.',
      );
    }

    return MemberInfoResponseDto.from(member);
  }

  async checkNickname(nickname: string): Promise<CheckResponseDto> {
    const exists = await this.memberRepository.existsByNickname(nickname);

    return {
      available: !exists,
    };
  }

  async checkEmail(email: string): Promise<{ available: boolean }> {
    const exists = await this.memberRepository.existsByEmail(email);

    return {
      available: !exists,
    };
  }

  async getMemberRatings(memberId: string) {
    const ratings = await this.memberRepository.findRatingsByMemberId(memberId);

    return ratings.map((rating) => ({
      ratingId: Number(rating.ratingId),
      movieId: Number(rating.movieId),
      score: rating.score,
      comment: rating.comment,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt,
    }));
  }

  async signUp(dto: CreateMemberDto) {
    const existingEmail = await this.memberRepository.existsByEmail(dto.email);

    if (existingEmail) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    const existingNickname = await this.memberRepository.existsByNickname(
      dto.nickname,
    );

    if (existingNickname) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const savedMember = await this.memberRepository.saveMember(
      dto.email,
      hashedPassword,
      dto.nickname,
    );

    return {
      memberId: savedMember.memberId,
      email: savedMember.email,
      nickname: savedMember.nickname,
    };
  }
}
