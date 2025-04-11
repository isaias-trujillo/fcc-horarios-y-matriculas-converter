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
            codigo: prefixed.Codigo,
            apellido_paterno: prefixed.Apellido_Paterno,
            apellido_materno: prefixed.Apellido_Materno,
            nombres: prefixed.Nombres,
            codigo_de_asignatura: prefixed.Cod_Asignatura,
            seccion: prefixed.Seccion,
            ciclo: prefixed.Num_Ciclo_Ano_Asig,
            asignatura: prefixed.Asigantura,
            ingreso: prefixed.Anio_Ingreso.toString(),
            correo: prefixed.Coe_Alumno,
            plan_de_estudios: prefixed.Plan,
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