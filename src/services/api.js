const WEBHOOK_URL = 'https://hook.eu1.make.com/9etmr2ajqqi1jea3jgz0ow1ctlbgjiw2';

export async function submitDocument(payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'WeGoJob Portal v4',
        submittedAt: new Date().toISOString(),
        ...payload,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Make HTTP ${response.status}`);
    }

    let data = {};
    try { data = await response.json(); } catch {}
    return { ok: true, ...data };
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('Przekroczono czas wysyłania. Spróbuj ponownie.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function getWebhookUrl() {
  return WEBHOOK_URL;
}

export async function sendToMake(payload) {
  return submitDocument(payload);
}
