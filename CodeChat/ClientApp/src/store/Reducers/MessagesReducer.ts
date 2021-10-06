import { Action, Reducer } from 'redux';
import { AppThunkAction } from '../';


export interface MessagesState {
    [key: string]: Message | null
}

export interface NewMessage {
    text: string; 
    channelId: string; 
}

export interface Message {
    id: number;
    username: string;
    text: string;
}

//ACTION TYPES
interface RequestMessagesAction {
    type: 'REQUEST_MESSAGES';
}

interface ReceiveMessagesAction {
    type: 'RECEIVE_MESSAGES';
    messages: MessagesState;
}

interface PostMessageAction {
    type: 'POST_MESSAGE';
}

interface ReceiveMessageAction {
    type: 'RECEIVE_MESSAGE';
    message: Message;
}

//ACTION UNION
type KnownAction = RequestMessagesAction | ReceiveMessagesAction | PostMessageAction | ReceiveMessageAction;


//ACTION CREATORS 
export const receiveMessage = (message: Message) => ({ type: 'RECEIVE_MESSAGE', message: message })


//THUNKS
export const requestMessages = (): AppThunkAction<KnownAction> => async (dispatch) => {
    // Only load data if it's something we don't already have (and are not already loading)
    //TODO: dispatch loading
    dispatch({ type: 'REQUEST_MESSAGES' })
    try {
        const response = await fetch(`/api/messages`)
        const messages = await response.json()
        console.log(messages)
        dispatch({ type: 'RECEIVE_MESSAGES', messages })
    } catch (error) {
        //TODO: dispatch error
    }
}

export const postMessage = (newMessage: NewMessage): AppThunkAction<KnownAction> => async () => {
    //TODO: dispatch loading
    // dispatch({ type: 'POST_MESSAGE' })
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

    return initialState;
};