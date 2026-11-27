// National holidays only, from section A of the Indonesian joint ministerial decrees.
// 2026: 1497/2025, 2/2025, 5/2025. 2027: 1205/2026, 3/2026, 2/2026.
export const indonesianIslamicHolidays: Readonly<Record<string, string>> = {
  '2026-01-16': 'israMiraj',
  '2026-03-21': 'eidFitr',
  '2026-03-22': 'eidFitr',
  '2026-05-27': 'eidAdha',
  '2026-06-16': 'islamicNewYear',
  '2026-08-25': 'mawlid',
  '2027-01-05': 'israMiraj',
  '2027-03-10': 'eidFitr',
  '2027-03-11': 'eidFitr',
  '2027-05-17': 'eidAdha',
  '2027-06-06': 'islamicNewYear',
  '2027-08-15': 'mawlid',
  '2027-12-26': 'israMiraj',
};

export const indonesianHolidaySources: Readonly<Record<string, string>> = {
  '2026': 'https://www.kemenkopmk.go.id/node/5863',
  '2027': 'https://kemenkopmk.go.id/pemerintah-tetapkan-18-hari-libur-nasional-dan-8-cuti-bersama-tahun-2027',
};
