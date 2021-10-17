export const formatChannelName = (channelName: string) => {
    channelName = channelName.toLowerCase()
    if (channelName === 'c#') {
        return 'c'
    }
    return channelName
}