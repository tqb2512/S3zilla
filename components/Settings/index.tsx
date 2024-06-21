"use client";
import * as Buckets from "@/libs/Redux/features/slices/buckets";
import { RootState } from "@/libs/Redux/store";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function Settings() {
    const dispatch = useDispatch();
    const bucketsState = useSelector((state: RootState) => state.buckets.buckets);
    const [bucket, setBucket] = useState<Buckets.Bucket>({} as Buckets.Bucket);
    const [isAddBucketModalOpen, setIsAddBucketModalOpen] = useState(false);

    return (
        <div className="flex justify-center items-center h-max bg-slate-50">
            <div className="w-[60%] h-full rounded-md bg-white m-12 border">
                <div className="flex justify-between p-2 border-b">
                    <h1 className="text-lg font-bold">Settings</h1>
                </div>

                <div className="p-2">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <h1 className="text-sm font-bold">Connectors</h1>
                            <button onClick={() => { setIsAddBucketModalOpen(true) }} className="text-sm font-bold text-blue-500">Add Connector</button>
                            {
                                isAddBucketModalOpen && (
                                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                                        <div className="w-[50%] h-max bg-white p-4 rounded-md">
                                            <div className="flex flex-col gap-2">
                                                <input type="text" placeholder="Connector Name" className="w-full p-2 border rounded-md" onChange={(e) => { setBucket({ ...bucket, name: e.target.value }) }} />
                                                <input type="text" placeholder="Bucket Name" className="w-full p-2 border rounded-md" onChange={(e) => { setBucket({ ...bucket, bucketName: e.target.value }) }} />
                                                <input type="text" placeholder="Region" className="w-full p-2 border rounded-md" onChange={(e) => { setBucket({ ...bucket, region: e.target.value }) }} />
                                                <input type="text" placeholder="Access Key" className="w-full p-2 border rounded-md" onChange={(e) => { setBucket({ ...bucket, accessKey: e.target.value }) }} />
                                                <input type="text" placeholder="Secret Key" className="w-full p-2 border rounded-md" onChange={(e) => { setBucket({ ...bucket, secretKey: e.target.value }) }} />
                                                <button 
                                                    onClick = {() => {
                                                        if (!bucket.name || !bucket.bucketName || !bucket.region || !bucket.accessKey || !bucket.secretKey) {
                                                            alert("Please fill all the fields");
                                                            return;
                                                        }
                                                        if (bucketsState.find((b) => b.name === bucket.name)) {
                                                            alert("Connector Name already exists");
                                                            return;
                                                        }
                                                        dispatch(Buckets.addBucket(bucket));
                                                        setBucket({} as Buckets.Bucket);
                                                        setIsAddBucketModalOpen(false);
                                                    }}
                                                    className="w-full p-2 bg-blue-500 text-white rounded-md">Add Connector</button>
                                                <button onClick={() => { setIsAddBucketModalOpen(false) }} className="w-full p-2 bg-red-500 text-white rounded-md">Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="flex flex-col gap-2">
                            {bucketsState.map((bucket) => (
                                <div key={bucket.name} className="flex justify-between items-center p-2 border rounded-md">
                                    <div className="flex flex-col gap-1">
                                        <h1 className="text-sm font-bold">{bucket.name}</h1>
                                        <div className="flex flex-col gap-1">
                                            <h1 className="text-xs">Bucket Name: {bucket.bucketName}</h1>
                                            <h1 className="text-xs">Region: {bucket.region}</h1>
                                        </div>
                                    </div>
                                    <button onClick={() => { dispatch(Buckets.removeBucket(bucket.bucketName)) }} className="text-sm font-bold text-red-500">Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}