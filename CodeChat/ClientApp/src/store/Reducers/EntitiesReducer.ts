import { combineReducers } from "redux";
import * as UsersStore from "./UsersReducer";
import * as MessagesStore from "./MessagesReducer";
import * as ChannelsStore from "./ChannelsReducer";

export const reducer = combineReducers({
    users: UsersStore.reducer,
    messages: MessagesStore.reducer,
    channels: ChannelsStore.reducer
});
