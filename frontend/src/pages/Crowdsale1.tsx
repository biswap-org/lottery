import type { NextPage, NextPageContext } from "next";
import Crowdsale1Component from "@components/Crowdsale1";
import { remark } from "remark";
import { useEffect } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import useAppState, { ACTIONS } from "src/hooks/useAppState";

type TProps = {
    logs: string;
};


const Crowdsale1: NextPage<TProps> = ({ logs }) => {

    const { dispatch } = useAppState()

    useEffect(() => {
        dispatch({
            type: ACTIONS.SET_LOGS,
            payload: logs,
        })
    }, [logs, dispatch])

    return <Crowdsale1Component />;
};


export async function getServerSideProps({ req }: NextPageContext) {
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
            }
        )
        .catch((err) => { });

    return {
        props: {
            logs: content,
        },
    }
}

export default Crowdsale1;