import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk"
import reducer from "./Reducer";
const store = createStore(reducer, applyMiddleware(compose(thunk)));
export default store; 