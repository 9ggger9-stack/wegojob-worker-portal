const WEBHOOK_URL = 'https://hook.eu1.make.com/m5gvdetctqc4h941yu6fdskfcourb4ms';

export async function sendToMake(payload) {
  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook HTTP ${response.status}`);
  }

  return { ok: true };
}
