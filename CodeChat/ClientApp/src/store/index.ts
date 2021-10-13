import * as Users from '../store/Reducers/UsersReducer'
import * as Messages from '../store/Reducers/MessagesReducer'
import * as Channels from '../store/Reducers/ChannelsReducer'
import * as Entities from '../store/Reducers/EntitiesReducer'
import * as Session from '../store/Reducers/SessionsReducer'
// The top-level state object
export interface ApplicationState {
    entities: EntitiesState;
    session: Session.SessionState;
}

interface EntitiesState {
    users: Users.UsersState;
    messages: Messages.MessagesState;
    channels: Channels.ChannelsState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    entities: Entities.reducer,
    session: Session.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
