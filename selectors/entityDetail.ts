import { RootState } from '../slices'

export const shouldChangeZoomAndCenterOnEntranceSelector = (state: RootState) => (state.entityDetail.shouldChangeZoomAndCenterOnEntrance)