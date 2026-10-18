/* Legal documents of the site, in French (the version that applies).
   Text between [brackets] is information to fill in before going live; the page highlights it.
   These drafts must be reviewed by a lawyer. */

export type LegalBlock = string | { list: string[] };
export type LegalSection = { id: string; title: string; blocks: LegalBlock[] };
export type LegalDoc = { /** ISO date */ updated: string; intro: string; sections: LegalSection[] };

const CONTACT = "contact@zeeta.app";

export const mentionsLegales: LegalDoc = {
  updated: "2026-10-11",
  intro: "Conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, voici l'identité des intervenants du site Zeeta.",
  sections: [
    {
      id: "editeur",
      title: "Éditeur du site",
      blocks: [
        {
          list: [
            "Raison sociale : [Raison sociale]",
            "Forme juridique et capital : [Forme juridique, capital social]",
            "Siège social : [Adresse du siège social]",
            "Immatriculation : [RCS de la ville, numéro SIREN]",
            "Numéro de TVA intracommunautaire : [Numéro de TVA]",
            `Adresse e-mail : ${CONTACT}`,
          ],
        },
      ],
    },
    {
      id: "publication",
      title: "Directeur de la publication",
      blocks: ["[Nom et qualité du directeur de la publication]"],
    },
    {
      id: "hebergement",
      title: "Hébergement",
      blocks: [
        "Le site est hébergé par [Nom de l'hébergeur], [adresse de l'hébergeur], [téléphone ou site de l'hébergeur].",
        "Les données de l'application sont hébergées par [Nom de l'hébergeur des données, par exemple Supabase], [localisation des serveurs].",
      ],
    },
    {
      id: "propriete",
      title: "Propriété intellectuelle",
      blocks: [
        "La marque Zeeta, son logo, les textes, la charte graphique et les éléments du site sont la propriété de [Raison sociale]. Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite préalable est interdite.",
        "Les noms et logos des entreprises cités sur le site (banques, cabinets de conseil, entreprises de la tech) appartiennent à leurs propriétaires respectifs. Ils sont utilisés uniquement pour indiquer le parcours professionnel des mentors et n'impliquent aucun partenariat ni aucune approbation de leur part.",
      ],
    },
    {
      id: "credits",
      title: "Crédits",
      blocks: [
        "Photographies : Unsplash (licence Unsplash).",
        "Logos des entreprises : Wikimedia Commons et sites des entreprises concernées.",
      ],
    },
    {
      id: "contact",
      title: "Signaler un contenu",
      blocks: [`Pour signaler un contenu illicite ou une erreur, écrivez à ${CONTACT} en précisant l'adresse de la page concernée.`],
    },
  ],
};

