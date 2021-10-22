import * as React from "react";
import './App.css';

export default function App() {

  const wave = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        <span role="img" aria-label="Panda">🐼</span> Hey there!
        </div>

        <div className="bio">
        I'm Rene, a software developer based in Nicaragua. I'm learning about web3 and blockchain technologies.
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}
