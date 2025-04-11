type FormattedSchedule = {
    ciclo: number;
    escuela: string;
    codigo_de_asignatura: string;
    asignatura: string;
    seccion: number;
    aula?: string | number | null;
    identificacion: string;
    apellido_paterno: string;
    apellido_materno: string;
    nombres: string;
    dia_de_la_semana: string;
    hora_de_inicio: string | number;
    hora_de_finalizacion: string | number;
    rectificacion: boolean;
    codigo_de_asignatura_de_referencia?: string | null;
    seccion_de_referencia?: number | null;
    aula_de_referencia?: string | number | null;
};

export default FormattedSchedule;