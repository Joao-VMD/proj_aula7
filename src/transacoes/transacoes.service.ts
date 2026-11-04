import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransacaoDto } from './dto/create-transacao.dto';
import { Transacao, TransacaoDocument } from './schemas/transacao.schema';

export interface Metricas {
  saldoTotal: number;
  totalDespesas: number;
  totalGastoImpulso: number;
}

export interface TransacoesResponse {
  historico: Transacao[];
  metricas: Metricas;
}

const arredondar = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

@Injectable()
export class TransacoesService {
  constructor(
    @InjectModel(Transacao.name)
    private readonly transacaoModel: Model<TransacaoDocument>,
  ) {}

  async create(dto: CreateTransacaoDto): Promise<Transacao> {
    return this.transacaoModel.create(dto);
  }

  async findAll(): Promise<TransacoesResponse> {
    const historico = await this.transacaoModel
      .find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return { historico, metricas: this.calcularMetricas(historico) };
  }

  calcularMetricas(
    transacoes: Pick<Transacao, 'valor' | 'tipo' | 'consumoConsciente'>[],
  ): Metricas {
    let totalReceitas = 0;
    let totalDespesas = 0;
    let totalGastoImpulso = 0;

    for (const t of transacoes) {
      if (t.tipo === 'receita') {
        totalReceitas += t.valor;
      } else if (t.tipo === 'despesa') {
        totalDespesas += t.valor;
        if (t.consumoConsciente === false) {
          totalGastoImpulso += t.valor;
        }
      }
    }

    return {
      saldoTotal: arredondar(totalReceitas - totalDespesas),
      totalDespesas: arredondar(totalDespesas),
      totalGastoImpulso: arredondar(totalGastoImpulso),
    };
  }
}
