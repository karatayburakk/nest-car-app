import { Controller, Get, Param, Session } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
    return;
  }

  @Get('colors')
  getColor(@Session() session: any) {
    return session.color;
  }
}
