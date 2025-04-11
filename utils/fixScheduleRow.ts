import type ScheduleRow from "../types/schedules/ScheduleRow";
import type FixedScheduleRow from "../types/schedules/FixedScheduleRow";
import fixMyString from "./fixMyString.ts";
import Day from "../types/schedules/Day.ts";

const fixScheduleRow = (row: ScheduleRow): FixedScheduleRow | null => {
    const prefixed = Object.fromEntries(Object.entries(row).map(([k, v]) => {
        const key = k as keyof ScheduleRow;
        const value = v as typeof row[typeof key];
        if (typeof value === 'string') {
            return [fixMyString(key.toString()), fixMyString(value)];
        }
        return [fixMyString((key.toString())), value];
    })) as ScheduleRow;

    const horarios = Object.entries(Day).reduce((acc, [k, v]) => {
        const key = k as keyof ScheduleRow;
        if (prefixed[key]) {
            acc[v] = prefixed[key] as string;
            delete prefixed[key];
        }
        return acc;
    }, {} as FixedScheduleRow['horarios']);

    try {
        return {
            ciclo: prefixed.Ciclo.toString().split('-').map(s => parseInt(s))[0] ?? 0,
            escuela: prefixed.MAESTRIA,
            codigo_de_asignatura: prefixed.CODIGO,
            asignatura: prefixed.ASIGNATURA,
            docente: prefixed.DOCENTE,
            seccion: 1,
            horarios
        };
    } catch (e) {
        console.log({
            row,
            error: e,
        });
        return null;
    }
};

export default fixScheduleRow;