import type { Messages } from "../types";

export const legalFr: Messages["legal"] = {
  footerNavLabel: "Informations légales",
  footerPrivacy: "Confidentialité",
  footerTerms: "Conditions d’utilisation",
  footerContact: "Contact",
  footerCopy: "© GramWise — calculateur de coût pâtisserie.",
  backHome: "Accueil",
  disclaimer:
    "Texte informatif — faites valider par un conseil juridique dans votre pays avant une vente à grande échelle.",
  privacy: {
    eyebrow: "Légal",
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : mai 2026",
    intro:
      "GramWise est un calculateur web. Nous limitons la collecte de données au strict nécessaire.",
    sections: [
      {
        title: "Responsable",
        paragraphs: [
          "Le service GramWise est édité par son fondateur. Pour toute question : e-mail indiqué en pied de page (si configuré) ou via Gumroad après achat.",
        ],
      },
      {
        title: "Données traitées",
        paragraphs: [
          "Données saisies dans le calculateur (charges, recettes, prix) : stockées localement dans votre navigateur (sessionStorage / localStorage). Elles ne sont pas envoyées à nos serveurs tant qu’un compte cloud n’est pas activé.",
          "Préférences : langue et devise d’affichage (localStorage).",
          "Paiement : traité par Gumroad (carte, PayPal). Nous ne stockons pas vos coordonnées bancaires.",
        ],
      },
      {
        title: "Finalités",
        paragraphs: [
          "Fournir le calculateur, mémoriser votre session sur l’appareil, améliorer le produit sur la base de retours volontaires (beta).",
        ],
      },
      {
        title: "Durée et suppression",
        paragraphs: [
          "Données locales : jusqu’à effacement du cache navigateur ou des données du site. Vous pouvez vider le stockage via les paramètres du navigateur.",
        ],
      },
      {
        title: "Vos droits (RGPD / équivalents)",
        paragraphs: [
          "Accès, rectification, effacement : pour les données locales, vous agissez depuis votre appareil. Pour un achat Gumroad, contactez aussi Gumroad (marchand de record).",
          "Vous pouvez vous opposer au traitement inutile en n’utilisant pas le service.",
        ],
      },
      {
        title: "Transferts",
        paragraphs: [
          "Hébergement Vercel (USA/UE selon région). Gumroad (USA) pour les paiements. Consultez leurs politiques respectives.",
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Légal",
    title: "Conditions d’utilisation",
    updated: "Dernière mise à jour : mai 2026",
    intro:
      "En utilisant GramWise, vous acceptez ces conditions. Si vous n’acceptez pas, n’utilisez pas le service.",
    sections: [
      {
        title: "Service",
        paragraphs: [
          "GramWise est un outil d’estimation de coûts et de prix pour artisans (pâtisserie en v1). Les résultats dépendent de vos saisies ; ce n’est pas un conseil comptable, fiscal ou juridique.",
        ],
      },
      {
        title: "Exactitude",
        paragraphs: [
          "Nous visons un moteur testé et transparent, sans garantie d’exhaustivité (TVA, charges sociales détaillées, etc.). Vérifiez les chiffres avant de fixer vos prix.",
        ],
      },
      {
        title: "Paiement",
        paragraphs: [
          "Les achats passent par Gumroad (vendeur de record) aux tarifs affichés (ex. accès à vie 29 €). Remboursements selon la politique Gumroad en vigueur.",
          "Le calculateur peut rester accessible gratuitement pendant certaines phases ; les conditions Gumroad prévalent pour les achats.",
        ],
      },
      {
        title: "Propriété intellectuelle",
        paragraphs: [
          "Le code, la marque et les textes GramWise restent la propriété de l’éditeur. Vos recettes et données saisies vous appartiennent.",
        ],
      },
      {
        title: "Limitation de responsabilité",
        paragraphs: [
          "Dans les limites permises par la loi, GramWise n’est pas responsable des pertes liées à une mauvaise fixation de prix ou à une erreur de saisie.",
        ],
      },
      {
        title: "Évolution",
        paragraphs: [
          "Nous pouvons modifier le service ou ces conditions ; la date en tête de page sera mise à jour.",
        ],
      },
    ],
  },
};
