// FILE: nexusai-cloud/apps/api/src/settings/dto/update-ai-settings.dto.ts

import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAiSettingsDto {
  @IsString()
  @IsIn(['ollama', 'qwen'])
  aiProvider: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  ollamaModel?: string;

  
  // --- 替换为Qwen字段 ---
  @IsOptional() @IsString()
  qwenApiKey?: string;

  @IsOptional() @IsString() @IsNotEmpty()
  qwenModelName?: string;
}