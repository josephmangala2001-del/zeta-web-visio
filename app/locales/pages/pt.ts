import type { PagesCopy } from "../types";

const copy: PagesCopy = {
  about: {
    eyebrow: "Sobre nós",
    title: "A melhor forma de preparar uma entrevista é com quem as conduz",
    lead: "A Zeeta liga candidatos a profissionais da banca, da consultoria e da tecnologia para simulações de entrevista por videochamada, seguidas de um relatório escrito.",
    missionTitle: "Porquê a Zeeta",
    mission: [
      "As entrevistas em banca de investimento, consultoria ou tecnologia têm os seus códigos. Raramente se aprendem num livro: são transmitidos por quem já esteve do outro lado da mesa.",
      "A Zeeta torna esse conhecimento acessível. Cada candidato pode escolher um mentor da sua área, treinar em condições reais e sair com um feedback preciso sobre o que deve trabalhar.",
    ],
    stats: { mentors: "mentores verificados", tracks: "áreas", rate: "tarifa por hora dos mentores" },
    valuesTitle: "O que nos guia",
    values: [
      { title: "Mentores que recrutam", desc: "Cada mentor é verificado e trabalha, ou trabalhou, na área que ensina." },
      { title: "Feedback concreto", desc: "Após cada sessão, um relatório escrito ponto por ponto e um plano de ação." },
      { title: "Transparência", desc: "O percurso e a tarifa de cada mentor são indicados antes da reserva." },
    ],
    candidates: { title: "Está a preparar uma entrevista?", desc: "Encontre um mentor da sua área e reserve uma sessão.", cta: "Encontrar um mentor" },
    mentors: { title: "Já passou por isto?", desc: "Partilhe a sua experiência e defina a sua própria tarifa.", cta: "Tornar-se mentor" },
  },
  contact: {
    title: "Contacte-nos",
    lead: "Uma pergunta sobre uma sessão, o seu perfil de mentor ou uma parceria? Escreva-nos e respondemos por e-mail.",
    emailLabel: "O nosso endereço",
    topics: [
      { title: "Candidatos", desc: "Reserva, sessão, relatório, reembolso." },
      { title: "Mentores", desc: "Perfil, verificação, agenda, tarifa." },
      { title: "Imprensa e parcerias", desc: "Escolas, associações, empresas, media." },
    ],
    formTitle: "Escrever uma mensagem",
    name: "O seu nome",
    email: "O seu e-mail",
    topic: "Assunto",
    message: "A sua mensagem",
    send: "Preparar o e-mail",
    sendNote: "O botão abre o seu e-mail com a mensagem já redigida.",
    faqPrompt: "A sua pergunta talvez já esteja nas",
    faqLink: "perguntas frequentes",
  },
  legal: {
    updated: "Última atualização:",
    toc: "Índice",
    frenchOnly: "Este documento está disponível apenas em francês. A versão francesa é a que se aplica.",
    draftNote: "Os elementos destacados devem ser preenchidos antes da publicação.",
  },
};

export default copy;
