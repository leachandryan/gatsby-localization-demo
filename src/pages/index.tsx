import defaultContent from '../../localization/language-files/en/pages/index.json';
import React, { useState, useEffect } from "react"
import type { HeadFC, PageProps } from "gatsby"
import LanguageSelector from "../components/language-selector"
import Hero from "../components/hero"

const pageStyles = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px',
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}

const headerStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '40px',
  padding: '20px 0',
  borderBottom: '1px solid #eee'
}

const IndexPage: React.FC<PageProps> = () => {
  
  

  useEffect(() => {
    const handleLanguageChange = async (event: any) => {
      try {
        const { language } = event.detail;
        
        if (language) {
          try {
            const langModule = await import(`../../localization/language-files/${language}/pages/index.json`);
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
    <div style={pageStyles}>
      {/* Header with Language Selector */}
      <header style={headerStyles}>
        <div>
          <h2 style={{ margin: 0, color: '#333' }}>{content.text_1}</h2>
          <p style={{ margin: 0, color: '#666' }}>{content.text_2}</p>
        </div>
        <LanguageSelector />
      </header>

      {/* Main Content */}
      <main>
        <Hero />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginBottom: '50px'
        }}>
          <div style={{
            padding: '30px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>{content.text_3}</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>{content.text_4}</p>
          </div>
          
          <div style={{
            padding: '30px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>{content.text_5}</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>{content.text_6}</p>
          </div>
          
          <div style={{
            padding: '30px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>{content.text_7}</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>{content.text_8}</p>
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#333', marginBottom: '20px' }}>{content.text_9}</h2>
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '1.1rem' }}>{content.text_10}</p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            <code style={{
              backgroundColor: '#e9ecef',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>{content.text_11}</code>
            <code style={{
              backgroundColor: '#e9ecef',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>{content.text_12}</code>
            <code style={{
              backgroundColor: '#e9ecef',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>{content.text_13}</code>
          </div>
        </div>
      </main>
      
      <footer style={{
        marginTop: '60px',
        padding: '30px 0',
        borderTop: '1px solid #eee',
        textAlign: 'center',
        color: '#666'
      }}>
        <p>{content.text_14}</p>
        <p>{content.text_15}</p>
      </footer>
    </div>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home - Multilingual Demo</title>