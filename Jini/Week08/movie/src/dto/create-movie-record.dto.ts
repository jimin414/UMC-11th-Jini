import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateMovieRecordDto {
  @IsInt()
  @IsPositive()
  movieId!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  score!: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsBoolean()
  addToFavorites!: boolean;
}