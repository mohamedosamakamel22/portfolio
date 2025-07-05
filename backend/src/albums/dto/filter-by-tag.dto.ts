import { IsArray, IsNumber, IsOptional } from "class-validator"
import { Type, Transform } from "class-transformer"
import { ApiPropertyOptional } from "@nestjs/swagger"

export class FilterByTagDto {
    @ApiPropertyOptional({ 
        type: [String], 
        description: 'Filter albums by tags',
        example: ['wedding', 'portrait']
    })
    @IsArray()
    @IsOptional()
    @Transform(({ value }) => {
        if (Array.isArray(value)) {
            return value;
        }
        return value ? [value] : [];
    })
    tags?: string[] = [];

    @ApiPropertyOptional({ 
        type: Number, 
        description: 'Page number (default: 1)',
        example: 1,
        minimum: 1
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    page?: number = 1;

    @ApiPropertyOptional({ 
        type: Number, 
        description: 'Number of items per page (default: 10)',
        example: 10,
        minimum: 1
    })
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    limit?: number = 10;
}