export const confidentialite: LegalDoc = {
  updated: "2026-10-11",
  intro: "Cette politique explique quelles données personnelles Zeeta collecte, pourquoi, combien de temps elles sont conservées et comment exercer vos droits, conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.",
  sections: [
    {
      id: "responsable",
      title: "1. Responsable du traitement",
      blocks: [`Le responsable du traitement est [Raison sociale], [adresse du siège social]. Pour toute question relative à vos données : ${CONTACT}.`, "[Le cas échéant : coordonnées du délégué à la protection des données (DPO).]"],
    },
    {
      id: "donnees",
      title: "2. Données collectées",
      blocks: [
        "Selon votre utilisation de Zeeta, nous traitons :",
        {
          list: [
            "Données de compte : nom, adresse e-mail, numéro de téléphone, mot de passe chiffré ou identifiant de connexion Google ou Apple.",
            "Données de profil mentor : photo, parcours professionnel et académique, spécialités, tarif, ville, disponibilités, pièce d'identité pour la vérification.",
            "Données de profil candidat : école, objectif, poste visé.",
            "Données de séance : réservations, messages échangés, comptes-rendus, avis.",
            "Enregistrements des séances, uniquement si le mentor et le candidat l'ont tous deux accepté.",
            "Données de paiement : traitées par notre prestataire de paiement [Nom du prestataire de paiement]. Zeeta ne conserve pas vos numéros de carte.",
            "Données techniques : adresse IP, type d'appareil et de navigateur, journaux de connexion.",
          ],
        },
      ],
    },
    {
      id: "finalites",
      title: "3. Finalités et bases légales",
      blocks: [
        {
          list: [
            "Créer et gérer votre compte, mettre en relation candidats et mentors, organiser les séances en visio : exécution du contrat (CGU).",
            "Vérifier l'identité et le parcours des mentors : intérêt légitime à garantir la fiabilité de la plateforme.",
            "Encaisser les paiements, reverser les sommes dues aux mentors, tenir la comptabilité : exécution du contrat et obligations légales.",
            "Envoyer des rappels avant les séances et des notifications liées au service : exécution du contrat.",
            "Enregistrer une séance : consentement du mentor et du candidat.",
            "Assurer la sécurité du service et prévenir la fraude : intérêt légitime.",
            "Vous envoyer des informations commerciales : consentement, que vous pouvez retirer à tout moment.",
          ],
        },
      ],
    },
    {
      id: "destinataires",
      title: "4. Destinataires",
      blocks: [
        "Vos données sont accessibles aux équipes habilitées de Zeeta et, pour ce qui les concerne, à votre mentor ou à votre candidat (profil public, réservation, compte-rendu). Elles sont aussi traitées par nos sous-traitants techniques, notamment :",
        {
          list: [
            "hébergement de la base de données et authentification : [Supabase ou autre, localisation] ;",
            "visioconférence : [Prestataire de visio, par exemple Daily ou LiveKit] ;",
            "paiement : [Nom du prestataire de paiement] ;",
            "hébergement du site : [Nom de l'hébergeur] ;",
            "connexion avec Google ou Apple, si vous choisissez ce mode de connexion.",
          ],
        },
        "Zeeta ne vend pas vos données personnelles.",
      ],
    },
    {
      id: "transferts",
      title: "5. Transferts hors de l'Union européenne",
      blocks: [
        "Certains sous-traitants peuvent traiter des données hors de l'Union européenne. Ces transferts sont encadrés par une décision d'adéquation de la Commission européenne ou par les clauses contractuelles types qu'elle a adoptées. [Préciser les prestataires concernés.]",
      ],
    },
    {
      id: "conservation",
      title: "6. Durées de conservation",
      blocks: [
        {
          list: [
            "Compte : pendant toute la durée d'utilisation, puis [3 ans] après la dernière activité.",
            "Pièce d'identité des mentors : supprimée [dans un délai à préciser] après la vérification.",
            "Enregistrements de séance : [durée à préciser], ou jusqu'à leur suppression par l'utilisateur.",
            "Factures et pièces comptables : 10 ans, conformément au Code de commerce.",
            "Journaux de connexion : [1 an].",
          ],
        },
      ],
    },
    {
      id: "droits",
      title: "7. Vos droits",
      blocks: [
        "Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données, ainsi que du droit de retirer votre consentement à tout moment et de définir des directives sur le sort de vos données après votre décès.",
        `Pour exercer ces droits, écrivez à ${CONTACT}. Nous pourrons vous demander de justifier de votre identité. Nous répondons dans un délai d'un mois.`,
        "Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL (www.cnil.fr).",
      ],
    },
    {
      id: "stockage",
      title: "8. Cookies et stockage local",
      blocks: [
        "Le site n'utilise pas de cookies publicitaires ni de traceurs de mesure d'audience tiers. Il enregistre dans votre navigateur la langue que vous avez choisie, pour l'afficher lors de vos prochaines visites. Ce stockage est nécessaire au fonctionnement du site et ne requiert pas votre consentement.",
        "Certaines images (photos, logos, codes QR) sont chargées depuis des services tiers, qui reçoivent à cette occasion votre adresse IP.",
        "[Si un outil de mesure d'audience ou un cookie non essentiel est ajouté, mettre à jour cette section et afficher un bandeau de consentement.]",
      ],
    },
    {
      id: "securite",
      title: "9. Sécurité",
      blocks: ["Zeeta met en œuvre des mesures techniques et organisationnelles pour protéger vos données : chiffrement des échanges, mots de passe chiffrés, accès restreint aux données, vérification des mentors."],
    },
    {
      id: "modifications",
      title: "10. Modifications",
      blocks: ["Cette politique peut évoluer. En cas de changement important, vous en serez informé par e-mail ou dans l'application."],
    },
  ],
};

