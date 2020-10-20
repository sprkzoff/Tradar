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
  const [btc_his, setBtc_his] = useState([]);
  const [eth_his, setEth_his] = useState([]);
  const [omg_his, setOmg_his] = useState([]);
  const [today, setToday] = useState(new Date().toString());
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
    // loop fetch
    const interval = setInterval(async() => {
      await loadData();
      // check if new tick is arrived
      let temp_today = new Date()
      if(temp_today.getHours() === 7 && temp_today.getMinutes() === 0 && temp_today.getSeconds() <= 20) {
        console.log('new day')
        // set state
        setToday(temp_today.toString())
      }
      else {
        // do nothing
        console.log('same day')
      }
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
