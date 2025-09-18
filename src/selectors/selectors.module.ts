import { Module } from '@nestjs/common';
import { SelectorsController } from './selectors.controller';
import { SelectorsService } from './selectors.service';

@Module({
  controllers: [SelectorsController],
  providers: [SelectorsService]
})
export class SelectorsModule {}
