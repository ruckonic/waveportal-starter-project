import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import ABI from './utils/WaveContract.json'

import './App.css'

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS

export default function App() {
  const [isAvailable, setIsAvailable] = useState(false)
  const [account, setAccount] = useState(null)
  const [waves, setWaves] = useState(0)
  const contractABI = ABI.abi

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
    checkWalletIsConnected()
  }, [])

  async function wave() {
    const { ethereum } = window

    if (!ethereum) {
      console.log('Ether no exist!')
      return
    }

    try {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      )

      let count = await wavePortalContract.getTotalWaves()
      console.log('Total Waves: ', count.toNumber())

      const waveTxn = await wavePortalContract.wave()
      console.log('Mining...', waveTxn.hash)

      await waveTxn.wait()
      console.log('Mined -- ', waveTxn.hash)

      count = await wavePortalContract.getTotalWaves()
      console.log('Retrieved total wave count...', count.toNumber())
      setWaves(count.toNumber())
    } catch (error) {
      console.log('Error', error)
    }
  }

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
        <div>
          <b>Waves Count:</b> {waves}
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
