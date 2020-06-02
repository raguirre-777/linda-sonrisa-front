import { combineReducers } from 'redux';

const sessionInicial = localStorage.getItem('session');
let sessionObj = undefined;
try {
    if (sessionInicial !== null) {
        sessionObj = JSON.parse(sessionInicial);
    }
} catch{ }

const INITIAL_STATE = {
    session: sessionObj,
};

const reducers = (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case 'SET_SESSION':
            return { ...state, session: action.payload };
        default:
            return state;
    }
};

export default combineReducers({
    reducers,
});
