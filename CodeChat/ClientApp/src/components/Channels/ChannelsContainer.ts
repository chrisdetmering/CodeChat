import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../../store";
import { selectMessages } from "../../store/RawStateSelectors/EntitiesSelectors";
import * as MessagesStore from '../../store/Reducers/MessagesReducer'
import Channels from "./Channels";


//CHANNEL PROP TYPES
const mapState = (state: ApplicationState) => ({ messages: selectMessages(state) })
const mapDispatch = {
    requestMessages: MessagesStore.requestMessages,
    postMessage: (message: MessagesStore.NewMessage) => MessagesStore.postMessage(message),
    receiveMessage: (message: MessagesStore.Message) => MessagesStore.receiveMessage(message)
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>
export type ChannelProps = PropsFromRedux & RouteComponentProps

export default connector(Channels)
