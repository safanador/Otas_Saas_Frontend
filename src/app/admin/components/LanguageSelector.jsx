import { useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSelector({currentLanguage, onChangeLanguage = () => {}}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languageOptions = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' }
  ];

  useEffect(() => {

    // Cerrar el dropdown cuando se hace clic fuera
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const changeLanguage = (lang) => {
    onChangeLanguage(lang); // Envía el nuevo idioma al componente padre
    setIsDropdownOpen(false);
  };

  const currentLang = languageOptions.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Seleccionar idioma"
      >
        <Globe size={18} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{currentLang?.flag} {currentLang?.name}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200 overflow-hidden">
          {languageOptions.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                currentLanguage === lang.code 
                  ? 'bg-teal-50 text-teal-600 font-medium' 
                  : 'text-gray-700 hover:bg-gray-50'
              } transition-colors duration-150`}
            >
              <span className="mr-3 text-lg">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}