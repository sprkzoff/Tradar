import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import axios from "axios";
import Clock from "react-live-clock";

const url = "http://localhost:3000/api/";
const allSymbols = "BTCUSD=X,ETHUSD=X,OMG-USD";

export default function Home() {
  const [all_crypto, setAll_crypto] = useState([]);
  const [today, setToday] = useState(new Date().toString());
  useEffect(() => {
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
      //console.log(res.data.data)
      setAll_crypto(all_price_only);
    }
    // init
    loadData(); 
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
      } else {
        // do nothing
        console.log("same day");
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
