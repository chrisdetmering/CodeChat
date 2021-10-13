import { Action, Reducer } from 'redux'
import { AppThunkAction } from '../'


export interface MessagesState {
    messages: Messages
    error: string | null
}

interface Messages {
    [key: string]: Message
}

export interface NewMessage {
    text: string
    channelId: string
}

export interface Message {
    id: string
    username: string
    channelId: string
    text: string
}

export interface ReceiveMessageAction {
    type: 'RECEIVE_MESSAGE'
    message: Message
}


//ACTION TYPES
interface RequestMessagesAction {
    type: 'REQUEST_MESSAGES'
}

interface ReceiveMessagesAction {
    type: 'RECEIVE_MESSAGES'
    messages: Messages
}

interface DeleteMessageSuccessAction {
    type: 'DELETE_MESSAGE_SUCCESS'
    message: Message
}

interface EditMessageSuccessAction {
    type: 'EDIT_MESSAGE_SUCCESS'
    message: Message
}

interface MessagesError {
    type: 'MESSAGES_ERROR'
    message: string
}

interface ClearMessagesError {
    type: 'CLEAR_MESSAGES_ERROR'
}

//ACTION UNION
type KnownAction = RequestMessagesAction | ReceiveMessagesAction | ReceiveMessageAction | DeleteMessageSuccessAction | MessagesError | ClearMessagesError | EditMessageSuccessAction


//ACTION CREATORS 
export const receiveMessage = (message: Message): ReceiveMessageAction => ({ type: 'RECEIVE_MESSAGE', message: message })
export const deleteMessageSuccess = (message: Message): DeleteMessageSuccessAction => ({ type: 'DELETE_MESSAGE_SUCCESS', message: message })
export const clearMessagesError = (): ClearMessagesError => ({ type: 'CLEAR_MESSAGES_ERROR' })

const editMessageSuccess = (message: Message): EditMessageSuccessAction => ({ type: 'EDIT_MESSAGE_SUCCESS', message: message })
const messageError = (message: string): MessagesError => ({ type: 'MESSAGES_ERROR', message: message })


//THUNKS
export const requestMessages = (): AppThunkAction<KnownAction> => async dispatch => {
    try {

        const response = await fetch(`/api/messages`)
        const messages = await response.json()
        dispatch({ type: 'RECEIVE_MESSAGES', messages })
    } catch (error) {
        dispatch(messageError('there was a problem getting the messages'))
        console.error(error)
    }
}

export const postMessage = (newMessage: NewMessage): AppThunkAction<KnownAction> => async dispatch => {
    try {
        const body = JSON.stringify(newMessage)
        const config = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body
        }
        await fetch('/api/messages', config);
    } catch (error) {
        dispatch(messageError('there was a problem making a new message'))
        console.error(error)
    }
}

export const deleteMessage = (message: Message): AppThunkAction<KnownAction> => async (dispatch) => {
    try {
        const config = {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
        }
        const response = await fetch(`/api/messages/${message.id}`, config);
        if (response.ok) {
            dispatch(deleteMessageSuccess(message));
        }
    } catch (error) {
        dispatch(messageError('there was a problem deleting a message'))
        console.error(error)
    }
}

export const editMessage = (msg: Message, onSuccess: () => void): AppThunkAction<KnownAction> => async (dispatch) => {
    try {
        const body = JSON.stringify(msg)
        const config = {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body
        }
        const response = await fetch(`/api/messages/${msg.id}`, config)
        if (response.ok) {
            const message = await response.json()
            dispatch(editMessageSuccess(message))
            onSuccess()
        }
    } catch (error) {
        dispatch(messageError('there was a problem with editing a message'))
        console.log(error)
    }

}

const initialState: MessagesState = {
    messages: {},
    error: null
};

export const reducer: Reducer<MessagesState> = (state = initialState, incomingAction: Action): MessagesState => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'RECEIVE_MESSAGES':
            return {
                ...state,
                messages: action.messages
            }
        case 'RECEIVE_MESSAGE':
            const oldState = Object.assign({}, state)
            const newMessages = {
                ...oldState.messages,
                [action.message.id]: action.message
            }
            return {
                ...state,
                messages: newMessages
            }
        case 'EDIT_MESSAGE_SUCCESS':
            const oldEditState = Object.assign({}, state)
            const newEditMessages = {
                ...oldEditState.messages,
                [action.message.id]: action.message
            }
            return {
                ...state,
                messages: newEditMessages
            }

        case 'DELETE_MESSAGE_SUCCESS':
            const oldDeleteState = Object.assign({}, state)
            action.message.text = 'Message was deleted'

            const newDeleteMessages = {
                ...oldDeleteState.messages,
                [action.message.id]: action.message
            }
            return {
                ...state,
                messages: newDeleteMessages
            }
        case 'MESSAGES_ERROR':
            return {
                ...state,
                error: action.message
            }
        case 'CLEAR_MESSAGES_ERROR':
            return {
                ...state,
                error: null
            }
    }

    return state
};