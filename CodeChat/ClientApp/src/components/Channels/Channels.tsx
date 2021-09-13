import * as React from 'react';
import * as signalR from '@microsoft/signalr';
import { ChannelProps } from "./ChannelsContainer";
import { Link } from 'react-router-dom';
import { Message } from '../../store/Reducers/MessagesReducer';



class Channels extends React.PureComponent<ChannelProps>{

    state = {
        hubConnection: null,
        messageText: ''
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
        this.props.requestMessages()
    }


    public render() {
        return (
            <React.Fragment>
                <h1>ChatRoom</h1>
                {this.renderMessages()}
                {this.renderMessageInput()}
            </React.Fragment>
        );
    }

    private handleSendMessage = async (): Promise<void> => {
        this.props.postMessage({
            id: 14,
            username: 'Chris',
            text: this.state.messageText
        });
        this.setState({ messageText: "" })
    }

    private handleMessageChange = (e: any) => {
        const messageText = e.target.value;
        this.setState({ messageText });
    }

    private renderMessages() {

        return (
            <ul>

                {this.props.messages.map((message: Message) => {
                    return (
                        <li key={message.id}>
                            <h5>{message.username}</h5>
                            <p>{message.text}</p>
                        </li>
                    );
                })}
            </ul>
        );
    }

    private renderMessageInput() {
        return (<>
            <input type="text" onChange={this.handleMessageChange} value={this.state.messageText} />
            <button onClick={this.handleSendMessage}>Send</button>
        </>);
    }
}

export default Channels