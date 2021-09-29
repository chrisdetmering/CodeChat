import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps } from "react-router";
import { ApplicationState } from "../../store";
import { selectErrors } from "../../store/RawStateSelectors/SessionSelectors";
import * as SessionStore from "../../store/Reducers/SessionsReducer";
import { NewUser } from "../../store/Reducers/UsersReducer";
import Login from "./Login";


//CHANNEL PROP TYPES
const mapState = (state: ApplicationState) => ({ errors: selectErrors(state) })
const mapDispatch = {
    postSession: (newUser: NewUser) => SessionStore.postSession(newUser),
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>
export type LoginProps = PropsFromRedux & RouteComponentProps

export default connector(Login)