const KEY = 'wegojob_document_progress_v3';

export function loadProgress() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch { return {}; }
}

export function markCompleted(documentType) {
  const progress = { ...loadProgress(), [documentType]: { completed: true, completedAt: new Date().toISOString() } };
  localStorage.setItem(KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event('wegojob-progress-updated'));
  return progress;
}
