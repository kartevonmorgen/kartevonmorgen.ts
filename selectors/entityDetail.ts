import { RootState } from '../slices'

export const shouldChangeZoomOnEntranceSelector = (state: RootState) => (state.entityDetail.shouldChangeZoomOnEntrance)