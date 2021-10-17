import * as React from 'react'
import ContentEditable from 'react-contenteditable';
import { Button } from 'reactstrap';
import { Message } from '../../store/Reducers/MessagesReducer';
import { User } from '../../store/Reducers/UsersReducer';
import { formatChannelName } from '../Utils/formatChannelName';
import './EditMessage.css'

interface EditMessageProps {
    message: Message
    channelName: string
    text: string
    currentUser: User | null
    editMessageText: (e: any) => void
    editMessage: () => void
    cancelEdit: () => void
}

export default class EditMessage extends React.PureComponent<EditMessageProps> {

    public render() {
        const channelName = formatChannelName(this.props.channelName)
        return (<>
            <div
                key={this.props.message.id}
                className={`edit-message__div ${channelName} ${this.isCurrentUsersMessage() ? 'right' : ''}`}>
                <h5 className={`edit-message__h5 ${channelName}`}>
                    <span
                        className={`edit-message__span ${channelName}`}>
                        username {' '}
                    </span>
                    {this.props.message.username}</h5>
                <ContentEditable
                    onChange={this.props.editMessageText}
                    html={this.props.text}
                    className="edit-message__text"
                />
                <Button
                    outline
                    className={`edit-message__button ${channelName}`}
                    onClick={this.props.editMessage}>Save</Button>{'  '}
                <Button
                    outline
                    className={`edit-message__button ${channelName}`}
                    onClick={this.props.cancelEdit}>Cancel</Button>
            </div>

        </>)
    }

    private isCurrentUsersMessage = () => {
        if (this.props.currentUser) {
            return this.props.currentUser.username === this.props.message.username
        }
        return false;
    }

}