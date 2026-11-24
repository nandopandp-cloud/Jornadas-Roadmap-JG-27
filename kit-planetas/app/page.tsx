import { Planeta, carregarPlanetas } from '@/components/planetas'

// Página de demonstração: todos os planetas publicados, girando (a lista vem do catálogo na web).
export default async function Pagina() {
  const planetas = await carregarPlanetas()
  return (
    <main className="pagina">
      <header>
        <p className="sobre">Exploradores · Kit de planetas</p>
        <h1>Planetas 3D girando</h1>
        <p>Arraste para girar · setas do teclado · uma volta a cada 40 s</p>
      </header>
      <ul className="grade">
        {planetas.map((p) => (
          <li key={p.id}>
            <Planeta id={p.id} tamanho={260} alt={`Planeta ${p.nome}`} />
            <span>{p.nome}</span>
            <code>{`<Planeta id="${p.id}" />`}</code>
          </li>
        ))}
      </ul>
    </main>
  )
}
