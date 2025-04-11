import type Row from "../types/Row";
import type FixedRow from "../types/FixedRow";
import fixMyString from "./fixMyString.ts";
import Day from "../types/Day.ts";

const fixRow = (row: Row): FixedRow | null => {
    const prefixed = Object.fromEntries(Object.entries(row).map(([k, v]) => {
        const key = k as keyof Row;
        const value = v as typeof row[typeof key];
        if (typeof value === 'string') {
            return [fixMyString(key.toString()), fixMyString(value)];
        }
        return [fixMyString((key.toString())), value];
    })) as Row;

    const horarios = Object.entries(Day).reduce((acc, [k, v]) => {
        const key = k as keyof Row;
        if (prefixed[key]) {
            acc[v] = prefixed[key] as string;
            delete prefixed[key];
        }
        return acc;
    }, {} as FixedRow['horarios']);

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

export default fixRow;