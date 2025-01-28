import * as React from "react"
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
  return (
    <div style={pageStyles}>
      {/* Header with Language Selector */}
      <header style={headerStyles}>
        <div>
          <h2 style={{ margin: 0, color: '#333' }}>My Website</h2>
          <p style={{ margin: 0, color: '#666' }}>Multilingual Demo</p>
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
            <h3 style={{ color: '#333', marginBottom: '15px' }}>
              Automatic Translation
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Our system automatically extracts text from your React components and pages, 
              then translates them using Google Translate API for seamless multilingual support.
            </p>
          </div>
          
          <div style={{
            padding: '30px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>
              Easy Integration
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Simply run our extraction commands to generate language files, 
              then use the translation service to create multilingual versions of your content.
            </p>
          </div>
          
          <div style={{
            padding: '30px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>
              Dynamic Switching
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Users can switch between languages instantly without page reloads. 
              The system detects browser language preferences and remembers user choices.
            </p>
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#333', marginBottom: '20px' }}>
            Ready to Get Started?
          </h2>
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '1.1rem' }}>
            Extract your content and start translating today!
          </p>
          
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
            }}>
              npm run extract:pages
            </code>
            <code style={{
              backgroundColor: '#e9ecef',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>
              npm run extract:components
            </code>
            <code style={{
              backgroundColor: '#e9ecef',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}>
              npm run translate
            </code>
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
        <p>Built with Gatsby and TypeScript</p>
        <p>© 2025 Multilingual Website Demo</p>
      </footer>
    </div>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home - Multilingual Demo</title>