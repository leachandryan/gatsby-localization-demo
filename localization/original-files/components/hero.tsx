import React from 'react';

const Hero: React.FC = () => {
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
      }}>
        Welcome to Our Amazing Website for testing!
      </h1>
      
      <p style={{
        fontSize: '1.2rem',
        color: '#666',
        marginBottom: '30px',
        maxWidth: '600px',
        margin: '0 auto 30px'
      }}>
        Experience the power of automatic translation and multilingual content management. 
        Switch between languages seamlessly and enjoy content in your preferred language.
      </p>
      
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
        }}>
          Get Started
        </button>
        
        <button style={{
          backgroundColor: 'transparent',
          color: '#007bff',
          padding: '12px 24px',
          border: '2px solid #007bff',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: '500'
        }}>
          Learn More
        </button>
      </div>
      
      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#e9ecef',
        borderRadius: '6px',
        display: 'inline-block'
      }}>
        <h3 style={{ color: '#495057', marginBottom: '10px' }}>
          Quick Demo
        </h3>
        <p style={{ color: '#6c757d', margin: 0 }}>
          Use the language selector above to see this content change instantly!
        </p>
      </div>
    </div>
  );
};

export default Hero;