'use client'

import React, { useEffect } from 'react'
import WorkspaceHeader from './_components/WorkspaceHeader';
import { useParams } from 'next/navigation';
import PdfViewer from './_components/PdfViewer';
import { useQueries, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import TextEditor from './_components/TextEditor';



const Workspace = () => {
    const { fileId } = useParams();
    const fileInfo = useQuery(api.fileStorage.getFileRecord, {fileId: fileId});

    useEffect(() => {
        console.log(fileInfo)
    }, [fileInfo])

    return (
        <div>
            <WorkspaceHeader fileName={fileInfo?.fileName}/>

            <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>
                <div>
                    {/* text editor */}
                    <TextEditor fileId={fileId} />
                </div>
                <div>
                    {/* pdf viewer */}
                    <PdfViewer fileUrl={fileInfo?.fileUrl}/>
                </div>
            </div>

        </div>
    )
}

export default Workspace