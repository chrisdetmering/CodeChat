import { connect, ConnectedProps } from "react-redux";
import { ApplicationState } from "../../store";
import { selectUserByCurrentUserId } from "../../store/SharedDerivedStateSelectors/selectCurrentUser";
import { deleteSession } from "../../store/Reducers/SessionsReducer";
import NavMenu from "./NavMenu";


const mapState = (state: ApplicationState) => ({ currentUser: selectUserByCurrentUserId(state) })
const mapDispatch = {
    logout: () => deleteSession()
}


const connector = connect(mapState, mapDispatch)

export type NavProps = ConnectedProps<typeof connector>

export default connector(NavMenu)