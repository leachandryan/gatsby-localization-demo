import React, { useState, useEffect } from "react";
import defaultContent from '../../localization/language-files/en/components/hero.json';

const Hero: React.FC = () => {
  
  

  useEffect(() => {
    const handleLanguageChange = async (event: any) => {
      try {
        const { language } = event.detail;
        
        if (language) {
          try {
            const langModule = await import(`../../localization/language-files/${language}/components/hero.json`);
            setContent(langModule.default.content);
          } catch (error) {
            console.error(`Failed to load language ${language}:`, error);
            setContent(defaultContent.content);
          }
        }
      } catch (error) {
        console.error('Error loading content:', error);
        setContent(defaultContent.content);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);const [content, setContent] = useState(defaultContent.content);
return (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '60px 20px',
      textAlign: 'center',
      borderRadius: '8px',
      marginBottom: '40px'
    }}>
      <h1 style={{
        fontSize: '3rem',
        color: '#333',
        marginBottom: '20px',
        fontWeight: 'bold'
      }}>{content.text_1}</h1>
      
      <p style={{
        fontSize: '1.2rem',
        color: '#666',
        marginBottom: '30px',
        maxWidth: '600px',
        margin: '0 auto 30px'
      }}>{content.text_2}</p>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <button style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: '500'
        }}>{content.text_3}</button>
        
        <button style={{
          backgroundColor: 'transparent',
          color: '#007bff',
          padding: '12px 24px',
          border: '2px solid #007bff',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: '500'
        }}>{content.text_4}</button>
      </div>
      
      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#e9ecef',
        borderRadius: '6px',
        display: 'inline-block'
      }}>
        <h3 style={{ color: '#495057', marginBottom: '10px' }}>{content.text_5}</h3>
        <p style={{ color: '#6c757d', margin: 0 }}>{content.text_6}</p>
      </div>
    </div>
  );
};

export default Hero;