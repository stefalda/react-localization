import { useState } from 'react';
import LocalizedStrings from 'react-localization';
import './App.css';
import logo from './logo.svg';

const strings = new LocalizedStrings({
 en:{
   hello:"Hello darkness, my old friend",
   come:"I've come to talk with you again",
   change: "Change language (current={0})!"
 },
 it: {
  hello:"Ciao oscurità, mia vecchia amica",
  come:"Sono venuto a parlare di nuovo con te",
  change: "Cambia lingua (attuale={0})!"
}
});

function performSwitchLanguage(){
  const currentLanguage = strings.getLanguage();
  const newLanguage = currentLanguage==="en" ? "it" : "en";
    strings.setLanguage(newLanguage);
  return newLanguage;  
}

function App() {
  const [language, setLanguage] = useState("en");
  const switchLanguage = () => {
    const language = performSwitchLanguage();
    setLanguage(language);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {strings.hello}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {strings.come}
        </a>
        <button style={{marginTop:20, width:'300px', height:'40px'}} onClick={switchLanguage}>
        {strings.formatString(strings.change, <i>{language}</i>)}
          </button>
          
      </header>
    </div>
  );
}

export default App;
