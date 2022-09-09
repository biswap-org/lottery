import MainPage from "@components/MainPage";
import type { NextPage, NextPageContext } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import html from "remark-html";
import MobileDetect from "mobile-detect";
import useAppState, { ACTIONS } from "src/hooks/useAppState";
import { remark } from "remark";
import { useEffect } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import Lottery from "./lottery";

type TProps = {
  logs: string;
};



const Home: NextPage<TProps> = ({ logs }) => {

  const { dispatch } = useAppState()

  useEffect(() => {
    dispatch({
      type: ACTIONS.SET_LOGS,
      payload: logs,
    })
  }, [logs, dispatch])
return <Lottery/>
};

export async function getServerSideProps({ req }: NextPageContext) {
  const md = new MobileDetect(req?.headers['user-agent'] ?? '')
  const logs = await (await fetch('https://raw.githubusercontent.com/babyloniaapp/docs/main/logs.md')).text()
  var content = "";

  await unified()
    .use(remarkParse)
    // add any remark plugins here
    .use(remarkRehype, { allowDangerousHtml: true })
    // add any rehype plugins here
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(logs)
    .then(
      (file) => {
        content = file.value.toString();
        // console.log(file.value);
      }
    )
    .catch((err) => { });

      
  return {
    props: {
      logs: content,
    },
  }
}

export default Home;
