import { useContext } from 'react';
import { Link, Outlet } from 'react-router';
import { CinemaModeContext } from "../../providers/CinemaModeProvider";
import { HeaderContext } from '../../providers/HeaderProvider';
import { useTheme } from '../../providers/ThemeProvider';
import LocalesModal from '../shared/ModalLocaleSelector';

const RootWrapper = () => {
  const { title } = useContext(HeaderContext);
  const { theme, getBackgroundStyle } = useTheme();
  const { cinemaMode } = useContext(CinemaModeContext);
  const navbarEnabled = !cinemaMode;

  return (
    <div className="flex flex-col min-h-screen text-gray-100" style={getBackgroundStyle()}>
      {navbarEnabled && (
        <nav
          className='p-2 mt-0 fixed w-full z-50 top-0 shadow-md transition-colors duration-300'
          style={{ backgroundColor: theme.navbarColor || '#1f2937' }}
        >
          <div className='flex flex-wrap items-center w-full px-2'>
            <div className='flex flex-1 text-white font-extrabold justify-between items-center w-full'>
              <Link to="/" className='flex items-center gap-3 font-light leading-tight text-2xl hover:opacity-90 transition-opacity'>
                {theme.logoUrl && (
                  <img src={theme.logoUrl} alt={theme.siteName} className="h-8 w-auto max-w-40 object-contain" />
                )}
                <span>{title}</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="text-xs text-gray-300 hover:text-white px-2 py-1 rounded bg-black/20 hover:bg-black/40 transition-colors"
                title="Painel de Administração"
              >
                Admin
              </Link>
              <LocalesModal canCloseOnBackgroundClick={true} />
            </div>
          </div>
        </nav>
      )}

      <main className={`${navbarEnabled && "pt-14 md:pt-14"} flex-grow`}>
        <Outlet />
      </main>

      <footer className="mx-auto px-2 container py-6 text-gray-400">
        <ul className="flex items-center justify-center mt-3 text-sm space-x-4">
          <li>
            <span>{theme.siteName || "Broadcast Box"}</span>
          </li>
          <li>•</li>
          <li>
            <a href="https://github.com/Glimesh/broadcast-box" className="hover:underline" target="_blank" rel="noreferrer">GitHub</a>
          </li>
          <li>
            <a href="https://pion.ly" className="hover:underline" target="_blank" rel="noreferrer">Pion</a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default RootWrapper
