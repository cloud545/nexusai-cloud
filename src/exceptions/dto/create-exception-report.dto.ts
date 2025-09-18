// FILE: nexusai-cloud/apps/api/src/exceptions/dto/create-exception-report.dto.ts

import { IsString, IsNotEmpty, IsJSON, IsUrl, IsOptional } from 'class-validator';

// --- MAKE SURE 'export' KEYWORD IS HERE ---
export class CreateExceptionReportDto {
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  personaId: string;

  @IsJSON()
  @IsNotEmpty()
  task: string; // The task object, stringified

  @IsString()
  @IsNotEmpty()
  failedAction: string;

  @IsOptional()
  @IsString()
  failedSelector?: string;

  @IsUrl()
  @IsNotEmpty()
  pageUrl: string;
  
  @IsString()
  @IsNotEmpty()
  htmlSnapshot: string;
  
  @IsString()
  @IsNotEmpty()
  screenshotBase64: string;
  
  // We are adding this field to match our latest robust handleDefinitiveFailure function
  @IsString()
  @IsNotEmpty()
  errorMessage: string;
}