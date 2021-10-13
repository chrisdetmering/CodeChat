import * as React from 'react'
import * as signalR from '@microsoft/signalr'
import { ChannelProps } from './ChannelsContainer'
import { Col, Row, Nav, NavItem, TabPane, NavLink, TabContent } from 'reactstrap'
import { Channel } from '../../store/Reducers/ChannelsReducer'
import { Message } from '../../store/Reducers/MessagesReducer'
import './Channels.css'

interface ChannelsState {
    hubConnection: signalR.HubConnection | null
    messageText: string
    activeChannelId: string
    editMessage: Message

}

class Channels extends React.PureComponent<ChannelProps>{

    state: ChannelsState = {
        hubConnection: null,
        messageText: '',
        activeChannelId: '',
        editMessage: { id: '', text: '', username: '', channelId: '' }
    }

    public async componentDidMount() {
        const hubConnection: signalR.HubConnection = new signalR.HubConnectionBuilder()
            .withUrl('/chat')
            .build()
        hubConnection.start()
        hubConnection.on("broadcastMessage", (message) => {
            this.props.receiveMessage(message)
        })

        this.setState({ hubConnection: hubConnection })
        this.getChannels()
        this.props.requestMessages()
    }

    public componentDidUpdate() {
        if (this.props.errorMessages !== null) {
            alert(this.props.errorMessages)
            this.props.clearMessageErrors()
        }
    }

    public componentWillUnmount() {
        if (this.state.hubConnection) {
            this.state.hubConnection.stop()
                .then(() => console.log("connection closed"))
        }
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
        this.props.getChannels()
    }
    private handleSendMessage = async (): Promise<void> => {
        this.props.postMessage({
            text: this.state.messageText,
            channelId: this.state.activeChannelId
        });
        this.setState({ messageText: "" })
    }

    private handleMessageChange = (e: any) => {
        const messageText = e.target.value
        this.setState({ messageText })
    }

    private toggleChannel = (activeChannelId: string) => {
        this.setState({ activeChannelId })
    }

    private selectMessageToEdit = (message: Message) => {
        this.setState({
            editMessage: Object.assign({}, message)
        })
    }

    private editMessageText = (e: any) => {
        const text = e.target.value
        this.setState({
            editMessage: {
                ...this.state.editMessage,
                text
            }
        })
    }

    private cancelEdit = () => {
        this.setState({
            editMessage: { id: '', text: '', username: '', channelId: '' }
        })
    }

    private editMessage = () => {
        const msg = this.state.editMessage
        console.log(msg)
        this.props.editMessage(msg)
    }

    private renderChannels() {
        console.log(this.props.error)
        if (this.props.error !== null) {
            return (<div>
                {this.props.error}
            </div>)
        }
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
                        return this.renderChannelMessages(channel)
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
                                    if (this.state.editMessage.id === message.id && !this.isMessageDeleted(message)) {
                                        return (
                                            <div key={message.id}>
                                                <div>{message.username}</div>
                                                <input
                                                    onChange={this.editMessageText}
                                                    value={this.state.editMessage.text} />
                                                <button onClick={this.editMessage}>Save</button>
                                                <button onClick={this.cancelEdit}>Cancel</button>

                                            </div>

                                        )
                                    } else {
                                        let currentUser = this.props.currentUser
                                        let displayEditButtons;
                                        if (currentUser && currentUser.username === message.username) {
                                            displayEditButtons = (<>
                                                <button onClick={() => this.props.deleteMessage(message)}>Delete</button>
                                                <button onClick={() => this.selectMessageToEdit(message)}>Edit</button>
                                            </>)
                                        }


                                        return (
                                            <div key={message.id}>
                                                <div>{message.username}</div>
                                                <p>{message.text}</p>
                                                {displayEditButtons}
                                            </div>
                                        )
                                    }


                                }
                            )
                        }

                    </Col>
                </Row>
                {this.renderMessageInput()}
            </TabPane>

        </>);
    }

    private isMessageDeleted = (message: Message): boolean => {
        return message.text === 'Message was deleted';
    }

    private renderMessageInput() {
        return (<>
            <input type="text" onChange={this.handleMessageChange} value={this.state.messageText} />
            <button onClick={this.handleSendMessage}>Send</button>
        </>);
    }
}

export default Channels