import { ApplicationState } from "..";
import { Message } from "../Reducers/MessagesReducer";
import { UsersState } from "../Reducers/UsersReducer";

export const selectUsers = (state: ApplicationState): UsersState | undefined => {
    return state.users;
}

export const selectMessages = (state: ApplicationState): Message[] => {

    if (state.messages) {
        const messages = Object.values(state.messages) as Message[]
        return messages
    }


    return []
}