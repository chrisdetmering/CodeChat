import * as React from 'react'
import { Button } from 'reactstrap'
import { Message } from '../../store/Reducers/MessagesReducer'
import { User } from '../../store/Reducers/UsersReducer'
import { formatChannelName } from '../Utils/formatChannelName'
import './DisplayMessage.css'

interface DisplayMessageProps {
    msg: Message
    channelName: string
    currentUser: User | null
    deleteMessage: (message: Message) => void
    selectMessageToEdit: (message: Message) => void
}

interface DisplayMessageState {
    isDeleted: boolean
}


export default class DisplayMessage extends React.PureComponent<DisplayMessageProps> {
    state: DisplayMessageState = {
        isDeleted: false
    }

    public render() {
        const channelName = formatChannelName(this.props.channelName)
        return (
            <div
                className={`display-message__div--${channelName} talk-bubble tri-right left-top ${this.isCurrentUsersMessage() ? 'right' : ''}`}
                key={this.props.msg.id}>
                <h5 className={`display-message__h5--${channelName}`}>
                    <span
                        className={`display-message__span--${channelName}`}>
                        username {' '}
                    </span>
                    {this.props.msg.username}
                </h5>
                <p className="display-message__text" dangerouslySetInnerHTML={{ __html: this.props.msg.text }}></p>
                {this.renderEditButtons(channelName)}
            </div>

        )
    }

    private renderEditButtons(channelName: string) {
        if (this.props.currentUser && this.props.currentUser.username === this.props.msg.username) {
            return (<>
                <Button
                    color="link"
                    className={`display-message__button--${channelName}`}
                    onClick={this.selectMessageToEdit}>Edit</Button>

                <Button
                    color="link"
                    className={`display-message__button--${channelName}`}
                    onClick={this.deleteMessage}>Delete</Button> {' '}

            </>)
        }
    }


    private deleteMessage = () => {
        this.props.deleteMessage(this.props.msg)
    }

    private selectMessageToEdit = () => {
        this.props.selectMessageToEdit(this.props.msg)
    }

    private isCurrentUsersMessage = () => {
        if (this.props.currentUser) {
            return this.props.currentUser.username === this.props.msg.username
        }
        return false;
    }
}