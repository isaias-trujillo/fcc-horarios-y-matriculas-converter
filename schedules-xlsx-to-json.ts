import {readFile, utils} from 'xlsx'
import type Day from "./types/schedules/Day.ts";

const filename = 'horarios/all.processed';
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

const rows = utils.sheet_to_json(ws) as Record<PropertyKey, string | number>[];

const groupedByDayOfWeek = rows.reduce((acc, row: Record<PropertyKey, string | number>) => {
    const day = row['dia_de_la_semana'] as Day | undefined;
    if (!day) {
        return acc;
    }
    if (!(day in acc)) {
        acc[day] = [];
    }
    acc[day].push(row);

    return acc;
}, {} as Record<Day, Record<PropertyKey, string | number>[]>);

for (const day in groupedByDayOfWeek) {
    await Bun.write(`result/horarios/${day.toLowerCase()}.json`, JSON.stringify(groupedByDayOfWeek[day as Day]));
}

await Bun.write(`result/horarios/all.json`, JSON.stringify(rows));