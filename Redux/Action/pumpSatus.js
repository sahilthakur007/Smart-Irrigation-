export const updatePumpCondition = (msg,condition) => (dispatch) => {
        dispatch({
            type: "STATECHANGE",
            payload: {
                message: msg,
                condition:condition
            }
        })
}