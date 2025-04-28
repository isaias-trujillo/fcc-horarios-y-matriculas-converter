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
    codigo_de_asignatura_de_referencia? : string | null,
    seccion_de_referencia? : string | null,
    aula_de_referencia?: string | null,
};

export default FixedScheduleRow;