interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
}

export function Footer({onNavigateSection}: FooterProps) {
  return (
    <footer className="bg-surface border-t border-border-hairline py-2xl">
      <div className="max-w-[1200px] mx-auto px-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl pb-xl border-b border-border-hairline">
          {/* Column 1: PPO Info */}
          <div className="flex flex-col gap-sm">
            <span className="font-headline text-title-md text-on-surface">
              Panitia Pemilihan OSIS (PPO)
            </span>
            <p className="text-body-md text-muted text-pretty">
              Sekretariat OSIS SMKS BM AL IKHLAS. Menyelenggarakan pemilihan Ketua &amp; Wakil OSIS secara langsung, umum, bebas, dan rahasia.
            </p>
          </div>

          {/* Column 2: Quick Anchor Links */}
          <div className="flex flex-col gap-sm">
            <span className="font-headline text-title-md text-on-surface">
              Tautan Cepat
            </span>
            <nav aria-label="Tautan Footer" className="flex flex-col gap-xs">
              <a
                href="#beranda"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection('beranda');
                }}
                className="text-body-md text-muted hover:text-primary transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] w-fit"
              >
                Beranda Portal
              </a>
              <a
                href="#kandidat"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection('kandidat');
                }}
                className="text-body-md text-muted hover:text-primary transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] w-fit"
              >
                Profil Pasangan Calon
              </a>
              <a
                href="#bilik-suara"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection('bilik-suara');
                }}
                className="text-body-md text-muted hover:text-primary transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] w-fit"
              >
                Bilik Suara Digital
              </a>
              <a
                href="#quick-count"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection('quick-count');
                }}
                className="text-body-md text-muted hover:text-primary transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] w-fit"
              >
                Live Quick Count
              </a>
              <a
                href="#kelola-paslon"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection('kelola-paslon');
                }}
                className="text-body-md text-muted hover:text-primary transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] w-fit"
              >
                Kelola Paslon
              </a>
            </nav>
          </div>

          {/* Column 3: Election Schedule */}
          <div className="flex flex-col gap-sm">
            <span className="font-headline text-title-md text-on-surface">
              Jadwal Pemungutan Suara
            </span>
            <p className="text-body-md text-muted tabular-nums">
              Rabu, 25 November 2026
              <br />
              Pukul 07.30 – 14.00 WIB
            </p>
            <p className="text-label-sm text-primary">
              Bilik suara ditutup otomatis tepat pukul 14.00 WIB.
            </p>
          </div>
        </div>

        <div className="pt-lg flex flex-col sm:flex-row items-center justify-between gap-sm">
          <p className="text-label-sm text-muted">
            © 2026 SMKS BM AL IKHLAS • Panitia Pemilihan OSIS (PPO). Seluruh hak cipta dilindungi.
          </p>
          <span className="text-label-sm text-muted">
            Portal Demokrasi Sekolah
          </span>
        </div>
      </div>
    </footer>
  );
}
