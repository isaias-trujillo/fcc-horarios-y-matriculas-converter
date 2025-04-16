import * as XLSX from "xlsx";
import { fixMyString } from "./types/mapRawToParsedFichas.ts";
import type Horario from "./types/Horario";
import Turn from "./types/Turn.ts";

const filename = 'horarios.sedes.raw';
const path = `data/${filename}.xlsx`;

const file = XLSX.readFile(path);

// list all sheets, pick the sheet with name: 'HORARIO 2025-1'
const sheet = file.SheetNames[0];

if (!sheet) {
  throw new Error("Sheet not found");
}

const ws = file.Sheets[sheet];

if (!ws) {
  throw new Error("Worksheet not found");
}
let row = 1;
// noinspection JSNonASCIINames
const rows = (XLSX.utils.sheet_to_json(ws) satisfies Horario[])
  .map(
    ({
      CICLO,
      EP,
      "CÓD.": cod,
      ASIGNATURAS,
      AULA,
      DOCENTE,
      TURNO: turno,
      "PLAN DE\r\nESTUDIOS": plan,
      "CRED.": creditos,
      ...props
    }) => {
        return {
            ciclo: CICLO,
            escuela: fixMyString(EP),
            codigo_de_asignatura: fixMyString(`${cod}`),
            asignatura: fixMyString(ASIGNATURAS),
            aula: fixMyString(`${AULA}`),
            docente: fixMyString(DOCENTE),
            turno: fixMyString(turno),
            orden_del_turno: Turn[fixMyString(turno) as keyof typeof Turn] ?? 0,
            seccion: 1,
            horarios: Object.fromEntries(
                Object.entries(props).map(([key, v]) => {
                    const value = fixMyString(`${v}`);
                    return [key, value];
                }),
            ),
            rectificacion: false
        }
    },
  )
  .sort((a, b) => {
    // sort by escuela, orden del turno, aula
    const escuela = a.escuela.localeCompare(b.escuela);
    if (escuela !== 0) {
      return escuela;
    }
    // sort by ciclo
    if (a.ciclo !== b.ciclo) {
      return a.ciclo - b.ciclo;
    }
    const orden_del_turno =
      a.orden_del_turno.valueOf() - b.orden_del_turno.valueOf();
    if (orden_del_turno !== 0) {
      return orden_del_turno;
    }
    return a.aula.localeCompare(b.aula);
  });

let section = 1;

// the idea is create a new column 'seccion'.
// if the previous row has the different 'escuela', then create a new section (1)
// if the previous row has the same 'escuela', then add 1 to the section
// if it's different 'aula', then increment the section in one
rows.forEach((row, index) => {
  if (index === 0) {
    return;
  }
  const previousRow = rows[index - 1];
  if (!previousRow) {
    throw new Error("Previous row not found");
  }
  if (previousRow.escuela !== row.escuela || previousRow.ciclo !== row.ciclo) {
    section = 1;
    return;
  }
  if (previousRow.aula !== row.aula) {
    section++;
  }
  row.seccion = section;
});

Bun.write(`result/${filename}.json`, JSON.stringify(rows, null, 4)).then((r) =>
  console.log(r),
);
