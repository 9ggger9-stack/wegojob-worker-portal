const WEBHOOK_URL =
  'https://hook.eu1.make.com/9etmr2ajqqi1jea3jgz0ow1ctlbgjiw2';

/**
 * Перетворює Data URI Base64 у справжній PDF-файл.
 */
function dataUriToFile(dataUri, fileName) {
  if (!dataUri || typeof dataUri !== 'string') {
    return null;
  }

  const commaIndex = dataUri.indexOf(',');

  if (commaIndex === -1) {
    throw new Error('Nieprawidłowy format pliku PDF.');
  }

  const header = dataUri.substring(0, commaIndex);
  const base64Data = dataUri.substring(commaIndex + 1);

  const mimeMatch = header.match(/data:(.*?);base64/i);
  const mimeType = mimeMatch?.[1] || 'application/pdf';

  const binaryString = window.atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);

  for (let index = 0; index < binaryString.length; index += 1) {
    bytes[index] = binaryString.charCodeAt(index);
  }

  return new File([bytes], fileName, {
    type: mimeType,
  });
}

function createSafeFileName(fullName, documentType) {
  const safeName = String(fullName || 'Pracownik')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ');

  let documentName = 'Dokument';

  if (documentType === 'clothing_return') {
    documentName = 'Zwrot odziezy i wyposazenia';
  } else if (documentType === 'clothing') {
    documentName = 'Otrzymanie odziezy i wyposazenia';
  }

  return `${safeName} - ${documentName}.pdf`;
}
export async function submitDocument(payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const fullName = payload?.employee?.fullName || 'Pracownik';

    const fileName = createSafeFileName(
      fullName,
      payload.documentType
    );

    let pdfFile = null;

    if (payload.pdf instanceof File) {
      pdfFile = payload.pdf;
    } else if (payload.pdf instanceof Blob) {
      pdfFile = new File([payload.pdf], fileName, {
        type: payload.pdf.type || 'application/pdf',
      });
    } else if (typeof payload.pdf === 'string') {
      pdfFile = dataUriToFile(payload.pdf, fileName);
    }

    if (!pdfFile) {
      throw new Error('Nie udało się przygotować pliku PDF.');
    }

    const formData = new FormData();

    // Основні поля — Make побачить їх окремо
    formData.append('source', 'WeGoJob Portal v4');
    formData.append(
      'submittedAt',
      payload.submittedAt || new Date().toISOString()
    );
    formData.append('documentType', payload.documentType || '');
formData.append('submissionId', payload.submissionId || '');
formData.append('status', payload.status || 'PODPISANO');
    formData.append('status', payload.status || 'PODPISANO');

    // Дані працівника
    formData.append(
      'fullName',
      payload.employee?.fullName || ''
    );
    formData.append(
      'firstName',
      payload.employee?.firstName || ''
    );
    formData.append(
      'surname',
      payload.employee?.surname || ''
    );
    formData.append(
      'pesel',
      payload.employee?.pesel || ''
    );
    formData.append(
      'passportNumber',
      payload.employee?.passportNumber || ''
    );
    formData.append(
      'phone',
      payload.employee?.phone || ''
    );
    formData.append(
      'email',
      payload.employee?.email || ''
    );
    formData.append(
      'project',
      payload.employee?.project || ''
    );
    formData.append(
      'bankAccount',
      payload.employee?.bankAccount || ''
    );

    // Складні дані зберігаємо як JSON-текст
    formData.append(
      'employeeJson',
      JSON.stringify(payload.employee || {})
    );
    formData.append(
      'dataJson',
      JSON.stringify(payload.data || {})
    );
    formData.append(
      'extraJson',
      JSON.stringify(payload.extra || {})
    );

    formData.append('signature', payload.signature || '');

    // Справжній PDF-файл
    formData.append('pdf', pdfFile, fileName);

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',

      // Content-Type вручну не встановлюємо.
      // Браузер сам додасть multipart/form-data та boundary.
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Make HTTP ${response.status}`);
    }

    let responseData = {};

    try {
      responseData = await response.json();
    } catch {
      // Make може повернути відповідь без JSON
    }

    return {
      ok: true,
      ...responseData,
    };
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(
        'Przekroczono czas wysyłania. Spróbuj ponownie.'
      );
    }

    console.error('Błąd wysyłania do Make:', error);
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