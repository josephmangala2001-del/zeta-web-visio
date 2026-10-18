import type { PagesCopy } from "../types";

const copy: PagesCopy = {
  about: {
    eyebrow: "About",
    title: "The best way to prepare for an interview is with the people who run them",
    lead: "Zeeta connects candidates with banking, consulting and tech professionals for video mock interviews, followed by a written report.",
    missionTitle: "Why Zeeta",
    mission: [
      "Investment banking, consulting and tech interviews have their own codes. They're rarely learned from a book: they're passed on by people who have sat on the other side of the table.",
      "Zeeta makes that knowledge accessible. Every candidate can pick a mentor from their field, practise in real interview conditions and leave with precise feedback on what to work on.",
    ],
    stats: { mentors: "verified mentors", tracks: "tracks", rate: "mentor hourly rate" },
    valuesTitle: "What guides us",
    values: [
      { title: "Mentors who hire", desc: "Every mentor is verified and works, or has worked, in the field they teach." },
      { title: "Concrete feedback", desc: "After every session, a point-by-point written report and an action plan." },
      { title: "Transparency", desc: "Each mentor's background and rate are shown before you book." },
    ],
    candidates: { title: "Preparing for an interview?", desc: "Find a mentor from your field and book a session.", cta: "Find a mentor" },
    mentors: { title: "Been there?", desc: "Share your experience and set your own rate.", cta: "Become a mentor" },
  },
  contact: {
    title: "Contact us",
    lead: "A question about a session, your mentor profile or a partnership? Write to us and we'll reply by email.",
    emailLabel: "Our address",
    topics: [
      { title: "Candidates", desc: "Booking, session, report, refund." },
      { title: "Mentors", desc: "Profile, verification, calendar, rate." },
      { title: "Press and partnerships", desc: "Schools, student societies, companies, media." },
    ],
    formTitle: "Write a message",
    name: "Your name",
    email: "Your email",
    topic: "Topic",
    message: "Your message",
    send: "Prepare the email",
    sendNote: "The button opens your mail app with the message already written.",
    faqPrompt: "Your question may already be in the",
    faqLink: "FAQ",
  },
  legal: {
    updated: "Last updated:",
    toc: "Contents",
    frenchOnly: "This document is available in French only. The French version is the one that applies.",
    draftNote: "Highlighted items must be completed before going live.",
  },
};

export default copy;
