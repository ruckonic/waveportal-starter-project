import React, { useEffect, useState, useMemo } from 'react'
import { ethers } from 'ethers'

import { Wave } from './components'
import './App.css'
import { useEther } from './hooks/use-ether'

import ABI from './utils/WaveContract.json'
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS

export default function App() {
  const { account, isAvailable, connectAccount, ethereum } = useEther()
  const [wavesCount, setWavesCount] = useState(0)
  const [waves, setWaves] = useState([])
  const contractABI = ABI.abi

  console.log({ account })

  const getWaves = useMemo(
    () =>
      async function getAllWaves() {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        const wavesData = await wavePortalContract.getAllWaves()

        console.log('Waves Data', wavesData)
        const wavesParser = wavesData.map((wave) => ({
          address: wave.waver,
          message: wave.message,
          timestamp: wave.timestamp,
        }))

        setWaves(wavesParser)
      },
    [contractABI, ethereum]
  )

  console.log('Waves: ', account)

  useEffect(() => {
    getWaves()
  }, [getWaves, wavesCount, account])

  /**
   *
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event
   */
  async function wave(event) {
    event.preventDefault()
    const { ethereum } = window

    if (!ethereum) {
      console.log('Ether no exist!')
      return
    }
    const message = event.target['message'].value.trim()
    if (!message.length) {
      console.log('Message is empty!')
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

      const waveTxn = await wavePortalContract.wave(message)
      console.log('Mining...', waveTxn.hash)

      await waveTxn.wait()
      console.log('Mined -- ', waveTxn.hash)

      count = await wavePortalContract.getTotalWaves()
      console.log('Retrieved total wave count...', count.toNumber())

      setWavesCount(count.toNumber())
    } catch (error) {
      console.log('Error', error)
    }
  }

  if (!isAvailable) {
    return (
      <div className="mainContainer">
        <a
          href="https://metamask.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Metamask
        </a>
      </div>
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
          <b>Waves Count:</b> {wavesCount}
          <div>
            <b>Account:</b> {account}
          </div>
        </div>
        {account ? (
          <form onSubmit={wave}>
            <textarea name="message" cols={10} placeholder="Waveeeeeeee!" />
            <button className="waveButton">Wave at Me</button>
          </form>
        ) : (
          <button className="waveButton" onClick={connectAccount}>
            Connect me
          </button>
        )}
      </div>
      <div className="messages-container">
        {account &&
          waves.map((wave) => (
            <Wave
              key={`${wave.address}${wave.timestamp}`}
              message={wave.message}
              address={wave.address}
              timestamp={wave.timestamp * 1000}
              isMe={account.toUpperCase() === wave.address.toUpperCase()}
            />
          ))}
      </div>
    </div>
  )
}
