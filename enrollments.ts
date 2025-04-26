import {readFile, utils} from 'xlsx'
import type EnrollementRow from "./types/enrollments/EnrollementRow";
import fixEnrollmentRow from "./utils/fixEnrollmentRow.ts";
import type FixedScheduleRow from "./types/schedules/FixedScheduleRow";

const filename = "matriculas.raw";
const path = `data/${filename}.xlsx`;

const file = readFile(path);

if (!file) {
    throw new Error("File not found");
}

const sheet = file.SheetNames[0];

if (!sheet) {
    throw new Error("Sheet not found");
}

const ws = file.Sheets[sheet];

if (!ws) {
    throw new Error("Worksheet not found");
}

const rows = (utils.sheet_to_json(ws) as EnrollementRow[]).map(fixEnrollmentRow).filter(Boolean);



const schedules = await Bun.file("data/horarios/horarios.docentes-restantes.json").json() as FixedScheduleRow[];

const noMatchedInSchedules = rows.filter(row => {
    if (!row) {
        return false;
    }
    const toCompare = row.codigo_de_asignatura + row.seccion;
    return schedules.some(schedule => {
        return `${schedule.codigo_de_asignatura}${schedule.seccion}` === toCompare;
    }) ? false : row;
}).filter(Boolean);

const notMatchedInEnrollments = schedules.filter((schedule) => {
    const toCompare = schedule.codigo_de_asignatura + schedule.seccion;
    return rows.some(row => {
        if (!row) {
            return false;
        }
        return `${row.codigo_de_asignatura}${row.seccion}` === toCompare;
    }) ? false : schedule;
})

console.log(`Not found ${noMatchedInSchedules.length} enrollments in schedule`);
console.log(`Not found ${notMatchedInEnrollments.length} schedules in enrollments`);

await Bun.write(`result/matriculas/matriculas.not-found.json`, JSON.stringify(noMatchedInSchedules));
await Bun.write(`result/matriculas/horarios.not-found.json`, JSON.stringify(notMatchedInEnrollments));

const chunkSize = 1000;

const chunks = Array.from({ length: Math.ceil(rows.length / chunkSize) }, (_, i) => rows.slice(i * chunkSize, (i + 1) * chunkSize));

chunks.forEach((chunk, i) => {
    Bun.write(`result/${filename}/chunk-${i}.json`, JSON.stringify(chunk))
        .then((r) =>
            console.log(
                `File result/${filename}-${i}.json created with rows: ${chunk.length}`,
            ),
        )
        .catch(
            (e) => `Failed to create 'result/${filename}-${i}.json', error: ${e.message}`,
        );
});