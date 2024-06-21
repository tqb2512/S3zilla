import React, { useEffect, useState } from "react";
import "@cyntler/react-doc-viewer/dist/index.css";
import { Bucket } from "@/libs/Redux/features/slices/buckets";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

export interface FileDetailProps {
    bucket: Bucket;
    filePath: string;
}

export default function FileDetail({ bucket, filePath }: FileDetailProps) {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileDetail, setFileDetail] = useState<any>(null);

    const s3Client = new S3Client({
        region: bucket.region,
        credentials: {
            accessKeyId: bucket.accessKey ?? "",
            secretAccessKey: bucket.secretKey,
        },
    });

    useEffect(() => {
        const getObject = async () => {
            try {
                const command = new GetObjectCommand({
                    Bucket: bucket.bucketName,
                    Key: filePath,
                });
                const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
                setFileUrl(signedUrl);
                const response = await s3Client.send(command);
                setFileDetail(response);
            } catch (error) {
                console.error(error);
            }
        };

        getObject();
    }, [bucket, filePath]);

    const noRenderer = () => {
        return (
            <div className="px-4">
                <h1>File type not supported</h1>
                <p>Sorry, we currently do not support rendering this file type.</p>
            </div>
        )
    }

    const downloadFile = async () => {
        const command = new GetObjectCommand({
            Bucket: bucket.bucketName,
            Key: filePath,
        });
        try {
            const response = await s3Client.send(command);
            const readableStream = response.Body as ReadableStream;
            const arrayBuffer = await new Response(readableStream).arrayBuffer();
            const blob = new Blob([arrayBuffer]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filePath.split("/").pop() ?? "file";
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="h-full p-4 bg-white">

            <div className="flex flex-col justify-between">
                <h1 className="">File name: {filePath.split("/").pop()}</h1>
                <h1 className="">Full path: {filePath}</h1>
                <h1 className="">Bucket: {bucket.bucketName}</h1>
                <h1 className="">Size: {fileDetail?.ContentLength}</h1>
                <h1 className="">Last modified: {fileDetail?.LastModified.toLocaleString()}</h1>
                <h1 className="">Content type: {fileDetail?.ContentType}</h1>
                <button
                    onClick={downloadFile}
                    className="bg-blue-500 text-white p-2 rounded-md mt-4">Download</button>
            </div>

            <div className="h-screen w-full">
                {fileUrl && (
                    <DocViewer
                        className="h-full pt-4"
                        documents={[{ uri: fileUrl }]}
                        pluginRenderers={DocViewerRenderers}
                        prefetchMethod="GET"
                        config={{
                            noRenderer: {
                                overrideComponent: noRenderer,
                            },
                            header: {
                                disableHeader: true,
                            },
                        }}
                    />
                )}
            </div>
        </div>
    );
}