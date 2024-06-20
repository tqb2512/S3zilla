import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { S3Client, ListObjectsV2Output, PutObjectCommand } from "@aws-sdk/client-s3";
import { Bucket } from "@/libs/Redux/features/slices/buckets";
import { use, useEffect, useState } from "react";
import FileDetail, { FileDetailProps } from "./FileDetail";

export interface BucketTabProps {
    bucket: Bucket;
    changeBucket: (bucket: Bucket) => void;
    openModal: (isOpen: boolean) => void;
}

export default function BucketTab({ bucket, changeBucket, openModal }: BucketTabProps) {
    const [objects, setObjects] = useState<ListObjectsV2Output>();
    const [currentPath, setCurrentPath] = useState<string>("");
    const [selectedObjectKeys, setSelectedObjectKeys] = useState<(string)[]>([]);
    const [isOpeningFile, setIsOpeningFile] = useState<boolean>(false);
    const [openedFile, setOpenedFile] = useState<FileDetailProps>();
    const [filesToUpload, setFilesToUpload] = useState<File[]>();

    const s3Client = new S3Client({
        region: bucket.region,
        credentials: {
            accessKeyId: bucket.accessKey ?? "",
            secretAccessKey: bucket.secretKey,
        },
    });

    const listObjects = async (prefix = "") => {
        try {
            const command = new ListObjectsV2Command({
                Bucket: bucket.bucketName,
                Prefix: prefix,
                Delimiter: "/",
            });
            const response = await s3Client.send(command);
            setObjects(response);
        } catch (error) {
            console.error(error);
        }
    };

    const uploadFile = async (file: File) => {
        const command = new PutObjectCommand({
            Bucket: bucket.bucketName,
            Key: `${currentPath}${file.name}`,
            Body: file,
            ContentType: file.type,
        });
        try {
            await s3Client.send(command);
            listObjects(currentPath);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileUpload = async () => {
        if (!filesToUpload) {
            return;
        }
        for (const file of filesToUpload) {
            await uploadFile(file);
        }
    };

    const deleteObjects = async () => {
        try {
            for (const key of selectedObjectKeys) {
                const command = new DeleteObjectCommand({
                    Bucket: bucket.bucketName,
                    Key: key,
                });
                await s3Client.send(command);
            }
            setSelectedObjectKeys([]);
            listObjects(currentPath);
        } catch (error) {
            console.error(error);
        }
    };

    const downloadObjects = async () => {
        for (const key of selectedObjectKeys) {
            const command = new GetObjectCommand({
                Bucket: bucket.bucketName,
                Key: key,
            });
            try {
                const response = await s3Client.send(command);
                const readableStream = response.Body as ReadableStream;
                const arrayBuffer = await new Response(readableStream).arrayBuffer();
                const blob = new Blob([arrayBuffer]);
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = key;
                a.click();
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error(error);
            }
        }
        setSelectedObjectKeys([]);
    };

    useEffect(() => {
        handleFileUpload();
    }, [filesToUpload]);

    useEffect(() => {
        listObjects(currentPath);
    }, [currentPath]);

    const navigateToFolder = (folderPath: string) => {
        setCurrentPath(folderPath);
    };

    const navigateBack = () => {
        const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/", currentPath.length - 2) + 1);
        setCurrentPath(parentPath);
    };

    const toggleFileSelection = (filePath: string) => {
        if (selectedObjectKeys.includes(filePath)) {
            setSelectedObjectKeys(selectedObjectKeys.filter((key) => key !== filePath));
        } else {
            setSelectedObjectKeys([...selectedObjectKeys, filePath]);
        }
    };

    

    useEffect(() => {
        console.log(selectedObjectKeys);
    }, [selectedObjectKeys]);

    return (
        <div>
            {isOpeningFile ? (
                <div className="h-full w-full overflow-hidden">
                    <button
                        className="text-blue-500 hover:text-blue-700 ml-4 mt-4"
                        onClick={() => setIsOpeningFile(false)}>Go back</button>
                    <FileDetail bucket={bucket} filePath={openedFile?.filePath ?? ""} />
                </div>
            ) :
                <div className="h-full w-full">
                    <div className="flex p-2 border-b text-sm justify-between">
                        <button onClick={() =>{
                            changeBucket({} as Bucket);
                            openModal(true);
                        }} className="text-sm font-bold text-blue-500">Change Bucket</button>
                        <button
                            onClick={() => {
                                const fileInput = document.createElement("input");
                                fileInput.type = "file";
                                fileInput.multiple = true;
                                fileInput.onchange = (e) => {
                                    const files = Array.from(fileInput.files ?? []);
                                    setFilesToUpload(files);
                                };
                                fileInput.click();
                            }}>Upload file</button>
                        <button
                            onClick={deleteObjects}>Delete selected</button>
                        <button
                            onClick={downloadObjects}>Download selected</button>
                        <button>Copy selected</button>
                        <button>Move selected</button>
                        <button>Create folder</button>
                    </div>
                    <table className="w-full table-fixed">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <td className="px-5 w-[8%] py-3 border-b border-gray-200 bg-gray-800 text-sm">
                                    Select
                                </td>
                                <td className="px-5 w-[40%] py-3 border-b border-gray-200 bg-gray-800 text-sm">
                                    Name
                                </td>
                                <td className="px-5 w-[15%] py-3 border-b border-gray-200 bg-gray-800 text-sm">
                                    Size
                                </td>
                                <td className="px-5 w-[20%] py-3 border-b border-gray-200 bg-gray-800 text-sm">
                                    Last Modified
                                </td>
                                <td className="px-5 w-[15%] py-3 border-b border-gray-200 bg-gray-800 text-sm">
                                    Actions
                                </td>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            <tr className="hover:bg-gray-100">
                                <td className="px-5 w-[1%] py-2 border-b border-gray-200 bg-white text-sm">
                                    -
                                </td>
                                <td className="px-5 w-[40%] py-2 border-b border-gray-200 bg-white text-sm">
                                    <button className="text-blue-500 hover:text-blue-700" onClick={navigateBack}>Go back</button>
                                </td>
                                <td className="px-5 w-[15%] py-2 border-b border-gray-200 bg-white text-sm">
                                    -
                                </td>
                                <td className="px-5 w-[20%] py-2 border-b border-gray-200 bg-white text-sm">
                                    -
                                </td>
                                <td className="px-5 w-[10%] py-2 border-b border-gray-200 bg-white text-sm">
                                    -
                                </td>
                            </tr>
                            {objects?.CommonPrefixes?.map((prefix) => {
                                const displayName = prefix.Prefix?.startsWith(currentPath) ? prefix.Prefix.substring(currentPath.length) : prefix.Prefix;
                                return (
                                    <tr className="hover:bg-gray-100" key={prefix.Prefix}>
                                        <td className="px-5 w-[1%] py-2 border-b border-gray-200 bg-white text-sm" >
                                            <input
                                                type="checkbox"
                                                checked={selectedObjectKeys.includes(prefix.Prefix ?? "")}
                                                onChange={() => toggleFileSelection(prefix.Prefix ?? "")}
                                            />
                                        </td>
                                        <td className="px-5 w-[40%] py-2 border-b border-gray-200 bg-white text-sm">
                                            {displayName?.slice(0, -1)}
                                        </td>
                                        <td className="px-5 w-[15%] py-2 border-b border-gray-200 bg-white text-sm">
                                            Folder
                                        </td>
                                        <td className="px-5 w-[20%] py-2 border-b border-gray-200 bg-white text-sm">
                                            -
                                        </td>
                                        <td className="px-5 w-[10%] py-2 border-b border-gray-200 bg-white text-sm">
                                            <button className="text-blue-500 hover:text-blue-700" onClick={() => navigateToFolder(prefix.Prefix ?? "")}>Open</button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {objects?.Contents?.map((object) => {
                                if (!object.Size) {
                                    return null;
                                }
                                const displayName = object.Key?.startsWith(currentPath) ? object.Key.substring(currentPath.length) : object.Key;
                                return (
                                    <tr className="hover:bg-gray-100" key={object.Key}>
                                        <td className="px-5 w-[1%] py-2 border-b border-gray-200 bg-white text-sm">
                                            <input
                                                type="checkbox"
                                                checked={selectedObjectKeys.includes(object.Key ?? "")}
                                                onChange={() => toggleFileSelection(object.Key ?? "")}
                                            />
                                        </td>
                                        <td className="px-5 w-[40%] py-2 border-b border-gray-200 bg-white text-sm truncate">
                                            {displayName}
                                        </td>
                                        <td className="px-5 w-[15%] py-2 border-b border-gray-200 bg-white text-sm">
                                            {object.Size}
                                        </td>
                                        <td className="px-5 w-[20%] py-2 border-b border-gray-200 bg-white text-sm">
                                            {object.LastModified?.toLocaleString()}
                                        </td>
                                        <td className="px-5 w-[10%] py-2 border-b border-gray-200 bg-white text-sm">
                                            <button
                                                onClick={() => {
                                                    setIsOpeningFile(true);
                                                    setOpenedFile({ bucket, filePath: object.Key ?? "" });
                                                }}
                                                className="text-blue-500 hover:text-blue-700">Open File</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
}