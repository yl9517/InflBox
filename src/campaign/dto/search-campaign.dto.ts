import {
  IsDate,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CampaignSite } from '../enum/campaign-site.enum';
import { Category } from '../enum/category.enum';
import { Type } from 'class-transformer';

class Address {
  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  sido?: string;

  @IsOptional()
  @IsString()
  jibunAddress?: string;

  @IsOptional()
  @IsString()
  detailAddress?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  lat?: string;

  @IsOptional()
  @IsString()
  lng?: string;
}
export class SearchCampaignDto {
  @IsNotEmpty()
  @IsString()
  linkUrl: string;

  @IsString()
  siteLogo: string;

  @IsNotEmpty()
  @IsEnum(CampaignSite)
  campaign: CampaignSite;

  @IsString()
  platform?: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  offer: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  address?: Address;

  @IsOptional()
  @IsEnum(Category)
  category: Category; // 카테고리

  @IsOptional()
  @IsDate()
  applicationStartAt?: Date; // 신청 시작 시간

  @IsOptional()
  @IsDate()
  applicationEndAt?: Date; // 모집 종료 기간

  @IsNotEmpty()
  @IsDate()
  winnerAnnouncementAt?: Date; // 당첨 발표 일자

  @IsOptional()
  @IsDate()
  contentStartAt?: Date; // 콘텐츠 등록 시작 기간

  @IsOptional()
  @IsDate()
  contentEndAt?: Date; // 콘텐츠 체험 종료 기간

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  capacity: number; // 모집 인원

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  applicantCount: number; // 신청 인원

  @IsString()
  thumbnail?: string;
}
