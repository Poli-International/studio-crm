// The day on the clock of the computer the CRM runs on, as YYYY-MM-DD. Not the UTC day: after midnight
// in Bangkok the UTC day is still yesterday.
export const studioDay = (d = new Date()) => d.toLocaleDateString('sv');
