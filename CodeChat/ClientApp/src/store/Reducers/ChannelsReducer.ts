import { Action, Reducer } from 'redux';
import { AppThunkAction } from '../';
import { ReceiveMessageAction } from "./MessagesReducer";


export interface ChannelsState {
    channels: Channels
    isLoading: boolean;
}

interface Channels {
    [key: string]: Channel;
}

export interface NewChannel {
    name: string;
}

export interface Channel {
    id: string;
    name: string;
    messagesIds: string[];
}

//ACTION TYPES
interface RequestChannelsAction {
    type: 'REQUEST_CHANNELS';
}

interface ReceiveChannelsAction {
    type: 'RECEIVE_CHANNELS';
    channels: Channels;
}

interface ReceiveChannelAction {
    type: 'RECEIVE_CHANNEL';
    channel: Channel;
}

interface IsLoading {
    type: 'IS_LOADING';
    isLoading: boolean
}


//ACTION UNION
type KnownAction = RequestChannelsAction | ReceiveChannelsAction | ReceiveMessageAction | ReceiveChannelAction | IsLoading;

//ACTION CREATORS 
export const receiveChannels = (channels: Channels) => ({ type: 'RECEIVE_CHANNELS', channels: channels })
export const receiveChannel = (channel: Channel) => ({ type: 'RECEIVE_CHANNEL', channel: channel })


//THUNKS
export const requestChannels = (): AppThunkAction<KnownAction> => async (dispatch) => {

    dispatch({ type: 'IS_LOADING', isLoading: true });
    dispatch({ type: 'REQUEST_CHANNELS' })
    try {
        const response = await fetch(`/api/channels`)
        const channels = await response.json()
        dispatch({ type: 'RECEIVE_CHANNELS', channels })
    } catch (error) {

    }
    dispatch({ type: 'IS_LOADING', isLoading: false });
}

const initialState: ChannelsState = {
    channels: {},
    isLoading: false,
};

export const reducer: Reducer<ChannelsState> = (state = initialState, incomingAction: Action): ChannelsState => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'RECEIVE_CHANNELS':
            return {
                ...state,
                channels: action.channels
            }
        case 'RECEIVE_MESSAGE':
            const channel = Object.assign({}, state.channels[action.message.channelId]);
            channel.messagesIds = [...channel.messagesIds, action.message.id];
            const channels = Object.assign({}, state.channels);
            channels[channel.id] = channel;
            return {
                ...state,
                channels
            }
        case 'IS_LOADING':
            return {
                ...state,
                isLoading: !state.isLoading
            }
    }

    return state;
};