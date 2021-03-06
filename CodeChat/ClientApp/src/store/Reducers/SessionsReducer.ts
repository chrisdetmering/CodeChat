import { CallHistoryMethodAction, push } from 'connected-react-router'
import { Action, Reducer } from 'redux'
import { AppThunkAction } from '..'
import { NewUser, receiveUser, ReceiveUserAction } from './UsersReducer'
//SESSION TYPES
export interface SessionState {
    currentUserId: string | null
    errors: string | null
}

interface PostSessionAction {
    type: 'POST_SESSION'
}

interface PostSessionErrorAction {
    type: 'POST_SESSION_ERROR'
    message: string
}

//SHARED TYPES
export interface LogoutCurrentUserAction {
    type: 'LOGOUT_CURRENT_USER'
    id: string
}

type KnownAction = PostSessionAction | ReceiveUserAction | CallHistoryMethodAction | PostSessionErrorAction | LogoutCurrentUserAction


//ACTION CREATORS
const postSessionError = (message: any): PostSessionErrorAction => ({ type: 'POST_SESSION_ERROR', message: message })
const logoutCurrentUser = (id: string): LogoutCurrentUserAction => ({ type: 'LOGOUT_CURRENT_USER', id: id })

//THUNKS
export const deleteSession = (): AppThunkAction<KnownAction> => async (dispatch) => {
    try {
        const config = {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
        }
        const response = await fetch('/api/session', config)

        if (response.ok) {
            const currentUser = await response.json()
            if (currentUser.isLoggedOut) {
                dispatch(logoutCurrentUser(currentUser.id))
                dispatch(push('/'))
            }
        } else {
            const error = await response.json()
            dispatch(postSessionError(error.message))

        }
    } catch (error) {
        dispatch(postSessionError(error))
    }
}

export const postSession = (newUser: NewUser): AppThunkAction<KnownAction> => async (dispatch) => {
    try {
        const body = JSON.stringify(newUser)
        const config = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body
        }
        const response = await fetch('/api/session', config)
        if (response.ok) {
            const user = await response.json()
            dispatch(receiveUser(user))
            dispatch(push('/channels'))
        } else {
            const error = await response.json()
            dispatch(postSessionError(error.message))
        }

    } catch (error) {
        dispatch(postSessionError(error))
    }
}


const initialState = {
    currentUserId: null,
    errors: null
};

//REDUCER
export const reducer: Reducer<SessionState> = (state = initialState, incomingAction: Action): SessionState => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'RECEIVE_USER':
            return {
                ...state,
                currentUserId: action.user.id
            }
        case 'LOGOUT_CURRENT_USER':
            return {
                ...state,
                currentUserId: null
            }
        case 'POST_SESSION_ERROR':
            return {
                ...state,
                errors: action.message
            }
        default:
            return state
    }
};