import { ApplicationState } from '..'
import { Channel } from '../Reducers/ChannelsReducer'
import { Message } from '../Reducers/MessagesReducer'
import { UsersState } from '../Reducers/UsersReducer'

//USER SELECTERS 
export const selectUsers = (state: ApplicationState): UsersState | undefined => {
    return state.entities.users
}

export const selectUserErrors = (state: ApplicationState): string | null => {
    return state.entities.users.errors
}

//MESSAGES SELECTORS
export const selectMessages = (state: ApplicationState): Message[] => {

    if (state.entities.messages) {
        const messages = Object.values(state.entities.messages) as Message[]
        return messages
    }


    return []
}

export const selectMessageByIds = (state: ApplicationState, ids: string[]): Message[] => {

    if (Object.keys(state.entities.messages.messages).length > 0) {
        const messages = ids.map(id => {
            return state.entities.messages.messages[id]
        });

        return messages
    }
    return []
}

export const selectMessagesErrors = (state: ApplicationState): string | null => {
    return state.entities.messages.error
}

//CHANNELS SELECTORS 
export const selectChannels = (state: ApplicationState): Channel[] => {

    if (state.entities.channels) {
        const channels = Object.values(state.entities.channels.channels).filter(value => value != null) as Channel[]
        return channels
    }


    return []
}

export const selectChannelsError = (state: ApplicationState): string | null => {
    return state.entities.channels.error
}

export const selectIsChannelsLoading = (state: ApplicationState): boolean => {
    return state.entities.channels.isLoading
}