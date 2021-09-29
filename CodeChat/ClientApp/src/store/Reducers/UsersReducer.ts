import { CallHistoryMethodAction, push } from 'connected-react-router';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from '../';
import { LogoutCurrentUserAction } from './SessionsReducer';



export interface UsersState {
    [key: string]: User | null
}

export interface User {
    id: string;
    username: string;
}

export interface NewUser {
    username: string;
    password: string;
}

//ACTION TYPES
interface PostUserAction {
    type: 'POST_USER';
}

export interface ReceiveUserAction {
    type: 'RECEIVE_USER';
    user: User;
}

//ACTION UNION
type KnownAction = PostUserAction | ReceiveUserAction | CallHistoryMethodAction | LogoutCurrentUserAction;


//ACTION CREATORS 
export const receiveUser = (user: User): ReceiveUserAction => ({ type: 'RECEIVE_USER', user: user })


//THUNKS
export const postUser = (newUser: NewUser): AppThunkAction<KnownAction> => async (dispatch) => {
    //TODO: dispatch loading
    try {
        const body = JSON.stringify(newUser)
        const config = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body
        }
        const response = await fetch('/api/users', config);

        if (response.ok) {
            const user = await response.json() as User
            dispatch(receiveUser(user));
            dispatch(push('/channels'))
        } else {
            console.log(await response.json());
        }

    } catch (error) {
        //TODO: dispatch error 
    }
}

const initialState = {};

export const reducer: Reducer<UsersState> = (state = initialState, incomingAction: Action): UsersState => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'RECEIVE_USER':
            return {
                ...state,
                [action.user.id]: action.user
            }
        case 'LOGOUT_CURRENT_USER':
            const newState = Object.assign({}, state);
            delete newState[action.id];
            return newState;
    }

    return state;
};
