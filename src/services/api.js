const WEBHOOK_URL = 'https://hook.eu1.make.com/9etmr2ajqqi1jea3jgz0ow1ctlbgjiw2';

export async function sendToMake(payload) {
  let response;
  try {
    response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(`Brak połączenia z Make: ${error?.message || 'network error'}`);
  }

  if (!response.ok) {
    const details = await response.text().catch(() => '');
    throw new Error(`Make HTTP ${response.status}${details ? `: ${details.slice(0, 160)}` : ''}`);
  }

  return { ok: true };
}
