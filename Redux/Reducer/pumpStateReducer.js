const initialState = {
    pumpStatus: "",
    isPumpOff:false
}
const pumpStateReducer = (state = initialState, action) => {
    switch (action.type) {
        case "STATECHANGE":
            return { pumpStatus: action.payload.message, isPumpOff:action.payload.condition};
        default:
            return state
    }
}
export default pumpStateReducer