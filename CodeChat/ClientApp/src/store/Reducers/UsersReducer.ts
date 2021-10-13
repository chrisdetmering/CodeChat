import { CallHistoryMethodAction, push } from 'connected-react-router'
import { Action, Reducer } from 'redux'
import { AppThunkAction } from '../'
import { LogoutCurrentUserAction } from './SessionsReducer'



export interface UsersState {
    users: Users
    errors: string | null
}

export interface Users {
    [key: string]: User | null
}

export interface User {
    id: string
    username: string
}

export interface NewUser {
    username: string
    password: string
}

//ACTION TYPES
interface PostUserAction {
    type: 'POST_USER'
}

export interface ReceiveUserAction {
    type: 'RECEIVE_USER'
    user: User
}

interface PostUserErrorAction {
    type: 'POST_USER_ERROR'
    message: string
}

//ACTION UNION
type KnownAction = PostUserAction | ReceiveUserAction | CallHistoryMethodAction | LogoutCurrentUserAction | PostUserErrorAction


//ACTION CREATORS 
export const receiveUser = (user: User): ReceiveUserAction => ({ type: 'RECEIVE_USER', user: user })
const postUserError = (message: any): PostUserErrorAction => ({ type: 'POST_USER_ERROR', message: message })

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
            dispatch(receiveUser(user))
            dispatch(push('/channels'))
        } else {
            const error = await response.json()
            dispatch(postUserError(error.message))
        }

    } catch (error) {
        dispatch(postUserError(error))
    }
}

const initialState = {
    users: {},
    errors: null
};

export const reducer: Reducer<UsersState> = (state = initialState, incomingAction: Action): UsersState => {
    const action = incomingAction as KnownAction;

    switch (action.type) {
        case 'RECEIVE_USER':
            const updatedUsers = {
                ...state.users,
                [action.user.id]: action.user
            }
            return {
                ...state,
                users: updatedUsers
            }
        case 'LOGOUT_CURRENT_USER':
            const nonDeletedUsers = {
                ...state.users,
            }
            delete nonDeletedUsers[action.id];

            const newState = {
                ...state,
                users: nonDeletedUsers
            }
            return newState;
        case 'POST_USER_ERROR':
            return {
                ...state,
                errors: action.message
            }
    }

    return state
};
