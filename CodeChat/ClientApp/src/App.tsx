import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Counter from './components/Counter';
import FetchData from './components/FetchData';
import ChannelsContainer from './components/Channels/ChannelsContainer';


import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={ChannelsContainer} />
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
    </Layout>
);
