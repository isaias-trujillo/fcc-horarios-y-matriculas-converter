import { readFile, utils } from "xlsx";
import type FormattedSchedule from "./types/FormattedSchedule";
import {fixMyString} from "./types/mapRawToParsedFichas.ts";

const filename = "horarios-de-nivelacion-procesados-del-viernes";
const path = `data/${filename}.xlsx`;

const file = readFile(path);

const sheet = file.SheetNames[0];

if (!sheet) {
    throw new Error("Sheet not found");
}

const ws = file.Sheets[sheet];

if (!ws) {
    throw new Error("Worksheet not found");
}

const cleanRow = (row: FormattedSchedule): FormattedSchedule | null => {
    try {
        return {
        ...row,
            escuela: fixMyString(row.escuela),
            codigo_de_asignatura: fixMyString(row.codigo_de_asignatura),
            asignatura: fixMyString(row.asignatura),
            aula: row.aula ? typeof row.aula === "string" ? fixMyString(row.aula) : row.aula.toString() : null,
            identificacion: fixMyString(row.identificacion),
            apellido_paterno: fixMyString(row.apellido_paterno),
            apellido_materno: fixMyString(row.apellido_materno),
            nombres: fixMyString(row.nombres),
            dia_de_la_semana: fixMyString(row.dia_de_la_semana),
            hora_de_inicio: ifHourIsZeroParseOrReturnAsString(row.hora_de_inicio),
            hora_de_finalizacion: ifHourIsZeroParseOrReturnAsString(row.hora_de_finalizacion),
            codigo_de_asignatura_de_referencia: row.codigo_de_asignatura_de_referencia ? fixMyString(row.codigo_de_asignatura_de_referencia) : null,
            aula_de_referencia: row.aula_de_referencia ? typeof row.aula_de_referencia === "string" ? fixMyString(row.aula_de_referencia) : row.aula_de_referencia.toString() : null,
        }
    }catch (e){
        console.log({
            row,
            error: e,
        });
        return null;
    }
};

const ifHourIsZeroParseOrReturnAsString = (hour: string | number) => {
    return typeof hour === "string" ? hour : hour === 0 ? '00:00' : hour;
};
const rows = (utils.sheet_to_json(ws) as FormattedSchedule[]).map(cleanRow).filter(Boolean);

Bun.write(`result/${filename}.json`, JSON.stringify(rows))
    .then((r) =>
        console.log(
            `File result/${filename}.json created with rows: ${rows.length}`,
        ),
    )
    .catch(
        (e) => `Failed to create 'result/${filename}.json', error: ${e.message}`,
    );
