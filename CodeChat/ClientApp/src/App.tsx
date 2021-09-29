import * as React from 'react';
import { Redirect, Route } from 'react-router';
import Layout from './components/Layout';
import ChannelsContainer from './components/Channels/ChannelsContainer';
import SignUpContainer from "./components/SignUp/SignUpContainer";
import './custom.css'
import LoginContainer from './components/Login/LoginContainer';
import { connect } from 'react-redux';
import { selectUserByCurrentUserId } from './store/SharedDerivedStateSelectors/selectCurrentUser';
import { ApplicationState } from './store';

function App(props: any) {
    console.log(props.currentUser)
    return (
        <Layout>
            <Route exact path='/' component={LoginContainer} />
            <Route path='/signup' component={SignUpContainer} />
            <Route
                path='/channels'
                render={(routeProps => {
                    if (props.currentUser) {
                        return <ChannelsContainer {...routeProps} />
                    } else {
                        return <Redirect to="/signup" />
                    }
                })} />
        </Layout>
    );
}

const mapStateToProps = (state: ApplicationState) => ({ currentUser: selectUserByCurrentUserId(state) })


export default connect(mapStateToProps)(App)
