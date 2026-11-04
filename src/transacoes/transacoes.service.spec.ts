import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Transacao } from './schemas/transacao.schema';
import { TransacoesService } from './transacoes.service';

describe('TransacoesService - métricas', () => {
  let service: TransacoesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TransacoesService,
        { provide: getModelToken(Transacao.name), useValue: {} },
      ],
    }).compile();
    service = moduleRef.get(TransacoesService);
  });

  it('calcula saldo, total de despesas e gasto por impulso', () => {
    const m = service.calcularMetricas([
      { tipo: 'receita', valor: 3000, consumoConsciente: true },
      { tipo: 'despesa', valor: 1000, consumoConsciente: true },
      { tipo: 'despesa', valor: 250.5, consumoConsciente: false },
      { tipo: 'despesa', valor: 99.9, consumoConsciente: false },
    ]);
    expect(m).toEqual({
      saldoTotal: 1649.6,
      totalDespesas: 1350.4,
      totalGastoImpulso: 350.4,
    });
  });

  it('retorna zeros quando não há transações', () => {
    expect(service.calcularMetricas([])).toEqual({
      saldoTotal: 0,
      totalDespesas: 0,
      totalGastoImpulso: 0,
    });
  });

  it('receitas nunca entram no gasto por impulso', () => {
    const m = service.calcularMetricas([
      { tipo: 'receita', valor: 500, consumoConsciente: false },
    ]);
    expect(m.totalGastoImpulso).toBe(0);
    expect(m.saldoTotal).toBe(500);
  });
});
