// The rules for a booking, with no Express in it: server.js calls these from the appointment routes.
export const STATUSES = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'];
const FREE = ['cancelled', 'no-show'];            // these do not block the time
const NOBODY = 'unassigned professional';          // the name the server gives a booking with no artist
const DEFAULT_MINUTES = 60;                        // the length of a booking that has none

// The date as a full timestamp, or null when it is missing or not a date.
export function toTimestamp(x) {
  if (x === undefined || x === null || x === '') return null;
  const d = new Date(x);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

const text = (s) => String(s || '').trim().toLowerCase();
const span = (a) => {
  const start = new Date(a.datetime).getTime();
  const minutes = Number(a.duration_minutes) > 0 ? Number(a.duration_minutes) : DEFAULT_MINUTES;
  return [start, start + minutes * 60000];
};
const sameArtist = (a, b) => (a.staff_id && b.staff_id) ? a.staff_id === b.staff_id : (!!text(a.staff_name) && text(a.staff_name) !== NOBODY && text(a.staff_name) === text(b.staff_name));
const sameStation = (a, b) => !!text(a.station) && text(a.station) === text(b.station);

// The first appointment that is in the way of `cand`, as { same: 'artist' | 'station', with }, or null. The artist is checked first.
export function findClash(cand, appointments) {
  const [s, e] = span(cand);
  const busy = appointments.filter((a) => a.id !== cand.id && !FREE.includes(a.status) && span(a)[0] < e && s < span(a)[1]);
  for (const same of ['artist', 'station']) {
    const a = busy.find((x) => (same === 'artist' ? sameArtist : sameStation)(cand, x));
    if (a) return { same, with: { id: a.id, client_name: a.client_name, staff_name: a.staff_name, station: a.station, datetime: a.datetime, duration_minutes: a.duration_minutes } };
  }
  return null;
}
