import { UPDATE_ITEM_VALIDATION, RESET_ITEM_VALIDATION } from 'constants/actionTypes'
import initialState from 'store/initialState'
import Base from 'models/Base'

export default function validateItemsReducer(state = initialState.validations, action) {

    let newState
    let newErrors

    switch (action.type) {
        case UPDATE_ITEM_VALIDATION:
            newState = { ...state }
            newErrors = { ...newState[action.item], ...action.errors }
            newState[action.item] = newErrors

            return newState

        case RESET_ITEM_VALIDATION:
            newState = { ...state }
            newErrors = newState[action.item]
            if (action.key) {
                // TODO: Keep it like that or change canAdvance function
                delete newErrors[action.key]
            } else {
                newErrors = {}
            }

            newState[action.item] = newErrors

            return newState

        default:
            return state
    }
}
