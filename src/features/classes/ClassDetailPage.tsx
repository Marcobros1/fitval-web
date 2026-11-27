import { Link, useParams } from "react-router";
import { useGetClassQuery } from "../../app/api";
import { formatDate } from "../../app/format";
import { Loading } from "../../components/ui/Loading";
import { SpotsBadge } from "./SpotsBadge";

export function ClassDetailPage() {
  const { id = "" } = useParams();
  const { data: gymClass, isLoading, isError } = useGetClassQuery(id);

  if (isLoading) return <Loading text="Cargando clase..." />;

  if (isError || !gymClass) {
    return (
      <>
        <p className="error">Esa clase no existe.</p>
        <Link to="/classes">Volver al horario</Link>
      </>
    );
  }

  return (
    <article>
      <Link to="/classes">← Volver al horario</Link>
      <h1>{gymClass.activity}</h1>
      <SpotsBadge spots={gymClass.spots} />
      <p>Cuándo: {formatDate(gymClass.startsAt)}</p>
      <p>Sala: {gymClass.room}</p>
      <p>Monitor: {gymClass.trainerName}</p>
    </article>
  );
}
