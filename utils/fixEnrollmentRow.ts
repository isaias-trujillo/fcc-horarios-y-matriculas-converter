import fixMyString from "./fixMyString.ts";
import type EnrollementRow from "../types/enrollments/EnrollementRow";
import type FixedEnrollementRow from "../types/enrollments/FixedEnrollementRow";

const fixEnrollmentRow = (row: EnrollementRow): FixedEnrollementRow | null => {
    const prefixed = Object.fromEntries(Object.entries(row).map(([k, v]) => {
        const key = k as keyof EnrollementRow;
        const value = v as typeof row[typeof key];
        if (typeof value === 'string') {
            return [fixMyString(key.toString()), fixMyString(value)];
        }
        return [fixMyString((key.toString())), value];
    })) as EnrollementRow;

    try {
        return {
            codigo: prefixed.cod_alumno,
            apellido_paterno: prefixed.ape_paterno,
            apellido_materno: prefixed.ape_materno,
            nombres: prefixed.nom_alumno,
            codigo_de_asignatura: prefixed.cod_asignatura,
            seccion: prefixed.cod_seccion,
            ciclo: prefixed.num_ciclo_ano_asig || 10,
            asignatura: prefixed.des_asignatura,
            ingreso: prefixed.anio_ingreso,
            correo: prefixed.coe_alumno,
            escuela: prefixed.escuela,
            plan_de_estudios: prefixed.cod_plan,
        };
    } catch (e) {
        console.log({
            row,
            error: e,
        });
        return null;
    }
};

export default fixEnrollmentRow;