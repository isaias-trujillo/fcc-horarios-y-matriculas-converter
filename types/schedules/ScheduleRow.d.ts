import Day from "./Day.ts";

type ScheduleRow = {
    MAESTRIA: string;
    CODIGO: string;
    ASIGNATURA: string;
    HR: number;
    CR: number;
    Ciclo: number | `${number}-${string}`;
    DOCENTE: string;
    MODULO: number | `${number}-${number}`;
    [key: keyof Day]: string;
};

export default ScheduleRow;