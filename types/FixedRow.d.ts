import Day from "./Day";

type FixedRow = {
    ciclo: number,
    escuela: string,
    codigo_de_asignatura: string,
    asignatura: string,
    aula?: string | null,
    docente: string,
    seccion: number,
    horarios: Record<Day, string>
};

export default FixedRow;