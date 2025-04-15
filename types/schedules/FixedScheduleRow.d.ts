import Day from "./Day.ts";

type FixedScheduleRow = {
    ciclo: number,
    escuela: string,
    codigo_de_asignatura: string,
    asignatura: string,
    aula?: string | null,
    docente: string,
    seccion: number,
    horarios: Record<Day, string>,
    rectificacion: boolean,
};

export default FixedScheduleRow;