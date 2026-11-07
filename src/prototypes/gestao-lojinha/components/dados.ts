import { useMemo, useState } from 'react'
import { AGORA, extratoDe, pessoaAt, type Mov, type Pessoa } from '../data'
import { useAdm } from '../store'

/** pessoa com as alterações feitas no admin (status e ajustes de saldo) */
export function usePessoa(idx: number): Pessoa {
  const { s, d } = useAdm()
  return useMemo(() => aplicar(pessoaAt(s.plataforma, idx), d.statusPessoa[idx], d.ajustes[idx]), [s.plataforma, idx, d.statusPessoa, d.ajustes])
}
export function aplicar(p: Pessoa, status?: 'ativo' | 'inativo', ajustes?: Mov[]): Pessoa {
  const delta = (ajustes ?? []).reduce((a, m) => a + m.pontos, 0)
  return { ...p, status: status ?? p.status, saldo: p.saldo + delta, ultimo: p.ultimo }
}
/** extrato completo (gerado + ajustes manuais), do mais recente para o mais antigo */
export function useExtrato(idx: number): Mov[] {
  const { s, d } = useAdm()
  return useMemo(() => {
    const base = extratoDe(s.plataforma, pessoaAt(s.plataforma, idx), d.itens)
    const aj = d.ajustes[idx] ?? []
    if (!aj.length) return base
    // ajustes entram no topo; o saldo após de cada linha antiga não muda
    const saldoBase = pessoaAt(s.plataforma, idx).saldo
    let acum = saldoBase
    const novos = [...aj].reverse().map((m) => {
      acum += m.pontos
      return { ...m, saldoApos: acum }
    })
    return [...novos.reverse(), ...base]
  }, [s.plataforma, idx, d.itens, d.ajustes])
}
export function usePagina(porPaginaInicial = 10) {
  const [pagina, setPagina] = useState(1)
  const [porPagina, setPorPagina] = useState(porPaginaInicial)
  return { pagina, setPagina, porPagina, setPorPagina, fatia: <T,>(xs: T[]) => xs.slice((pagina - 1) * porPagina, pagina * porPagina) }
}
export const agoraMais = (n: number) => AGORA + n * 60_000
