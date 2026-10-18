import type { PagesCopy } from "../types";

const copy: PagesCopy = {
  about: {
    eyebrow: "Quiénes somos",
    title: "La mejor forma de preparar una entrevista es con quienes las hacen",
    lead: "Zeeta pone en contacto a candidatos con profesionales de la banca, la consultoría y la tecnología para simulaciones de entrevista por videollamada, seguidas de un informe escrito.",
    missionTitle: "Por qué Zeeta",
    mission: [
      "Las entrevistas en banca de inversión, consultoría o tecnología tienen sus códigos. Rara vez se aprenden en un libro: los transmiten quienes han estado al otro lado de la mesa.",
      "Zeeta hace accesible ese conocimiento. Cada candidato puede elegir un mentor de su especialidad, entrenarse en condiciones reales y salir con un informe preciso de lo que debe trabajar.",
    ],
    stats: { mentors: "mentores verificados", tracks: "especialidades", rate: "tarifa por hora de los mentores" },
    valuesTitle: "Lo que nos guía",
    values: [
      { title: "Mentores que contratan", desc: "Cada mentor está verificado y trabaja, o ha trabajado, en la especialidad que enseña." },
      { title: "Un informe concreto", desc: "Tras cada sesión, un informe escrito punto por punto y un plan de acción." },
      { title: "Transparencia", desc: "La trayectoria y la tarifa de cada mentor se muestran antes de reservar." },
    ],
    candidates: { title: "¿Preparas una entrevista?", desc: "Encuentra un mentor de tu especialidad y reserva una sesión.", cta: "Encontrar un mentor" },
    mentors: { title: "¿Ya has pasado por ahí?", desc: "Comparte tu experiencia y fija tu propia tarifa.", cta: "Hazte mentor" },
  },
  contact: {
    title: "Contáctanos",
    lead: "¿Una pregunta sobre una sesión, tu perfil de mentor o una colaboración? Escríbenos y te responderemos por e-mail.",
    emailLabel: "Nuestra dirección",
    topics: [
      { title: "Candidatos", desc: "Reserva, sesión, informe, reembolso." },
      { title: "Mentores", desc: "Perfil, verificación, agenda, tarifa." },
      { title: "Prensa y colaboraciones", desc: "Escuelas, asociaciones, empresas, medios." },
    ],
    formTitle: "Escribir un mensaje",
    name: "Tu nombre",
    email: "Tu e-mail",
    topic: "Asunto",
    message: "Tu mensaje",
    send: "Preparar el e-mail",
    sendNote: "El botón abre tu correo con el mensaje ya redactado.",
    faqPrompt: "Puede que tu pregunta ya esté en las",
    faqLink: "preguntas frecuentes",
  },
  legal: {
    updated: "Última actualización:",
    toc: "Índice",
    frenchOnly: "Este documento solo está disponible en francés. La versión francesa es la que se aplica.",
    draftNote: "Los elementos resaltados deben completarse antes de la publicación.",
  },
};

export default copy;
