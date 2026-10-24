export type PublicPageKey = "legal-disclaimer" | "privacy" | "florida-llc-vs-corporation" | "ein-application" | "registered-agent-renewal";
export const publicPages = {
  "legal-disclaimer": {
    "title": "Legal disclaimer",
    "intro": "Agente Registrado Florida is operated by Diler Services, LLC. Our services provide administrative filing assistance and general information.",
    "sections": [
      {
        "title": "Not legal or tax advice",
        "paragraphs": [
          "We are not a law firm. Website content, document templates, operating agreements and AI recommendations are not legal or tax advice and do not create an attorney-client relationship. Consult a licensed attorney or CPA about your circumstances."
        ]
      },
      {
        "title": "Your decisions and filings",
        "paragraphs": [
          "You are responsible for choosing an entity, providing accurate information and meeting applicable filing, licensing and tax obligations. Formation alone does not grant business licenses, immigration status or permission to work in the United States."
        ]
      },
      {
        "title": "Government decisions and timing",
        "paragraphs": [
          "Sunbiz and the IRS control approval and processing times. We do not guarantee name availability, filing approval, EIN issuance, bank account approval or a particular tax result. Government fees are separate from service fees unless expressly included in your order."
        ]
      },
      {
        "title": "Independent professionals",
        "paragraphs": [
          "We can refer you to partner CPAs and attorneys. Their professional advice and engagements are separate from our administrative services. An AI recommendation is general information and should be reviewed with a qualified professional."
        ]
      }
    ],
    "actions": [],
    "draft": false
  },
  "privacy": {
    "title": "Privacy policy",
    "intro": "Diler Services, LLC operates Agente Registrado Florida. This draft notice describes the information requested by the website; final privacy practices and contact details are pending confirmation.",
    "sections": [
      {
        "title": "Information you provide",
        "paragraphs": [
          "The order form requests company names, business purpose, owner names and ownership percentages, contact name, email, phone, country and mailing address. The contact form receives the information you submit. Please do not enter Social Security numbers, passport details, card numbers or confidential documents in the contact form or AI advisor."
        ]
      },
      {
        "title": "Orders, payments and AI",
        "paragraphs": [
          "Order information is used to prepare requested services and communicate about your order. When Stripe payments are connected, Stripe processes checkout information under its own privacy policy. Descriptions submitted to the AI advisor are sent to Lovable AI Gateway for a recommendation. Avoid sensitive information in those descriptions."
        ]
      },
      {
        "title": "Public records and referrals",
        "paragraphs": [
          "Information included in Florida filings may become public through Sunbiz. Registered agent service does not make all company information private. Any sharing of client details with partner professionals, including the permission process, must be confirmed before this policy is finalized."
        ]
      },
      {
        "title": "Preferences, advertising and retention",
        "paragraphs": [
          "The site saves your selected language in browser storage. Advertising trackers, analytics, retention periods and deletion procedures have not yet been confirmed by the business owner. This draft does not claim a specific retention period or that personal information is never shared or sold."
        ]
      },
      {
        "title": "Privacy questions",
        "paragraphs": [
          "Use our contact page for privacy questions without submitting sensitive information. A dedicated privacy email, business mailing address and final rights-request process must be added before treating this notice as a finalized policy."
        ]
      }
    ],
    "actions": [
      {
        "label": "Privacy contact",
        "href": "/contact"
      }
    ],
    "draft": true
  },
  "florida-llc-vs-corporation": {
    "title": "Florida LLC vs corporation",
    "intro": "Compare ownership and management structures before choosing your Florida formation package. Entity choice and tax treatment are different decisions.",
    "sections": [
      {
        "title": "LLC: members and flexible management",
        "paragraphs": [
          "An LLC has members and may be member-managed or manager-managed. An operating agreement sets out internal arrangements. Liability protection has limits and depends on the facts; it is not a guarantee against personal liability."
        ]
      },
      {
        "title": "Corporation: shareholders and directors",
        "paragraphs": [
          "A corporation has shareholders, a board of directors and officers. Bylaws govern internal operations. Issuing shares and corporate formalities may fit some investment plans, but an attorney should review fundraising and ownership arrangements."
        ]
      },
      {
        "title": "Tax classification is separate",
        "paragraphs": [
          "An S corporation is a federal tax election, not a separate Florida formation type. Eligibility restrictions apply, including restrictions on nonresident alien shareholders. A CPA can explain federal, state and international reporting obligations before you choose."
        ]
      },
      {
        "title": "Formation is only the beginning",
        "paragraphs": [
          "Both structures need a Florida registered agent and ongoing state filings. Licenses, taxes and other obligations depend on your activities. Our formation assistance is administrative, not legal or tax advice."
        ]
      }
    ],
    "actions": [
      {
        "label": "Form an LLC",
        "href": "/start?entity=llc"
      },
      {
        "label": "Form a corporation",
        "href": "/start?entity=corp"
      }
    ],
    "draft": false
  },
  "ein-application": {
    "title": "EIN application",
    "intro": "An Employer Identification Number identifies your business for federal tax purposes. It does not replace formation, licenses or tax filings.",
    "sections": [
      {
        "title": "Apply directly or request assistance",
        "paragraphs": [
          "The IRS issues EINs free of charge. Our fee, when selected, is for application assistance, not a government EIN fee. For a new company, review the Professional package or the EIN add-on during formation checkout."
        ]
      },
      {
        "title": "Information needed for the application",
        "paragraphs": [
          "The IRS generally requests the legal business name, entity details, address, responsible party and reason for applying. Required identification depends on the application method and circumstances. Do not submit SSNs or identity documents through our general contact form or AI advisor."
        ]
      },
      {
        "title": "International applicants",
        "paragraphs": [
          "The IRS online application has eligibility restrictions. International applicants may need Form SS-4 and a different submission method. Processing time varies; we do not guarantee immediate issuance or a bank account."
        ]
      }
    ],
    "actions": [
      {
        "label": "Form a company with EIN assistance",
        "href": "/start?plan=professional"
      },
      {
        "label": "EIN for an existing company",
        "href": "/contact"
      }
    ],
    "draft": false
  },
  "registered-agent-renewal": {
    "title": "Registered agent renewal",
    "intro": "Keep a registered agent on record for your Florida company. Renewing agent service and filing your annual report are separate tasks.",
    "sections": [
      {
        "title": "What a registered agent does",
        "paragraphs": [
          "A registered agent receives service of process and official notices at a Florida street address. The agent must accept the appointment. An agent address is not automatically a business office, mailing service or a substitute for every address required in public filings."
        ]
      },
      {
        "title": "Renewal for an existing company",
        "paragraphs": [
          "Renewals are handled as one-time service requests, not automatic subscriptions. Contact us with your company name and Sunbiz document number to confirm your current service period, renewal terms and price before paying. Do not place a new formation order to renew an existing company."
        ]
      },
      {
        "title": "Changing your agent",
        "paragraphs": [
          "If your agent or registered office changes, the state record must be updated using the applicable Sunbiz filing. Paying an agent service fee alone does not update Sunbiz or file an annual report. Review the state record and confirm the required filing with us."
        ]
      }
    ],
    "actions": [
      {
        "label": "Request agent renewal",
        "href": "/contact"
      }
    ],
    "draft": false
  }
};
