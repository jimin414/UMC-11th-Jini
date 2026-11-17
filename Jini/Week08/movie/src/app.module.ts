
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entity
import { Member } from './entity/member.entity';
import { Rating } from './entity/rating.entity';
import { Favorite } from './entity/favorite.entity';

// Repository
import { MemberRepository } from './repository/member.repository';

// Service
import { MemberService } from './service/member.service';
import { RatingService } from './service/rating.service';
import { AuthService } from './service/auth.service';
import { FavoriteService } from './service/favorite.service';
import { MovieRecordService } from './service/movie-record.service';

// Controller
import { MemberController } from './controller/member.controller';
import { RatingController } from './controller/rating.controller';
import { AuthController } from './controller/auth.controller';
import { FavoriteController } from './controller/favorite.controller';
import { MovieRecordController } from './controller/movie-record.controller';

// Guard
import { AuthGuard } from './guard/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: Number(
            configService.get<string>('JWT_ACCESS_EXPIRATION') ?? 3600,
          ),
        },
      }),
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: Number(configService.getOrThrow<string>('DB_PORT')),
        username: configService.getOrThrow<string>('DB_USER'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),

        entities: [Member, Rating, Favorite],

        synchronize: false,
        autoLoadEntities: true,
      }),
    }),

    TypeOrmModule.forFeature([
      Member,
      Rating,
      Favorite,
    ]),
  ],

  controllers: [
    AppController,
    MemberController,
    RatingController,
    AuthController,
    FavoriteController,
    MovieRecordController,
  ],

  providers: [
    AppService,
    MemberRepository,
    MemberService,
    RatingService,
    AuthService,
    AuthGuard,
    FavoriteService,
    MovieRecordService,
  ],
})
export class AppModule {}
