
import {combineReducers} from "redux";
import auth from "./auth";

const all_reducer = combineReducers({
    auth: auth
})

export default all_reducer