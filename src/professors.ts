import * as XLSX from "xlsx";

type Docente = {
    apellido_paterno: string;
    apellido_materno: string;
    identificacion: string;
    nombres: string;
};

const path = "courses_clean.xlsx";
const fildDocentes = "docentes.json";

const jsonDocentes = await Bun.file(fildDocentes).json() as Docente[];

const file = XLSX.readFile(path);
const sheets = file.SheetNames;

type Course = {
    cod_asignatura: string;
    cod_tipo_acta: string;
    cod_seccion: string;
    cod_turno: string;
    can_tope_alumnos: string;
    cod_facultad: string;
    cod_escuela: string;
    cod_plan: string;
    cod_semestre: string;
    cod_especialidad: string;
    ind_estado_acta: string;
    autofinanciado: string;
    aula_turno: string;
    can_alum_matriculados: string;
    num_ciclo_ano_asignatura: string;
    ind_semestre_par: string;
    num_creditaje: string;
    des_asignatura: string;
    des_plan: string;
    ind_reg_plan: string;
    des_especialidad: string;
    ape_paterno: string;
    ape_materno: string;
    nom_docente: string;
    t_especialidad: string;
    des_dictado: string;
    dni: string;
};

let data: Docente[] = [];

for (let i = 0; i < sheets.length; i++) {
    const name = file.SheetNames[i];

    if (!name) {
        continue;
    }

    const ws = file.Sheets[name];

    if (!ws) {
        continue;
    }

    const rows:Course[] = XLSX.utils.sheet_to_json(ws);
    // save only docente data but only the dni is unique
    const hashmap = Object.fromEntries(rows.map((r) => [r.dni, {
        apellido_paterno: r.ape_paterno,
        apellido_materno: r.ape_materno,
        identificacion: r.dni,
        nombres: r.nom_docente,
    }]));

    // remove docentes that are already in the list
    data = Object.values(hashmap).filter((d) => !jsonDocentes.some((doc) => doc.identificacion === d.identificacion));
}

const name = `parsed/courses.json`;
const json = JSON.stringify(data);
Bun.write(name, json).then((r) => console.log(r));
