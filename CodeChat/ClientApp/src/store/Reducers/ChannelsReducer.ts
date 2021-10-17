import { Action, Reducer } from 'redux'
import { AppThunkAction } from '../'
import { ReceiveMessageAction } from './MessagesReducer'
import { DeleteMessageSuccessAction } from "./MessagesReducer";


export interface ChannelsState {
    channels: Channels
    isLoading: boolean
    error: string | null
}

interface Channels {
    [key: string]: Channel
}

export interface NewChannel {
    name: string
}

export interface Channel {
    id: string
    name: string
    messagesIds: string[]
}

//ACTION TYPES
interface RequestChannelsAction {
    type: 'REQUEST_CHANNELS'
}

interface ReceiveChannelsAction {
    type: 'RECEIVE_CHANNELS'
    channels: Channels
}

interface ReceiveChannelAction {
    type: 'RECEIVE_CHANNEL'
    channel: Channel
}

interface GetChannelsErrorAction {
    type: 'GET_CHANNELS_ERROR'
    message: string
}

interface IsChannelsLoadingAction {
    type: 'IS_CHANNELS_LOADING'
    isLoading: boolean
}


//ACTION UNION
type KnownAction = RequestChannelsAction | ReceiveChannelsAction | ReceiveMessageAction | ReceiveChannelAction | IsChannelsLoadingAction | GetChannelsErrorAction | DeleteMessageSuccessAction

//ACTION CREATORS 
export const receiveChannels = (channels: Channels): ReceiveChannelsAction => ({ type: 'RECEIVE_CHANNELS', channels: channels })
const isChannelsLoading = (isLoading: boolean): IsChannelsLoadingAction => ({ type: 'IS_CHANNELS_LOADING', isLoading: isLoading })
const getChannelsError = (message: string): GetChannelsErrorAction => ({ type: 'GET_CHANNELS_ERROR', message: message })
//THUNKS
export const getChannels = (): AppThunkAction<KnownAction> => async (dispatch) => {

    dispatch(isChannelsLoading(true))
    try {
        const response = await fetch(`/api/channels`)
        const channels = await response.json()
        dispatch(receiveChannels(channels))

    } catch (error) {
        dispatch(getChannelsError('There was a problem with getting the channels :)'))
        console.error(error)
    }
    dispatch(isChannelsLoading(false))
}

const initialState: ChannelsState = {
    channels: {},
    isLoading: false,
    error: null
};

export const reducer: Reducer<ChannelsState> = (state = initialState, incomingAction: Action): ChannelsState => {
    const action = incomingAction as KnownAction
    switch (action.type) {
        case 'RECEIVE_CHANNELS':
            return {
                ...state,
                channels: action.channels
            }
        case 'RECEIVE_MESSAGE':
            const channel = Object.assign({}, state.channels[action.message.channelId])
            channel.messagesIds = [...channel.messagesIds, action.message.id]
            const channels = Object.assign({}, state.channels)
            channels[channel.id] = channel
            return {
                ...state,
                channels
            }
        case 'DELETE_MESSAGE_SUCCESS':
            const newChannel = Object.assign({}, state.channels[action.message.channelId])
            newChannel.messagesIds = newChannel.messagesIds.filter(id => id !== action.message.id)
            const newChannels = Object.assign({}, state.channels)
            newChannels[newChannel.id] = newChannel

            return {
                ...state,
                channels: newChannels
            }
        case 'IS_CHANNELS_LOADING':
            return {
                ...state,
                isLoading: !state.isLoading
            }
        case 'GET_CHANNELS_ERROR':
            return {
                ...state,
                error: action.message
            }
    }

    return state
};