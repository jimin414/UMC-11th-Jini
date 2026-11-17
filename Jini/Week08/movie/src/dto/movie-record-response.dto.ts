import { Rating } from '../entity/rating.entity';
import { Favorite } from '../entity/favorite.entity';

export class MovieRecordResponseDto {
  rating!: {
    ratingId: string;
    movieId: string;
    score: number;
    comment: string | null;
    createdAt: Date;
  };

  favorite!: {
    favoriteId: string;
    movieId: string;
    createdAt: Date;
  } | null;

  static from(
    rating: Rating,
    favorite: Favorite | null,
  ): MovieRecordResponseDto {
    return {
      rating: {
        ratingId: rating.ratingId,
        movieId: rating.movieId,
        score: rating.score,
        comment: rating.comment,
        createdAt: rating.createdAt,
      },
      favorite: favorite
        ? {
            favoriteId: favorite.favoriteId,
            movieId: favorite.movieId,
            createdAt: favorite.createdAt,
          }
        : null,
    };
  }
}