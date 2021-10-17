import * as React from 'react'
import { formatChannelName } from '../Utils/formatChannelName';
import './InputMessage.css'

interface InputMessageProps {
    handleMessageChange: (e: any) => void
    handleSendMessage: () => void
    messageText: string
    channelName: string
}

export default class InputMessage extends React.PureComponent<InputMessageProps> {

    public render() {

        const channelName = formatChannelName(this.props.channelName)
        return (<div className="input-message__div">
            <textarea
                className={`input-message__textarea ${channelName}`}
                onChange={this.props.handleMessageChange}
                value={this.props.messageText} />

            <button
                className={`button ${!this.isMessageTextEmpty() ? channelName : ''}`}
                disabled={this.isMessageTextEmpty()}
                onClick={this.props.handleSendMessage}
            >

                <img src="https://img.icons8.com/ios/24/000000/sent.png" />
            </button>



        </div>);
    }

    private isMessageTextEmpty = () => {
        return this.props.messageText === ''
    }


}