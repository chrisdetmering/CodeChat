import * as React from 'react';
import * as signalR from '@microsoft/signalr';
import { ChannelProps } from "./ChannelsContainer";
import { Link } from 'react-router-dom';
import { Message } from '../../store/Reducers/MessagesReducer';
import { Col, Row, Nav, NavItem, TabPane, NavLink, TabContent, Card, CardTitle, CardText, Button } from 'reactstrap';




class Channels extends React.PureComponent<ChannelProps>{

    state = {
        hubConnection: null,
        messageText: '',
        activeTab: 0
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
                {/* Render channels */}
                {this.renderMessages()}
                {this.renderMessageInput()}
            </React.Fragment>
        );
    }

    //Need to pass in the channelId 
    private handleSendMessage = async (): Promise<void> => {
        this.props.postMessage({
            text: this.state.messageText,
            channelId: "1410da4f-0d9a-42f7-b05d-194791149eba"
        });
        this.setState({ messageText: "" })
    }

    private handleMessageChange = (e: any) => {
        const messageText = e.target.value;
        this.setState({ messageText });
    }


    private toggleTabs = (activeTab: number) => {
        console.log(activeTab)
        this.setState({ activeTab });
    }

    //renderChannels
    private renderMessages() {

        return (
            <div>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={`${this.state.activeTab === 0 ? 'active' : ''}`}
                            onClick={() => { this.toggleTabs(0); }}
                        >
                            Tab1
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={`${this.state.activeTab === 1 ? 'active' : ''}`}
                            onClick={() => { this.toggleTabs(1); }}
                        >
                            More Tabs
                        </NavLink>
                    </NavItem>
                </Nav>

                <TabContent activeTab={`${this.state.activeTab}`}>
                    <TabPane tabId="0">
                        <Row>
                            <Col sm="12">
                                <h4>Tab 1 Contents</h4>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="1">
                        <Row>
                            <Col sm="6">
                                <Card body>
                                    <CardTitle>Special Title Treatment</CardTitle>
                                    <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                                    <Button>Go somewhere</Button>
                                </Card>
                            </Col>
                            <Col sm="6">
                                <Card body>
                                    <CardTitle>Special Title Treatment</CardTitle>
                                    <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                                    <Button>Go somewhere</Button>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </div>



            // <ul>

            //     {this.props.messages.map((message: Message) => {
            //         return (
            //             <li key={message.id}>
            //                 <h5>{message.username}</h5>
            //                 <p>{message.text}</p>
            //             </li>
            //         );
            //     })}
            // </ul>
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