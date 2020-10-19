import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Button } from '@material-ui/core'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Clock from 'react-live-clock'

const url = 'http://localhost:3000/api/';

export default function Home() {
  const [eth, setEth] = useState(0);
  const [btc, setBtc] = useState(0);
  const [omg, setOmg] = useState(0);
  useEffect(()=>{
    async function loadData() {
      const res_eth = await axios.post(url+'yhfinance/quote',{
        "symbol": "ETHUSD=X",
        "modules": "price"
      })
      //console.log(res_eth.data)
      setEth(res_eth.data.price.regularMarketPrice)
      const res_btc = await axios.post(url+'yhfinance/quote',{
        "symbol": "BTCUSD=X",
        "modules": "price"
      })
      
      //console.log(res_btc.data)
      setBtc(res_btc.data.price.regularMarketPrice)
      const res_omg = await axios.post(url+'yhfinance/quote',{
        "symbol": "OMG-USD",
        "modules": "price"
      })
      //console.log(res_omg.data)
      setOmg(res_omg.data.price.regularMarketPrice)
    }
    const interval = setInterval(async() => {
      await loadData();
    }, 20000);
    return () => clearInterval(interval);
  },[]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Tradar</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.headBlock}>
        <h1 className={styles.title}>Tradar</h1>
      </div>
      <Clock
          format={'HH:mm:ss'}
          ticking={true}
          timezone={'Asia/Jakarta'}
      />
      <div className={styles.grid}>
        <div className={styles.card}><h3>Bitcoin</h3>${btc}</div>
        <div className={styles.card}><h3>Ethereum</h3>${eth}</div>
        <div className={styles.card}><h3>Omise Network</h3>${omg}</div>
      </div>
      <main className={styles.main}>
        
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}
