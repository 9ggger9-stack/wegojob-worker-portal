import { loadOnboarding, saveOnboarding } from './onboardingStore.js';
import { markCompleted } from './progressStore.js';
import { sendToMake } from './api.js';

export async function submitPortalDocument({
  type,
  data,
  signature = '',
  pdf = null,
  extra = {},
}) {
  const stored = loadOnboarding();
const submissionKey = `wegojob_pending_${type}`;

let submissionId = sessionStorage.getItem(submissionKey);

if (!submissionId) {
  submissionId = crypto.randomUUID();
  sessionStorage.setItem(submissionKey, submissionId);
}
  const fullName =
    data.fullName ||
    data.name ||
    stored.fullName ||
    `${data.firstName || stored.firstName || ''} ${
      data.surname || stored.surname || ''
    }`.trim();

  const payload = {submissionId,
    source: 'WeGoJob Portal',
    submittedAt: new Date().toISOString(),
    documentType: type,

    employee: {
      fullName,
      firstName: data.firstName || stored.firstName || '',
      surname: data.surname || stored.surname || '',
      pesel: data.pesel || stored.pesel || '',
      passportNumber:
        data.documentNumber || stored.documentNumber || '',
      phone: data.phone || stored.phone || '',
      email: data.email || stored.email || '',
      project: data.project || stored.project || '',
      bankAccount: data.iban || stored.iban || '',
    },

    data,
    signature,
    status: 'PODPISANO',

    // PDF передаємо окремо як файл
    pdf,

    ...extra,
  };

  await sendToMake(payload);

sessionStorage.removeItem(submissionKey);

  saveOnboarding(data);
  markCompleted(type);

  return payload;
}