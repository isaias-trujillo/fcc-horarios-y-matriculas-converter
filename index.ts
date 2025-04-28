import {readFile, utils} from 'xlsx'
import fixScheduleRow from "./utils/fixScheduleRow.ts";
import type ScheduleRow from "./types/schedules/ScheduleRow";

const filename = "horarios/original.raw";
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

const rows = (utils.sheet_to_json(ws) as ScheduleRow[])
    .filter((r: any) => 'LUNES' in r && (r['LUNES'] as string).trim().length > 0)
    .map(fixScheduleRow)
    .filter(Boolean)

Bun.write(`result/horarios/lunes.raw.json`, JSON.stringify(rows))
    .then((r) =>
        console.log(
            `File result/horarios/lunes.raw.json created with rows: ${rows.length}`,
        ),
    )
    .catch(
        (e) => `Failed to create 'result/horarios/lunes.raw.json', error: ${e.message}`,
    );


