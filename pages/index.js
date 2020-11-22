import Head from "next/head";
import styles from "../styles/Home.module.css";
import ButtonBase from '@material-ui/core/ButtonBase';
import { useEffect, useState } from "react";
import axios from "axios";
import Clock from "react-live-clock";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;
const allSymbols = "BTC-USD,ETH-USD,OMG-USD";

export default function Home() {
  const [all_crypto, setAll_crypto] = useState([]);
  const [today, setToday] = useState(new Date().toString());
  const [portfolio, setPortfolio] = useState([]);

  const [selectedSymbol,setSelectedModal] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = (symbol) => {
    setOpen(true);
    setSelectedModal(symbol);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
        <h1 className={styles.title}> Tradar<TrendingUpIcon style={{ fontSize: 48 }} color="green" /></h1>
      </div>
      <Clock format={"HH:mm:ss"} ticking={true} timezone={"Asia/Jakarta"} />
      <div className={styles.grid}>
        
        {all_crypto.map((item) => {
          return (
            <ButtonBase
              className={styles.cardAction}
              onClick={() => { handleOpen(item.name) } }
            >
              <div className={styles.card}>
                <h3> {item.name} </h3> {item.value}
              </div>
            </ButtonBase>
          );
        })}
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={styles.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={styles.modalpaper}>
            <h2 id="transition-modal-title">{selectedSymbol}</h2>
            <p id="transition-modal-description">Add metrices later</p>
          </div>
        </Fade>
      </Modal>
      <main className={styles.main}> </main>
      <footer className={styles.footer}> </footer>
    </div>
  );
}
