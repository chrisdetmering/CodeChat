import { Action, Reducer } from 'redux';
import { AppThunkAction } from '../';


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
    messages: Message[];
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
export const requestMessages = (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
    // Only load data if it's something we don't already have (and are not already loading)
    //TODO: dispatch loading
    dispatch({ type: 'REQUEST_MESSAGES' })
    try {
        const response = await fetch(`/api/messages`)
        const messages = await response.json() as Message[]
        dispatch({ type: 'RECEIVE_MESSAGES', messages: [] })
    } catch (error) {
        //TODO: dispatch error
    }
}

export const postMessage = (newMessage: Message): AppThunkAction<KnownAction> => async (dispatch, getState) => {
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

const initialState: Message[] = [];

export const reducer: Reducer<Message[]> = (state: Message[] = initialState, incomingAction: Action): Message[] => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'RECEIVE_MESSAGES':
            return action.messages
        case 'RECEIVE_MESSAGE':
            return [...state, action.message]
    }

    return initialState;
};