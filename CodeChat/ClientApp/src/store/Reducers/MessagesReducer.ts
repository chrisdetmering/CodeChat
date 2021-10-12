import { Action, Reducer } from 'redux';
import { AppThunkAction } from '../';


export interface MessagesState {
    [key: string]: Message
}

export interface NewMessage {
    text: string;
    channelId: string;
}

export interface Message {
    id: string;
    username: string;
    channelId: string;
    text: string;
}

export interface ReceiveMessageAction {
    type: 'RECEIVE_MESSAGE';
    message: Message;
}


//ACTION TYPES
interface RequestMessagesAction {
    type: 'REQUEST_MESSAGES';
}

interface ReceiveMessagesAction {
    type: 'RECEIVE_MESSAGES';
    messages: MessagesState;
}


//ACTION UNION
type KnownAction = RequestMessagesAction | ReceiveMessagesAction | ReceiveMessageAction;


//ACTION CREATORS 
export const receiveMessage = (message: Message) => ({ type: 'RECEIVE_MESSAGE', message: message })


//THUNKS
export const requestMessages = (): AppThunkAction<KnownAction> => async (dispatch) => {
    dispatch({ type: 'REQUEST_MESSAGES' })
    try {
        const response = await fetch(`/api/messages`)

        const messages = await response.json()

        dispatch({ type: 'RECEIVE_MESSAGES', messages })
    } catch (error) {
        console.log(error)
    }
}

export const postMessage = (newMessage: NewMessage): AppThunkAction<KnownAction> => async () => {
    try {
        const body = JSON.stringify(newMessage)
        const config = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body
        }
        await fetch('/api/messages', config);
    } catch (error) {
        //TODO: dispatch error 
    }
}

const initialState: MessagesState = {};

export const reducer: Reducer<MessagesState> = (state = initialState, incomingAction: Action): MessagesState => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'RECEIVE_MESSAGES':
            return action.messages
        case 'RECEIVE_MESSAGE':
            return {
                ...state,
                [action.message.id]: action.message
            }
    }

    return state;
};