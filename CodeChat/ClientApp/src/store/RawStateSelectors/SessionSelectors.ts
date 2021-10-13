import { ApplicationState } from '../index'

export const selectCurrentUserId = (state: ApplicationState): string | null => {
    return state.session.currentUserId
}

export const selectErrors = (state: ApplicationState): string | null => {
    return state.session.errors
}