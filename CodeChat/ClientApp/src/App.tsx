import * as React from 'react';
import { Redirect, Route } from 'react-router';
import Layout from './components/Layout';
import ChannelsContainer from './components/Channels/ChannelsContainer';
import SignUpContainer from "./components/SignUp/SignUpContainer";
import './custom.css'
import LoginContainer from './components/Login/LoginContainer';
import { connect, ConnectedProps } from 'react-redux';
import { selectUserByCurrentUserId } from './store/SharedDerivedStateSelectors/selectCurrentUser';
import { ApplicationState } from './store';
import * as UsersStore from './store/Reducers/UsersReducer';
import { push } from 'connected-react-router';
import { Spinner } from 'reactstrap';

interface AppState {
    isLoading: boolean
}


class App extends React.PureComponent<AppProps> {

    state: AppState = {
        isLoading: true
    }

    public componentDidMount() {
        this.getCurrentUser();
    }

    public render() {
        return (
            <Layout>
                {
                    this.state.isLoading ? <Spinner /> :
                        <>
                            <Route exact path='/' component={LoginContainer} />
                            <Route path='/signup' component={SignUpContainer} />
                            <Route
                                path='/channels'
                                render={(routeProps => {
                                    if (this.props.currentUser) {
                                        return <ChannelsContainer {...routeProps} />
                                    } else {
                                        return <Redirect to="/signup" />
                                    }
                                })} />
                        </>
                }
            </Layout>
        );
    }

    private getCurrentUser = async () => {
        this.setState({ isLoading: true });
        const response = await fetch('api/users/current')

        if (response.ok) {
            this.setState({ isLoading: false });
            const user = await response.json();
            this.props.receiveUser(user);
            this.props.push('/channels');
        } else {
            this.setState({ isLoading: false });
            this.props.push('/signup');
        }
    }

}

const mapState = (state: ApplicationState) => ({ currentUser: selectUserByCurrentUserId(state) })
const mapDispatch = {
    receiveUser: (user: UsersStore.User) => UsersStore.receiveUser(user),
    push: (url: string) => push(url)
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>
export type AppProps = PropsFromRedux


export default connector(App)
