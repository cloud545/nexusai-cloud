import {
  IsNotEmpty,
  IsString,
  IsObject,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateExceptionReportDto {
  /**
   * 关联的Facebook账号ID
   * @example "100083452362381"
   */
  @IsString()
  @IsNotEmpty()
  accountId: string;

  /**
   * 关联的Persona ID
   * @example "persona-123"
   */
  @IsString()
  @IsNotEmpty()
  personaId: string;

  /**
   * 当时执行的完整任务对象
   */
  @IsObject()
  task: object;

  /**
   * 失败的动作名称 (例如 "scrapePostsFromTarget")
   * @example "scrapePostsFromTarget"
   */
  @IsString()
  @IsNotEmpty()
  failedAction: string;

  /**
   * 导致失败的选择器 (可能是后备选择器或鹰眼选择器)
   * @example "div[data-testid='post-container']"
   */
  @IsOptional()
  @IsString()
  failedSelector?: string;

  /**
   * 异常发生时的页面URL
   * @example "https://www.facebook.com/groups/somegroup"
   */
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  pageUrl: string;

  /**
   * HTML快照
   */
  @IsString()
  @IsNotEmpty()
  htmlSnapshot: string;

  /**
   * 截图Base64
   */
  @IsString()
  @IsNotEmpty()
  screenshotBase64: string;
}
