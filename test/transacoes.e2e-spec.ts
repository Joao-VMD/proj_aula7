import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { Transacao } from '../src/transacoes/schemas/transacao.schema';
import { TransacoesController } from '../src/transacoes/transacoes.controller';
import { TransacoesService } from '../src/transacoes/transacoes.service';

describe('/transacoes (e2e, model mockado)', () => {
  let app: INestApplication;
  const banco: any[] = [];

  const modelMock = {
    create: async (dto: any) => {
      banco.push({ consumoConsciente: true, ...dto });
      return banco[banco.length - 1];
    },
    find: () => ({
      sort: () => ({ lean: () => ({ exec: async () => banco }) }),
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TransacoesController],
      providers: [
        TransacoesService,
        { provide: getModelToken(Transacao.name), useValue: modelMock },
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(() => app.close());

  it('POST rejeita tipo inválido', () =>
    request(app.getHttpServer())
      .post('/transacoes')
      .send({ descricao: 'X', valor: 10, tipo: 'outro', categoria: 'Lazer' })
      .expect(400));

  it('POST cadastra receita e despesa', async () => {
    await request(app.getHttpServer())
      .post('/transacoes')
      .send({ descricao: 'Salário', valor: 2000, tipo: 'receita', categoria: 'Renda' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/transacoes')
      .send({ descricao: 'Compra de Roupas', valor: 300, tipo: 'despesa', categoria: 'Lazer', consumoConsciente: false })
      .expect(201);
  });

  it('GET retorna historico e metricas', async () => {
    const res = await request(app.getHttpServer()).get('/transacoes').expect(200);
    expect(res.body.historico).toHaveLength(2);
    expect(res.body.metricas).toEqual({
      saldoTotal: 1700,
      totalDespesas: 300,
      totalGastoImpulso: 300,
    });
  });
});
