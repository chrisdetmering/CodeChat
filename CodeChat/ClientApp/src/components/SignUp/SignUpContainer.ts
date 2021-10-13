import { connect, ConnectedProps } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { ApplicationState } from '../../store'
import { selectUserErrors } from '../../store/RawStateSelectors/EntitiesSelectors'
import * as UsersStore from '../../store/Reducers/UsersReducer'
import { selectUserByCurrentUserId } from '../../store/SharedDerivedStateSelectors/selectCurrentUser'
import SignUp from './SignUp'


//CHANNEL PROP TYPES
const mapState = (state: ApplicationState) => (
    {
        currentUser: selectUserByCurrentUserId(state),
        errors: selectUserErrors(state)
    }
)
const mapDispatch = {
    postUser: (newUser: UsersStore.NewUser) => UsersStore.postUser(newUser),
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>
export type SignUpProps = PropsFromRedux & RouteComponentProps

export default connector(SignUp)