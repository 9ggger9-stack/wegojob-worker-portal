import { loadOnboarding, saveOnboarding } from './onboardingStore.js';
import { markCompleted } from './progressStore.js';
import { sendToMake } from './api.js';

export async function submitPortalDocument({ type, data, signature = '', extra = {} }) {
  const stored = loadOnboarding();
  const fullName = data.fullName || data.name || stored.fullName || `${data.firstName || stored.firstName || ''} ${data.surname || stored.surname || ''}`.trim();

  const payload = {
    source: 'WeGoJob Portal',
    submittedAt: new Date().toISOString(),
    documentType: type,
    employee: {
      fullName,
      firstName: data.firstName || stored.firstName || '',
      surname: data.surname || stored.surname || '',
      pesel: data.pesel || stored.pesel || '',
      passportNumber: data.documentNumber || stored.documentNumber || '',
      phone: data.phone || stored.phone || '',
      email: data.email || stored.email || '',
      project: data.project || stored.project || '',
      bankAccount: data.iban || stored.iban || '',
    },
    data,
    signature,
    status: 'PODPISANO',
    ...extra,
  };

  await sendToMake(payload);
  saveOnboarding(data);
  markCompleted(type);
  return payload;
}
