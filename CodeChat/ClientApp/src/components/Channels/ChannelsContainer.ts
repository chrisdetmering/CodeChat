import { connect, ConnectedProps } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { ApplicationState } from '../../store'
import { selectChannels, selectChannelsError, selectIsChannelsLoading, selectMessageByIds, selectMessagesErrors } from '../../store/RawStateSelectors/EntitiesSelectors'
import * as MessagesStore from '../../store/Reducers/MessagesReducer'
import * as ChannelsStore from '../../store/Reducers/ChannelsReducer'
import Channels from './Channels'
import { selectUserByCurrentUserId } from '../../store/SharedDerivedStateSelectors/selectCurrentUser'


//CHANNEL PROP TYPES
const mapState = (state: ApplicationState) => (
    {
        channels: selectChannels(state),
        selectMessageByIds: (ids: string[]) => selectMessageByIds(state, ids),
        isLoading: selectIsChannelsLoading(state),
        currentUser: selectUserByCurrentUserId(state),
        error: selectChannelsError(state),
        errorMessages: selectMessagesErrors(state)
    }
)
const mapDispatch = {
    getChannels: ChannelsStore.getChannels,
    requestMessages: MessagesStore.requestMessages,
    postMessage: (message: MessagesStore.NewMessage) => MessagesStore.postMessage(message),
    receiveMessage: (message: MessagesStore.Message) => MessagesStore.receiveMessage(message),
    deleteMessage: (message: MessagesStore.Message) => MessagesStore.deleteMessage(message),
    editMessage: (message: MessagesStore.Message, onSuccess: () => void) => MessagesStore.editMessage(message, onSuccess),
    clearMessageErrors: MessagesStore.clearMessagesError
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>
export type ChannelsProps = PropsFromRedux & RouteComponentProps

export default connector(Channels)
