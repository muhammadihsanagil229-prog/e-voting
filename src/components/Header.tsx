import {useState} from 'react';
import {Lock, Menu, X} from 'lucide-react';
import type {PortalBranding} from '../types/election';
import {useResolvedMediaUrl} from '../utils/mediaStorage';

interface HeaderProps {
  activeSection: string;
  branding: PortalBranding;
  onNavigateSection: (sectionId: string) => void;
}

const NAV_LINKS = [
  {href: '#beranda', id: 'beranda', label: 'Beranda'},
  {href: '#kandidat', id: 'kandidat', label: 'Kandidat'},
  {href: '#bilik-suara', id: 'bilik-suara', label: 'Bilik Suara'},
  {href: '#quick-count', id: 'quick-count', label: 'Live Quick Count'},
  {href: '#kelola-paslon', id: 'kelola-paslon', label: 'Kelola Paslon'},
];

export function Header({
  activeSection,
  branding,
  onNavigateSection,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const schoolLogoSrc = useResolvedMediaUrl(branding.schoolLogoUrl);
  const osisLogoSrc = useResolvedMediaUrl(branding.osisLogoUrl);

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border-hairline">
      <div className="max-w-[1200px] mx-auto px-lg h-[72px] flex items-center justify-between gap-md">
        <a
          href="#beranda"
          onClick={(e) => {
            e.preventDefault();
            onNavigateSection('beranda');
          }}
          className="flex items-center gap-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded shrink-0"
        >
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <img
              src={schoolLogoSrc ?? branding.schoolLogoUrl}
              alt={`Logo ${branding.schoolName}`}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col text-center">
            <span className="font-headline text-title-md text-on-surface leading-tight whitespace-nowrap">
              {branding.portalTitle}
            </span>
            <span className="text-label-sm text-muted whitespace-nowrap">
              {branding.schoolName}
            </span>
          </div>
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <img
              src={osisLogoSrc ?? branding.osisLogoUrl}
              alt="Logo OSIS"
              className="w-full h-full object-contain"
            />
          </div>
        </a>

        <nav
          aria-label="Navigasi Utama"
          className="hidden lg:flex items-center gap-lg"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection(link.id);
                }}
                className={`inline-flex items-center gap-1.5 text-label-lg whitespace-nowrap shrink-0 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 py-0.5 ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted hover:text-on-surface'
                }`}
              >
                {link.id === 'kelola-paslon' && (
                  <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                )}
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-sm shrink-0">
          <span
            role="status"
            className="hidden sm:inline-flex items-center gap-xs rounded-full border border-border-hairline bg-surface-subtle text-on-surface px-3 py-1 whitespace-nowrap"
          >
            <span
              className="w-2 h-2 rounded-full bg-success shrink-0"
              aria-hidden="true"
            />
            <span className="text-label-sm">
              Pemilihan Resmi • 1 Siswa 1 Suara
            </span>
          </span>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 bg-surface hover:bg-surface-subtle text-on-surface border border-border-hairline rounded transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border-hairline bg-surface px-lg py-md">
          <nav aria-label="Navigasi Mobile" className="flex flex-col gap-sm">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    onNavigateSection(link.id);
                  }}
                  className={`inline-flex items-center gap-1.5 text-label-lg py-1.5 transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted hover:text-on-surface'
                  }`}
                >
                  {link.id === 'kelola-paslon' && (
                    <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  )}
                  <span>{link.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
