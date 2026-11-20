
const auth = (state = {},action) => {
    switch(action.type){
        case "UPDATE":
            return {...state};
            break;
        default:
            return state;
    }
}

export default auth;