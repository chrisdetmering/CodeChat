import { ApplicationState } from "..";
import { selectUsers } from "../RawStateSelectors/EntitiesSelectors";
import { selectCurrentUserId } from "../RawStateSelectors/SessionSelectors";
import { User } from "../Reducers/UsersReducer";

export const selectUserByCurrentUserId = (state: ApplicationState): User | null => {
    const currentUserId = selectCurrentUserId(state);
    const users = selectUsers(state);

    if (currentUserId && users) {
        return users[currentUserId];
    }

    return null
}