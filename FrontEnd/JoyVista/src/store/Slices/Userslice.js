import { createSlice } from "@reduxjs/toolkit";

const Userslice = createSlice({
    name: "User",
    initialState: {},
    reducers: {
        loginUser: (store, action) => {
            return { ...store, ...action.payload };
        },
    },
});

export const Useraction = Userslice.actions;
export default Userslice.reducer;
