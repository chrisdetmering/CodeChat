import { ApplicationState } from "..";
import { UsersState } from "../Reducers/UsersReducer";

export const selectUsers = (state: ApplicationState): UsersState | undefined => {
    return state.users;
}