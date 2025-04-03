type ParsedFichaMatricula = {
    codigo: string, // cod_alumno
    apellido_paterno: string, // ape_paterno
    apellido_materno: string, // ape_materno
    nombres: string, // nom_alumno
    codigo_de_asignatura: string, // cod_asignatura
    seccion: string, // cod_seccion
    ciclo: number, // num_ciclo_ano_asig
    asignatura: string, // des_asignatura
    ingreso: string, // anio_ingreso
    correo: string, // coe_alumno
    escuela:string, // escuela
    plan_de_estudios: string, // cod_plan
}

export default ParsedFichaMatricula;