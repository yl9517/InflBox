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
import { Type } from 'class-transformer';
import { Platform } from '../enum/platform.enum';

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
  campaign: string;

  @IsString()
  @IsEnum(Platform)
  platform?: string;

  @IsString()
  type?: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content?: string;

  @IsNotEmpty()
  @IsString()
  offer: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Address)
  address?: Address;

  @IsOptional()
  //@IsEnum(Category)
  category?: string; // 카테고리

  @IsOptional()
  applicationEndAt?: string | Date; // 모집 종료 기간

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
