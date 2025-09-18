// FILE: nexusai-cloud/apps/api/src/settings/settings.service.ts
// FINAL QWEN-READY VERSION

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAiSettingsDto } from './dto/update-ai-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 获取指定用户的AI配置。
   * @param userId 用户的ID.
   * @returns 用户的AI配置对象，API Key会被屏蔽。
   */
  async getAiSettings(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        aiProvider: true,
        ollamaModel: true,
        qwenApiKey: true,      // <-- 读取新的 Qwen 字段
        qwenModelName: true,   // <-- 读取新的 Qwen 字段
      },
    });

    if (!user) {
      // 如果找不到用户，抛出标准的404错误
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    // 在将数据发送到前端之前，屏蔽敏感的API Key
    if (user.qwenApiKey) {
      user.qwenApiKey = "**********";
    }

    return user;
  }

  /**
   * 更新指定用户的AI配置。
   * @param userId 用户的ID.
   * @param dto 包含更新数据的DTO.
   * @returns 更新后的用户AI配置对象，API Key同样会被屏蔽。
   */
  async updateAiSettings(userId: string, dto: UpdateAiSettingsDto) {
    // 准备一个用于更新数据库的对象
    const dataToUpdate: {
      aiProvider: string;
      ollamaModel?: string | null;
      qwenApiKey?: string;
      qwenModelName?: string | null;
    } = {
      aiProvider: dto.aiProvider,
    };

    if (dto.aiProvider === 'ollama') {
      // 如果选择Ollama，我们只更新Ollama模型名称，并可以考虑清空Qwen的配置
      dataToUpdate.ollamaModel = dto.ollamaModel || null;
      // dataToUpdate.qwenApiKey = null; // 可选：切换时清空另一方的设置
      // dataToUpdate.qwenModelName = null;
    } else if (dto.aiProvider === 'qwen') {
      // 如果选择Qwen，我们只更新Qwen相关的字段
      dataToUpdate.qwenModelName = dto.qwenModelName || null;
      
      // 关键逻辑：只有在用户提供了新的、非空的、非屏蔽值的API Key时，我们才更新它。
      // 这可以防止用户无意中用"**********"覆盖掉自己真实的Key。
      if (dto.qwenApiKey && dto.qwenApiKey.trim() !== '' && dto.qwenApiKey !== '**********') {
        // 在实际生产环境中，这里应该是加密步骤
        // const encryptedKey = await encrypt(dto.qwenApiKey);
        // dataToUpdate.qwenApiKey = encryptedKey;
        dataToUpdate.qwenApiKey = dto.qwenApiKey;
      }
      
      // dataToUpdate.ollamaModel = null; // 可选：切换时清空另一方的设置
    }

    console.log("即将写入数据库的AI配置数据:", dataToUpdate); // 用于调试

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: { // 只选择需要返回给前端的字段
        aiProvider: true,
        ollamaModel: true,
        qwenApiKey: true,
        qwenModelName: true,
      },
    });
    
    // 再次屏蔽返回数据中的API Key，确保安全闭环
    if (updatedUser.qwenApiKey) {
      updatedUser.qwenApiKey = "**********";
    }

    return updatedUser;
  }
}