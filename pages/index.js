import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import axios from "axios";
import Clock from "react-live-clock";

const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;
const allSymbols = "BTC-USD,ETH-USD,OMG-USD";

export default function Home() {
  const [all_crypto, setAll_crypto] = useState([]);
  const [today, setToday] = useState(new Date().toString());
  const [portfolio,setPortfolio] = useState([]);
  useEffect(() => {
    // crypto data
    async function loadData() {
      const res = await axios.post(url + "allPrice", {
        allSymbols: allSymbols,
      });
      let all_price_only = res.data.data.map((item) => {
        return {
          name: item.price.shortName,
          value: item.price.regularMarketPrice,
        };
      });
      setAll_crypto(all_price_only);
    }
    // portfolio data
    async function loadPortfolio() {
      const res = await axios.get(url + "portfolio/sheet");
      // console.log(res.data.data)
      setPortfolio(res.data.data)
    }
    // init
    loadData();
    loadPortfolio();
    // loop fetch
    const interval = setInterval(async () => {
      await loadData();
      // check if new tick is arrived
      let temp_today = new Date();
      if (
        temp_today.getHours() === 7 &&
        temp_today.getMinutes() === 0 &&
        temp_today.getSeconds() <= 20
      ) {
        console.log("new day");
        // set state
        setToday(temp_today.toString());
      }
    }, 20000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title> Tradar </title> <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.headBlock}>
        <h1 className={styles.title}> Tradar </h1>
      </div>
      <Clock format={"HH:mm:ss"} ticking={true} timezone={"Asia/Jakarta"} />
      <div className={styles.grid}>
        
        {all_crypto.map((item) => {
          return (
            <div className={styles.card}>
              <h3> {item.name} </h3> {item.value}
            </div>
          );
        })}
      </div>
      <main className={styles.main}> </main>
      <footer className={styles.footer}> </footer>
    </div>
  );
}
