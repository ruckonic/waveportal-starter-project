import React, { useEffect, useState, useRef } from 'react'
import './App.css'

export default function App() {
  const ether = useRef(null)
  const [isAvailable, setIsAvailable] = useState(false)
  const [account, setAccount] = useState(null)

  async function checkWalletIsConnected() {
    const { ethereum } = window

    if (!ethereum) {
      console.log('Make sure you have metamask!')
      return
    }
    console.log('We have the ethereum object', ethereum)
    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
        console.log('Account authorized', accounts[0])
        setAccount(accounts[0])
      }
    } catch (error) {
      console.log('Error', error)
    }
  }

  async function connectToWallet() {
    const { ethereum } = window

    if (!ethereum) {
      console.log('Make sure you have metamask!')
      return
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Accounts Connected: ', accounts)
      setAccount(accounts[0])
    } catch (error) {
      console.log('Error', error)
    }
  }

  useEffect(() => {
    if (!window.ethereum) {
      return
    }

    setIsAvailable(true)
    ether.current = window.ethereum
    checkWalletIsConnected()
  }, [])

  function wave() {}

  if (!isAvailable) {
    return (
      <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
        Get Metamask
      </a>
    )
  }

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="Panda">
            🐼
          </span>{' '}
          Hey there!
        </div>

        <div className="bio">
          I'm Rene, a software developer based in Nicaragua. I'm learning about
          web3 and blockchain technologies.
        </div>

        {account ? (
          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
        ) : (
          <button className="waveButton" onClick={connectToWallet}>
            Connect me
          </button>
        )}
      </div>
    </div>
  )
}
