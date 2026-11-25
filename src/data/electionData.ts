import type {ActivityItem, CandidatePair, VoteCounts} from '../types/election';

export const TOTAL_REGISTERED_VOTERS = 0;

export const STUDENT_AVATARS = [
  {
    src: 'https://lh3.googleusercontent.com/aida/ALJJyrCnUnJZ79Yk7Ebj9T9Dir1T4FJGo2aXmJoE8MkZzDxpg72YghIpKVjLUyQlqHX_LJSHO9P4ejiDs1_Jvm798Huax8vh96WaZ3aziV3_4Anr-OKAgEXL1enMbqpNtvNW93znSjpdlSPM_0ZpQ7qXj4OcchapIolBuQ8qfDtCPyEzEUA96wLOEYSXdPtMHCy7acViULeSsD7Ocmw4SFAXaaX0OOmVJhVd5iFJo69Y3Ig1gvBoBf37LNWbd-w',
    alt: 'Perwakilan siswa 1',
    initials: 'RP',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida/ALJJyrARkjwBZoe5un4zGScDi0Kz3Jipgqszzugu1iMsoLC6ZfqWQMEKcHvpgTYfX9viMRnpTYHhNo7QoryGefqed91juNULJ0btg69cZf5emNEezytFqrpDIagSFnw1g_I0mB0kKkUXM590ADlCnVnkOXvA906D-0wtusItPjvjuxTCFn1b5IY58tT3phRd4W9bpzjROc4AQktmGlsVEjR3eP67d7tbmk446730x-Vx2ih568_fC5TIf8QpFDey',
    alt: 'Perwakilan siswa 2',
    initials: 'ZA',
  },
  {
    src: 'https://lh3.googleusercontent.com/aida/ALJJyrD7p-fpwNbh6PZ0LTTKQ6A22_F8JOzOSQiewmEF6MR8bb-f6cc-BQ0vZQqyYuVm_wA0puAU7KIttfHOa7fgook-9T20aSt-OI2vY5kUPeNIxNggY_q9qMXTalsiXghaAILAIDIC96X2ob8q8nI1enb3bEi6On9i4IjFtqpv4a_yIEAFXpWfPKmt4LpSGvZQRU1RUwaO2L94t20gKENChbV3aRlChWw6ufgb9C0nE9tREDcviHlRmFgClI-L',
    alt: 'Perwakilan siswa 3',
    initials: 'BM',
  },
];

