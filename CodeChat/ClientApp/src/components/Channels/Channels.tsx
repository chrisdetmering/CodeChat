import * as React from 'react'
import * as signalR from '@microsoft/signalr'
import { ChannelsProps } from './ChannelsContainer'
import { Col, Row, Nav, NavItem, TabPane, NavLink, TabContent } from 'reactstrap'
import * as ChannelStore from '../../store/Reducers/ChannelsReducer'
import { Message } from '../../store/Reducers/MessagesReducer'
import EditMessage from "../Messages/EditMessage";
import './Channels.css'
import DisplayMessage from '../Messages/DisplayMessage'
import InputMessage from "../Messages/InputMessage";

interface ChannelsState {
    hubConnection: signalR.HubConnection | null
    messageText: string
    activeChannelId: string
    editMessage: Message

}

class Channels extends React.PureComponent<ChannelsProps>{

    state: ChannelsState = {
        hubConnection: null,
        messageText: '',
        activeChannelId: '334d3eb0-2fc8-11ec-adcc-4f831b687dbd',
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
                <h1>Rooms</h1>
                {this.renderChannels()}
            </>
        );
    }
    private renderChannels() {
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
                                    {this.renderChannelIcons(channel.name)}
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

    private renderChannelMessages(channel: ChannelStore.Channel) {
        return (<>
            <TabPane key={channel.id} tabId={`${channel.id}`} >
                <Row className={'channel__row'}>
                    <Col sm="12" className="channel__col">
                        {
                            this.props.selectMessageByIds(channel.messagesIds).map(
                                message => {
                                    if (this.isEditable(message)) {
                                        return (
                                            <EditMessage
                                                message={message}
                                                channelName={channel.name}
                                                currentUser={this.props.currentUser}
                                                editMessageText={this.editMessageText}
                                                text={this.state.editMessage.text}
                                                editMessage={this.editMessage}
                                                cancelEdit={this.cancelEdit} />
                                        )
                                    } else {
                                        return (
                                            <DisplayMessage
                                                msg={message}
                                                channelName={channel.name}
                                                currentUser={this.props.currentUser}
                                                deleteMessage={this.props.deleteMessage}
                                                selectMessageToEdit={this.selectMessageToEdit}>
                                            </DisplayMessage>

                                        )
                                    }


                                }
                            )
                        }

                    </Col>

                </Row>
                <InputMessage
                    handleMessageChange={this.handleMessageChange}
                    handleSendMessage={this.handleSendMessage}
                    messageText={this.state.messageText}
                    channelName={channel.name}
                />
            </TabPane>


        </>);
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

    private onEditSuccess = () => {
        this.setState({
            editMessage: { id: '', text: '', username: '', channelId: '' }
        })
    }

    private editMessage = () => {
        const msg = this.state.editMessage
        this.props.editMessage(msg, this.onEditSuccess)
    }

    private isEditable = (message: Message): boolean => {
        return this.state.editMessage.id === message.id
    }

    private renderChannelIcons(channelName: string) {
        if (channelName === 'Python') {
            return (
                <img src="https://img.icons8.com/color/25/000000/python--v2.png" />
            )
        }

        if (channelName === 'C#') {
            return (
                <img src="https://img.icons8.com/color/25/000000/c-sharp-logo.png" />
            )
        }


        return (
            <img src="https://img.icons8.com/color/25/000000/javascript--v1.png" />
        )

    }


}

export default Channels