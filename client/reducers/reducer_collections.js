import { BIND_COLLECTION, BIND_COLLECTIONS } from "../actions";

export default function(state = {}, action) {
    switch (action.type) {
        case BIND_COLLECTION: {
            return { ...state, [action.payload.name]: action.payload.collection };
        }
        case BIND_COLLECTIONS: {
            return { ...action.payload };
        }
        default:
            return state;
    }
}
