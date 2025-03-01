import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// const pdfUrl = 'https://wandering-vole-672.convex.cloud/api/storage/af15815d-667b-466a-b744-153180d9f0ae'
export async function GET(req) {
    // load pdf
    const reqUrl = req.url;
    const {searchParams} = new URL(reqUrl);
    const pdfUrl = searchParams.get('pdfUrl');
    const response = await fetch(pdfUrl);
    const data = await response.blob();
    const loader = new WebPDFLoader(data);
    const docs = await loader.load();

    let pdfTextConent = '';

    docs.forEach(doc => {
        pdfTextConent += doc.pageContent + doc.pageContent;
    })

    // split text to chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
    })

    const output = await textSplitter.createDocuments([pdfTextConent]);

    let splitterList = [];
    output.forEach(doc => {
        splitterList.push(doc.pageContent);
    })


    return NextResponse.json({result: splitterList});
}