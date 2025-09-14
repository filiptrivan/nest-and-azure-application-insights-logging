import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('notes')
  notes() {
    return [
      { id: 1, text: "Note 1" },
      { id: 2, text: "Note 2" },
    ];
  }
}
