"use client";
import { RootState } from "@/libs/Redux/store";
import * as buckets from "@/libs/Redux/features/slices/buckets";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import BucketTab from "../BucketTab";

export default function HomeContainer() {
    const bucketsState = useSelector((state: RootState) => state.buckets.buckets);
    const dispatch = useDispatch();
    const [activeBucket1, setActiveBucket1] = useState<buckets.Bucket>();
    const [activeBucket1CurrentPath, setActiveBucket1CurrentPath] = useState<string>("");
    const [isAddBucket1ModalOpen, setIsAddBucket1ModalOpen] = useState(false);
    const [activeBucket2, setActiveBucket2] = useState<buckets.Bucket>();
    const [isAddBucket2ModalOpen, setIsAddBucket2ModalOpen] = useState(false);
    const [activeBucket2CurrentPath, setActiveBucket2CurrentPath] = useState<string>("");

    return (
        <div className="flex justify-center min-h-[calc(100vh-52px)] bg-slate-100">
            <div className="flex flex-row w-full h-full">
                <div className="w-1/2 h-max p-2 pr-1">
                    <div className="w-full">
                        {activeBucket1?.name ?
                            <BucketTab
                                bucket={activeBucket1}
                                changeBucket={setActiveBucket1}
                                openModal={setIsAddBucket1ModalOpen}
                                currentPath={activeBucket1CurrentPath}
                                setCurrentPath={setActiveBucket1CurrentPath}
                                targetBucket={activeBucket2}
                                targetBucketCurrentPath={activeBucket2CurrentPath}
                            />
                            :
                            <div className="flex justify-center items-center h-full">
                                {!isAddBucket1ModalOpen ?
                                    <button
                                        onClick={() => { setIsAddBucket1ModalOpen(true) }}
                                        className="text-lg font-bold w-full border bg-white">Select a Connector</button>
                                    :
                                    <div className="flex flex-col gap-2 w-full bg-slate-100">
                                        {bucketsState.map((bucket) => (
                                            <div 
                                                onClick={() => { 
                                                    setActiveBucket1(bucket)
                                                    setIsAddBucket1ModalOpen(false)
                                                }}
                                                key={bucket.name} 
                                                className="flex justify-between items-center p-2 border rounded-md bg-white">
                                                <div className="flex flex-col gap-1">
                                                    <h1 className="text-sm font-bold">{bucket.name}</h1>
                                                    <div className="flex flex-col gap-1">
                                                        <h1 className="text-xs">Bucket Name: {bucket.bucketName}</h1>
                                                        <h1 className="text-xs">Region: {bucket.region}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>

                <div className="w-1/2 h-max p-2 pl-1">
                    <div className="w-full">
                    {activeBucket2?.name ?
                            <BucketTab
                                bucket={activeBucket2}
                                changeBucket={setActiveBucket2}
                                openModal={setIsAddBucket2ModalOpen}
                                currentPath={activeBucket2CurrentPath}
                                setCurrentPath={setActiveBucket2CurrentPath}
                                targetBucket={activeBucket1}
                                targetBucketCurrentPath={activeBucket1CurrentPath}
                            />
                            :
                            <div className="flex justify-center items-center h-full">
                                {!isAddBucket2ModalOpen ?
                                    <button
                                        onClick={() => { setIsAddBucket2ModalOpen(true) }}
                                        className="text-lg font-bold w-full border bg-white">Select a Connector</button>
                                    :
                                    <div className="flex flex-col gap-2 w-full">
                                        {bucketsState.map((bucket) => (
                                            <div 
                                                onClick={() => { 
                                                    setActiveBucket2(bucket)
                                                    setIsAddBucket2ModalOpen(false)
                                                }}
                                                key={bucket.name} 
                                                className="flex justify-between items-center p-2 border rounded-md bg-white">
                                                <div className="flex flex-col gap-1">
                                                    <h1 className="text-sm font-bold">{bucket.name}</h1>
                                                    <div className="flex flex-col gap-1">
                                                        <h1 className="text-xs">Bucket Name: {bucket.bucketName}</h1>
                                                        <h1 className="text-xs">Region: {bucket.region}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}