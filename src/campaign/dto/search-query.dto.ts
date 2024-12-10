import { IsString, IsOptional, IsEnum } from 'class-validator';
import { SortOption } from '../enum/sort.enum';

export class SearchQueryDto {
  @IsString()
  search: string;

  @IsOptional()
  @IsEnum(SortOption, {
    message: `Sort must be one of the following: ${Object.values(SortOption).join(', ')}`,
  })
  sort?: SortOption = SortOption.LATEST;
}
