type EnrollementRow = {
    cod_alumno: string;
    ape_paterno: string;
    ape_materno: string;
    nom_alumno: string;
    anio_ingreso: string;
    cod_semestre: string;
    cod_plan: string;
    cod_especialidad: string;
    cod_asignatura: string;
    cod_seccion: string;
    num_ciclo_ano_asig: number;
    cod_grupo?: string | null;
    cod_aula?: string | nullstring;
    des_asignatura: string;
    num_creditaje: string;
    mod_user: string;
    mod_fecha: string;
    rep_plan_actual: string;
    sede_alumno: string;
    rep_x_equiv: string;
    coe_alumno: string;
    count: string;
    escuela: string;
};

export default EnrollementRow;