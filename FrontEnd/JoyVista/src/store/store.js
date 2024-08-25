import { configureStore } from "@reduxjs/toolkit";
import Userslice from "./Slices/userSlice";

const Store = configureStore({
    reducer: {
        user: Userslice
    },
});

export default Store;
