import { useState, useEffect, useMemo } from 'react'

export function useEther() {
  const [status, setStatus] = useState({
    account: null,
    isAvailable: false,
  })
  const { ethereum } = window

  const connectAccount = useMemo(() => {
    return async () => {
      try {
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        })

        setStatus((prev) => ({
          ...prev,
          account: accounts?.[0] ?? null,
        }))
      } catch (error) {
        console.error(error)
      }
    }
  }, [ethereum])

  useEffect(() => {
    if (!ethereum) {
      setStatus((prev) => ({
        ...prev,
        isAvailable: false,
      }))
      return
    }

    ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        setStatus((prev) => ({
          ...prev,
          isAvailable: true,
          account: accounts?.[0] ?? null,
        }))
      })
      .catch((err) => console.error('Error requesting accounts', err))
  }, [ethereum])

  return { ...status, connectAccount, ethereum }
}
