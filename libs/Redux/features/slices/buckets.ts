import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Bucket {
    region: string;
    name: string;
    bucketName: string;
    accessKey: string;
    secretKey: string;
}

export interface ListBucketState {
    buckets: Bucket[];
}

const initialState: ListBucketState = {
    buckets: [],
};

export const bucketSlice = createSlice({
    name: "bucket",
    initialState,
    reducers: {
        addBucket: (state, action: PayloadAction<Bucket>) => {
            state.buckets.push(action.payload);
        },
        removeBucket: (state, action: PayloadAction<string>) => {
            state.buckets = state.buckets.filter((bucket) => bucket.bucketName !== action.payload);
        },
    },
});

export const { addBucket, removeBucket } = bucketSlice.actions;
export default bucketSlice.reducer;