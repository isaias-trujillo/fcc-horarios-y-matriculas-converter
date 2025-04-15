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

    /**
     * If ciclo is a number, then, the seccion is 1.
     * If ciclo is a string and matches the pattern: number-(A|B|C...), then, the seccion is the correlative number.
     * e.g. ciclo: 10-A, seccion: 1 (ends in 'A')
     * e.g. ciclo: 10-B, seccion: 2 (ends in 'B')
     * e.g. ciclo: 10-C, seccion: 3 (ends in 'C')
     */


    let seccion : number | undefined;
    if (typeof prefixed.Ciclo === 'number') {
        seccion = 1;
    }else {
        const match = prefixed.Ciclo.toString().match(/(\d+)-([A-Z])/);
        if (match && match[2]) {
            // convert match[2] to number: A -> 1, B -> 2, C -> 3, etc.
            seccion = parseInt(String(match[2].charCodeAt(0) - 64));
        }
    }

    if (!seccion) {
        throw new Error(`Invalid ciclo: ${prefixed.Ciclo}`);
    }

    try {
        return {
            ciclo: (prefixed.Ciclo.toString().split('-').map(s => parseInt(s))[0] ?? 0) || 10,
            escuela: prefixed.MAESTRIA,
            codigo_de_asignatura: prefixed.CODIGO,
            asignatura: prefixed.ASIGNATURA,
            docente: prefixed.DOCENTE,
            seccion,
            horarios,
            rectificacion: 'rectificacion' in prefixed ? prefixed.rectificacion as boolean : false,
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