export const cgu: LegalDoc = {
  updated: "2026-10-11",
  intro: "Les présentes conditions générales d'utilisation (CGU) encadrent l'utilisation du site et de l'application Zeeta, édités par [Raison sociale]. En créant un compte, vous les acceptez.",
  sections: [
    {
      id: "objet",
      title: "1. Objet du service",
      blocks: [
        "Zeeta est une plateforme qui met en relation des candidats qui préparent des entretiens d'embauche (les « Candidats ») avec des professionnels de la finance, du conseil et de la tech (les « Mentors ») pour des simulations d'entretien en visio, suivies d'un compte-rendu écrit (les « Séances »).",
        "Zeeta agit en qualité d'intermédiaire. Le contenu des Séances relève de la responsabilité des Mentors.",
      ],
    },
    {
      id: "compte",
      title: "2. Création de compte",
      blocks: [
        "L'accès au service nécessite un compte, créé avec un numéro de téléphone, une adresse e-mail ou un compte Google ou Apple. Vous devez avoir au moins [18] ans et fournir des informations exactes.",
        "Vous êtes responsable de la confidentialité de vos identifiants et de toute activité réalisée depuis votre compte.",
      ],
    },
    {
      id: "mentors",
      title: "3. Mentors",
      blocks: [
        "Pour publier un profil, le Mentor crée son profil dans l'application (parcours, spécialités, tarif) et fait vérifier son identité. Zeeta peut refuser ou retirer un profil dont les informations sont inexactes ou invérifiables.",
        "Le Mentor fixe librement son tarif horaire et ses disponibilités. Il s'engage à :",
        {
          list: [
            "assurer les Séances réservées, avec sérieux et bienveillance ;",
            "rédiger le compte-rendu prévu après chaque Séance ;",
            "ne jamais divulguer d'informations confidentielles relatives à son employeur actuel ou passé, à ses clients ou aux processus de recrutement en cours ;",
            "ne pas présenter la Séance comme une procédure de recrutement ni promettre une embauche ;",
            "respecter ses obligations sociales et fiscales liées aux revenus perçus.",
          ],
        },
      ],
    },
    {
      id: "reservation",
      title: "4. Réservation et paiement",
      blocks: [
        "Le Candidat réserve un créneau parmi les disponibilités du Mentor. Le prix, affiché sur le profil avant la réservation, correspond au tarif horaire du Mentor rapporté à la durée réservée. Le paiement est effectué au moment de la réservation, via [Nom du prestataire de paiement].",
        "[Préciser : commission de Zeeta, modalités et délai de reversement aux Mentors.]",
      ],
    },
    {
      id: "annulation",
      title: "5. Annulation et remboursement",
      blocks: [
        "Si le Mentor annule la Séance ou si un problème technique empêche son déroulement, le Candidat est remboursé intégralement sous 48 heures.",
        "[Préciser les conditions d'annulation par le Candidat : délai minimal avant la Séance, remboursement total ou partiel.]",
        "Droit de rétractation : la Séance étant un service pleinement exécuté à une date convenue, le Candidat qui réserve une Séance dans le délai de rétractation de 14 jours demande expressément son exécution et reconnaît perdre son droit de rétractation une fois la Séance réalisée (article L221-28 du Code de la consommation). [À valider par un juriste.]",
      ],
    },
    {
      id: "seances",
      title: "6. Déroulement des Séances et enregistrement",
      blocks: [
        "Les Séances se déroulent dans la salle visio Zeeta, depuis le navigateur ou l'application.",
        "Une Séance n'est enregistrée que si le Mentor et le Candidat l'acceptent tous les deux. L'enregistrement est alors disponible dans l'espace de l'utilisateur ; il ne peut pas être diffusé sans l'accord des deux parties.",
      ],
    },
    {
      id: "comportement",
      title: "7. Règles de conduite",
      blocks: [
        "Les utilisateurs s'interdisent tout propos injurieux, discriminatoire ou harcelant, toute usurpation d'identité, et tout contournement de la plateforme pour régler une Séance réservée via Zeeta.",
        "Zeeta peut suspendre ou supprimer un compte en cas de manquement à ces règles, après avoir, sauf urgence, invité l'utilisateur à présenter ses observations.",
      ],
    },
    {
      id: "avis",
      title: "8. Avis",
      blocks: ["Après une Séance, le Candidat peut publier un avis sur le Mentor. Les avis doivent refléter une expérience réelle. Zeeta peut retirer un avis contraire à la loi ou aux présentes CGU."],
    },
    {
      id: "propriete",
      title: "9. Propriété intellectuelle",
      blocks: ["La plateforme, sa marque et ses contenus appartiennent à [Raison sociale]. Les comptes-rendus restent à la disposition du Candidat pour son usage personnel. Les utilisateurs conservent leurs droits sur les contenus qu'ils publient et accordent à Zeeta le droit de les afficher sur la plateforme."],
    },
    {
      id: "responsabilite",
      title: "10. Responsabilité",
      blocks: [
        "Zeeta ne garantit pas l'obtention d'un emploi ou d'un stage à l'issue des Séances. Les conseils donnés par les Mentors n'engagent qu'eux.",
        "Zeeta met tout en œuvre pour assurer la disponibilité du service, sans pouvoir garantir une absence totale d'interruption.",
      ],
    },
    {
      id: "donnees",
      title: "11. Données personnelles",
      blocks: ["Le traitement de vos données est décrit dans la politique de confidentialité."],
    },
    {
      id: "modifications",
      title: "12. Modification des CGU",
      blocks: ["Zeeta peut modifier les présentes CGU. Les utilisateurs sont informés de toute modification importante avant son entrée en vigueur."],
    },
    {
      id: "droit",
      title: "13. Droit applicable et litiges",
      blocks: [
        "Les présentes CGU sont soumises au droit français.",
        `En cas de litige, contactez d'abord ${CONTACT}. Le consommateur peut recourir gratuitement au médiateur de la consommation [Nom et coordonnées du médiateur].`,
        "À défaut d'accord amiable, les tribunaux compétents sont ceux désignés par la loi.",
      ],
    },
  ],
};
