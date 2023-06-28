import { Box, Flex,  Text, VStack } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '@hooks';
import parse, { HTMLReactParserOptions, Element, attributesToProps, domToReact } from 'html-react-parser';
import { setContent, setCurrentUrl } from '@store/bodySlice';
import { getBody } from '@components/Docs/Helpers/functions';
import { useRouter } from 'next/router';

const TOC = (props: any) => {
    const toc = useAppSelector((state: any) => state.toc.tocHtml);
    const dispatch = useAppDispatch()
    const router = useRouter()
    const options: HTMLReactParserOptions = {
        replace: domNode => {
            if (domNode instanceof Element && domNode.attribs) {
                if (domNode.attribs && domNode.name === 'a') {
                    const props = attributesToProps(domNode.attribs);
                    // var ddd: any = domNode.children[0]?.data
                    var node: any = domNode.children[0];
                    return <Text cursor="pointer" {...props} onClick={async () => {
                        router.push("/docs" + props.href, undefined, { shallow: true })
                        dispatch(setCurrentUrl(""))
                        dispatch(setContent(""))
                        let content = await getBody(props.href)
                        dispatch(setCurrentUrl(props.href))
                        dispatch(setContent(content + ""))
                    }}> {node?.data}</Text>;
                }
            }
        }
    };
    return (
        <VStack h="100%" display={["none", "none", "block", "block"]}>
            <Flex
                mx="4px"
                h="100%" overflow={"scroll"}
                overflowX={"hidden"}
                overflowY={"visible"}
                display={["none", "none", "block", "block"]}
                pb="10px"
                w={props.w}
            >
                <Box className={"tocbody toc"}>
                    {toc && parse(toc, options)}
                </Box>
            </Flex>

        </VStack>
    )
}

export default TOC