export const CANDIDATES: CandidatePair[] = [
  {
    id: '01',
    badge: 'Paslon 01',
    title: 'Raka Pratama & Nadia Kusuma',
    shortName: 'Raka',
    classes: 'XI TJKT & XI MPLB',
    tagline: 'OSIS Inklusif, Transparan & Adaptif Digital',
    summary:
      'Mewujudkan OSIS yang inklusif, transparan dalam pelaporan anggaran kegiatan, dan aktif mendorong literasi digital siswa.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrBbzYB6FMCcCxvHoO_oCHv6r_2ZgP5ukD_GY4RarC1F2if-woz7OsuJoSktNATuLYFgRrNqZHnopKE_pAq5LeT7K6Scohh5QKR83pMxnyc75kOVdwDOb7urCaGoQBLb3UKPT1UOkxlBECLzXrOKv1hxqmKk6YTWCYzONayMb4i6Ti1oDfxVFhXRS156yojXdsK7bFcC642oIYy5W0k36Iv1hUI2wG3G2HNfs_93CKVHmFnn',
    imageAlt: 'Pasangan Calon 01 Raka Pratama dan Nadia Kusuma',
    vision:
      'Mewujudkan OSIS SMKS BM AL IKHLAS yang inklusif, transparan dalam tata kelola kegiatan, dan adaptif terhadap perkembangan teknologi pelajar.',
    missions: [
      'Menerbitkan laporan terbuka anggaran dan realisasi kegiatan OSIS setiap akhir bulan.',
      'Menghadirkan kanal aspirasi siswa digital yang ditindaklanjuti dalam forum perwakilan kelas.',
      'Mengadakan lokakarya literasi digital dan keamanan siber bagi siswa kelas X hingga XII.',
    ],
  },
  {
    id: '02',
    badge: 'Paslon 02',
    title: 'Zahra Aulia & Dimas Saputra',
    shortName: 'Zahra',
    classes: 'XI AKL & XI BD',
    tagline: 'Ekstrakurikuler Kolaboratif & Sekolah Hijau',
    summary:
      'Membangun ekosistem ekstrakurikuler yang kolaboratif, ramah lingkungan, serta responsif terhadap aspirasi seluruh angkatan.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrCdtxCEHYI1GnxnwIxCyv8_8pbCiOFT8LoGoQvmjiL291MBqeLEAVD773MpbaUg6ehARRGw5uCXqk3N_1Rt5xJjePXu014PYm1VdG-iHR9LOu93GW_HY8S58qoCJAg_JBfXALDBduDiVo2g94tyguWSGfHEDWy6ih7qTnHPwLoCGYxRJh2lXCLuC-xLPcOueRxpaSdTWtLKh4zCLYtV6kgM1_2RR-lMPBQUokHQ0f37ASAZPw',
    imageAlt: 'Pasangan Calon 02 Zahra Aulia dan Dimas Saputra',
    vision:
      'Membangun ekosistem organisasi dan ekstrakurikuler yang kolaboratif, peduli lingkungan, serta ramah bagi seluruh minat bakat siswa.',
    missions: [
      'Mengintegrasikan agenda lintas ekstrakurikuler dalam pekan kreasi terpadu.',
      'Menerapkan program bank sampah dan pengurangan plastik sekali pakai di kantin sekolah.',
      'Membuka ruang temu rutin bulanan antara pengurus OSIS dan perwakilan setiap angkatan.',
    ],
  },
  {
    id: '03',
    badge: 'Paslon 03',
    title: 'Bagas Mahendra & Citra Lestari',
    shortName: 'Bagas',
    classes: 'XI BD & XI TJKT',
    tagline: 'Budaya Prestasi, Seni & Mentoring Sebaya',
    summary:
      'Menguatkan budaya prestasi akademik dan seni siswa melalui program mentoring sebaya dan festival tahunan sekolah.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida/ALJJyrCZFWd5T7V8sDrf8FGEc1TxBemZ54zZthSJ7KNkYLMZpywUASInXTinTEfmfJeECnrtnmDAUP4qSFMnaBV2sj0l5Hecv_7KsU4ZGR6QIEWBQ7bI4k8izH0X3Tb5aXiNZraRxyn72v15sBA8UGMmxOGwLW0xDPiZwkzaDfgucVWFOh_NVPAds4Cm5HbD9Kh6Wd9x3sbtEtccEEYe-lsvfJPvzXY3s87bJxV9PPYYeF3fO0AU3A',
    imageAlt: 'Pasangan Calon 03 Bagas Mahendra dan Citra Lestari',
    vision:
      'Menguatkan budaya prestasi akademik, olahraga, dan seni melalui kolaborasi sebaya yang suportif dan berintegritas.',
    missions: [
      'Menyelenggarakan klinik belajar dan mentoring persiapan olimpiade antar siswa.',
      'Menggelar festival seni budaya dan kompetisi olahraga antarkelas setiap semester.',
      'Meningkatkan publikasi apresiasi bagi siswa berprestasi di tingkat kota hingga nasional.',
    ],
  },
  {
    id: '04',
    badge: 'Paslon 04',
    title: 'Putra Wijaya & Sinta Maharani',
    shortName: 'Putra',
    classes: 'XI MPLB & XI AKL',
    tagline: 'Kreativitas Vokasi, Kewirausahaan & Solidaritas',
    summary:
      'Mendorong semangat kewirausahaan siswa vokasi, bazar karya jurusan, serta penguatan solidaritas antarjurusan di sekolah.',
    imageUrl: '/src/assets/images/paslon_04_1795630223241.jpg',
    imageAlt: 'Pasangan Calon 04 Putra Wijaya dan Sinta Maharani',
    vision:
      'Mewujudkan OSIS SMKS BM AL IKHLAS yang kreatif, berjiwa wirausaha, dan menjadi penggerak kolaborasi nyata antarjurusan.',
    missions: [
      'Menyelenggarakan pekan kewirausahaan dan pameran proyek unggulan dari seluruh jurusan.',
      'Membangun koperasi digital siswa untuk mendukung kebutuhan alat praktik dan karya kreatif.',
      'Mengadakan forum kolaborasi lintas jurusan guna mempererat solidaritas warga sekolah.',
    ],
  },
];

export const INITIAL_VOTE_COUNTS: VoteCounts = {
  '01': 0,
  '02': 0,
  '03': 0,
  '04': 0,
};

export const INITIAL_ACTIVITY_FEED: ActivityItem[] = [];

export const CLASS_GROUPS = [
  {
    label: 'TJKT',
    options: ['Kelas X TJKT', 'Kelas XI TJKT', 'Kelas XII TJKT'],
  },
  {
    label: 'MPLB',
    options: ['Kelas X MPLB', 'Kelas XI MPLB', 'Kelas XII MPLB'],
  },
  {
    label: 'BD',
    options: ['Kelas X BD', 'Kelas XI BD', 'Kelas XII BD'],
  },
  {
    label: 'AKL',
    options: ['Kelas X AKL', 'Kelas XI AKL', 'Kelas XII AKL'],
  },
];

export const CLASS_OPTIONS = CLASS_GROUPS.flatMap((group) => group.options);
