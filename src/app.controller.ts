import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Olá Mundo! API de Controle Financeiro Pessoal no ar.';
  }
}
