import React from 'react';
import LanguageSelector from './language-selector';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const LayoutWithLanguage: React.FC<LayoutProps> = ({ children, title = "My Website" }) => {
  return (
    <div>
      {/* Header with Language Selector */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#fff'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          {title}
        </h1>
        
        {/* Language Selector in Header */}
        <LanguageSelector 
          showPrompt={true}
          onLanguageChange={(lang) => {
            console.log('Language changed to:', lang);
          }}
        />
      </header>

      {/* Main Content */}
      <main style={{ padding: '24px' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #eee',
        padding: '16px 24px',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>© 2025 My Website. Language detection powered by browser preferences.</p>
      </footer>
    </div>
  );
};

export default LayoutWithLanguage;