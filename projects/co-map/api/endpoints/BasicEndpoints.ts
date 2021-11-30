// todo: should eliminate self_api because it causes troubles with the hosting domain
// todo: use SWR instead
export const BASICS_API_URL: string = process.env.NEXT_PUBLIC_BASICS_API
export const SELF_API_URL: string = process.env.NEXT_PUBLIC_SELF_API

export const BASICS_ENDPOINTS = {
    getAmbassadorCommunityParams: (): string =>
        `${SELF_API_URL}/co-map/ambassador_community`,
    postAmbassadorAssignment: (): string =>
        `${SELF_API_URL}/co-map/ambassador_application`,
    getAmbassadorCard: (): string => `${SELF_API_URL}/co-map/ambassador_card`,
    getCollaborators: (): string => `${SELF_API_URL}/co-map/collaborators`,
};