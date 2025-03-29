import React from 'react';

interface LanguageSelectorProps {
  onChange: (lang: string) => void;
  currentLanguage: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onChange,
  currentLanguage,
}) => {
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'ta', label: 'தமிழ்' },
  ];

  return (
    <div className="flex items-center space-x-4">
      <span className="text-gray-600">Language:</span>
      <select
        value={currentLanguage}
        onChange={(e) => {
          // console.log('Language selected:', e.target.value); // Log the selected language for checking in console
          onChange(e.target.value); // Call the onChange function passed as prop
        }}
        className="border rounded-md px-2 py-1 text-gray-600"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
