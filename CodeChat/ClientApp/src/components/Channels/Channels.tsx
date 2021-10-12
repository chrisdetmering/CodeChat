import * as React from 'react';
import * as signalR from '@microsoft/signalr';
import { ChannelProps } from "./ChannelsContainer";
import { Col, Row, Nav, NavItem, TabPane, NavLink, TabContent, Card, CardTitle, CardText, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Channel } from '../../store/Reducers/ChannelsReducer';


class Channels extends React.PureComponent<ChannelProps>{

    state = {
        hubConnection: null,
        messageText: '',
        activeChannelId: '',
    }

    public async componentDidMount() {
        const hubConnection: signalR.HubConnection = new signalR.HubConnectionBuilder()
            .withUrl('/chat')
            .build();
        hubConnection.start()
        hubConnection.on("broadcastMessage", (message) => {
            this.props.receiveMessage(message)
        })
        this.setState({ hubConnection });
        this.getChannels();
        this.props.requestMessages();
    }

    public render() {
        if (this.props.isLoading) {
            return <div>Loading...</div>
        }
        return (
            <>
                <h1>Code Chat Rooms</h1>
                {this.renderChannels()}
            </>
        );
    }
    private getChannels() {
        this.props.requestChannels();
    }
    private handleSendMessage = async (): Promise<void> => {
        this.props.postMessage({
            text: this.state.messageText,
            channelId: this.state.activeChannelId
        });
        this.setState({ messageText: "" })
    }

    private handleMessageChange = (e: any) => {
        const messageText = e.target.value;
        this.setState({ messageText });
    }

    private toggleChannel = (activeChannelId: string) => {
        this.setState({ activeChannelId });
    }

    private renderChannels() {
        return (
            <div>
                <Nav tabs>
                    {this.props.channels.map((channel) => {
                        return (
                            <NavItem key={channel.id}>
                                <NavLink
                                    className={`${this.state.activeChannelId === channel.id ? 'active' : ''}`}
                                    onClick={() => { this.toggleChannel(channel.id); }}
                                >
                                    {channel.name}
                                </NavLink>
                            </NavItem>
                        )

                    })}
                </Nav>

                <TabContent activeTab={`${this.state.activeChannelId}`}>
                    {this.props.channels.map((channel) => {
                        return this.renderChannelMessages(channel);
                    })}
                </TabContent>
            </div>
        );
    }

    private renderChannelMessages(channel: Channel) {
        return (<>
            <TabPane key={channel.id} tabId={`${channel.id}`}>
                <Row>
                    <Col sm="12">
                        {
                            this.props.selectMessageByIds(channel.messagesIds).map(
                                message => {
                                    return (
                                        <div key={message.id}>
                                            <div>{message.username}</div>
                                            <p>{message.text}</p>
                                        </div>
                                    )
                                }
                            )
                        }

                    </Col>
                </Row>
                {this.renderMessageInput()}
            </TabPane>

        </>);
    }

    private renderMessageInput() {
        return (<>
            <input type="text" onChange={this.handleMessageChange} value={this.state.messageText} />
            <button onClick={this.handleSendMessage}>Send</button>
        </>);
    }
}

export default Channels