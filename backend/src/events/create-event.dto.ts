import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { isArrayBuffer } from "util/types";

export class CreateEventDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'Title of the event' })
    title: string

    @IsNotEmpty()
    @ApiProperty({ example: 'Write a description for your event here' })
    description: string

    @IsInt()
    @ApiProperty({ example: 'Set a price for your tickets here' })
    price: number;

    @IsDateString()
    @ApiProperty({ example: 'Set the date for your event here' })
    date: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string

    @IsOptional()
    @IsString()
    location?: string

    @IsOptional()
    @IsArray()
    agenda?: any[];

    @IsOptional()
    @IsArray()
    ticket?: any[]

    @IsOptional()
    @IsString()
    category?: string

    @IsOptional()
    @IsInt()
    capacity?: number

    @IsOptional()
    refundPolicy?: string;

    @IsOptional()
    isOnline?: boolean;
}

