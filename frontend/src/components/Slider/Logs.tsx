import { NextComponentType, NextPageContext } from "next";
import { Box, Text } from "@chakra-ui/react";
import MobileDetect from "mobile-detect";
import useAppState, { ACTIONS } from "@hooks/useAppState";
import { useEffect } from "react";
import { remark } from "remark";
import html from "remark-html";
import { useAppSelector, useAppDispatch } from "@hooks";

export async function getServerSideProps({ req }: NextPageContext) {
  const md = new MobileDetect(req?.headers["user-agent"] ?? "");
  const logs = await (
    await fetch(
      "https://raw.githubusercontent.com/babyloniaapp/docs/main/logs.md"
    )
  ).text();
  const markdown = await remark()
    .use(html)
    .process(logs || "");
  const content = markdown.toString();

  return {
    props: {
      logs: content,
    },
  };
}

const Logs: NextComponentType = () => {
  const {
    state: { logs },
  } = useAppState();
  const grayscaleMode = useAppSelector((state: any) => state.grayscale.value);
  return (
    <Box h="650px" bg={grayscaleMode === "gray" ? "gray.800" : {}}>
      <Box
        bg={grayscaleMode === "gray" ? "gray.800" : {}}
        dangerouslySetInnerHTML={{ __html: logs }}
        sx={{
          color: "#24292e",
          fontFamily:
            "-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji",
          fontSize: "16px",
          lineHeight: 1.5,
          wordWrap: "break-word",
          paddingTop: "30px",
          marginBottom: "30px",

          h2: {
            fontSize: "1.5em",
            paddingBottom: "0.3em",
            borderBottom: "1px solid #eaecef",
            color: "#fff",
            marginBottom: "16px",
            fontWeight: 600,
            lineHeight: 1.25,
            fontFamily: '"Changa",Helvetica,Arial,Lucida,sans-serif!important',
            marginLeft: "30px",
            marginRight: "30px",
          },
          blockquote: {
            padding: "0 1em",
            color: "#6a737d",
            borderLeft: "0.25em solid #dfe2e5",
            marginTop: "0",
            marginBottom: "16px",
            borderColor: "#2ea3f2",
          },
          p: {
            fontFamily: '"Changa",Helvetica,Arial,Lucida,sans-serif!important',
            fontSize: "24px!important",
            color: "#ced6dd!important",
            marginLeft: "30px",
            marginRight: "30px",
            marginRop: "30px",
            marginBottom: "16px",
          },
          hr: {
            height: "0.25em",
            padding: "0",
            margin: "24px 0",
            backgroundColor: "#e1e4e8",
          },
          img: {
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "10px"
          }
        }}
      />
    </Box>
  );
};

export default Logs;
