export declare class WebIg {
    credentials: any;
    request: any;
    _sharedData: any;
    constructor({ username, password, cookieStore }?: any, { language, proxy, requestOptions }?: any);
    login({ username, password }?: any, { _sharedData }?: {
        _sharedData?: boolean;
    }): Promise<any>;
    _getSharedData(url?: string): Promise<any>;
    _getGis(path: any): Promise<any>;
    logout(): Promise<any>;
    _getHomeData({ queryHash, variables }: {
        queryHash: any;
        variables: any;
    }): Promise<any>;
    getHome(mediaItemCursor: any): Promise<any>;
    getUserByUsername({ username }: {
        username: any;
    }): Promise<any>;
    getStoryReelFeed({ onlyStories }?: {
        onlyStories?: boolean;
    }): Promise<any>;
    getStoryReels({ reelIds, tagNames, locationIds, precomposedOverlay }?: {
        reelIds?: any[];
        tagNames?: any[];
        locationIds?: any[];
        precomposedOverlay?: boolean;
    }): Promise<any>;
    getUserIdPhotos({ id, first, after }?: any): Promise<any>;
    getPhotosByHashtag({ hashtag, first, after }?: any): Promise<any>;
    getPhotosByUsername({ username, first, after }: {
        username: any;
        first: any;
        after: any;
    }): Promise<any>;
    getStoryItemsByUsername({ username }: {
        username: any;
    }): Promise<any>;
    getStoryItemsByHashtag({ hashtag }: {
        hashtag: any;
    }): Promise<any>;
    getStoryItemsByLocation({ locationId }: {
        locationId: any;
    }): Promise<any>;
    getStoryItemsByReel({ reelId }: {
        reelId: any;
    }): Promise<any>;
    markStoryItemAsSeen({ reelMediaId, reelMediaOwnerId, reelId, reelMediaTakenAt, viewSeenAt }: {
        reelMediaId: any;
        reelMediaOwnerId: any;
        reelId: any;
        reelMediaTakenAt: any;
        viewSeenAt: any;
    }): Promise<any>;
    _getFollowData({ fieldName, queryHash, variables }: {
        fieldName: any;
        queryHash: any;
        variables: any;
    }): Promise<any>;
    getFollowers({ userId, first, after }: {
        userId: any;
        first?: number;
        after: any;
    }): Promise<any>;
    getFollowings({ userId, first, after }: {
        userId: any;
        first?: number;
        after: any;
    }): Promise<any>;
    getChainsData({ userId }: {
        userId: any;
    }): Promise<any>;
    getActivity(): Promise<any>;
    getProfile(): Promise<any>;
    updateProfile({ name, email, username, phoneNumber, gender, biography, website, similarAccountSuggestions }: {
        name?: string;
        email?: string;
        username: any;
        phoneNumber?: string;
        gender: any;
        biography?: string;
        website?: string;
        similarAccountSuggestions?: boolean;
    }): Promise<any>;
    changeProfilePhoto({ photo }: {
        photo: any;
    }): Promise<any>;
    deleteMedia({ mediaId }: {
        mediaId: any;
    }): Promise<any>;
    _uploadPhoto({ photo }: {
        photo: any;
    }): Promise<any>;
    uploadPhoto({ photo, caption, post }: {
        photo: any;
        caption?: string;
        post?: string;
    }): Promise<any>;
    getMediaFeedByLocation({ locationId }: {
        locationId: any;
    }): Promise<any>;
    getMediaFeedByHashtag({ hashtag }: {
        hashtag: any;
    }): Promise<any>;
    locationSearch({ query, latitude, longitude, distance }: {
        query: any;
        latitude: any;
        longitude: any;
        distance?: number;
    }): Promise<any>;
    getMediaByShortcode({ shortcode }: {
        shortcode: any;
    }): Promise<any>;
    getMediaComments({ shortcode, first, after }: {
        shortcode: any;
        first?: number;
        after?: string;
    }): Promise<any>;
    getMediaLikes({ shortcode, first, after }: {
        shortcode: any;
        first?: number;
        after?: string;
    }): Promise<any>;
    addComment({ mediaId, text, replyToCommentId }: {
        mediaId: any;
        text: any;
        replyToCommentId: any;
    }): Promise<any>;
    deleteComment({ mediaId, commentId }: {
        mediaId: any;
        commentId: any;
    }): Promise<any>;
    getChallenge({ challengeUrl }: {
        challengeUrl: any;
    }): Promise<any>;
    _navigateChallenge({ challengeUrl, endpoint, form }: any): Promise<any>;
    updateChallenge({ challengeUrl, choice, securityCode }: any): Promise<any>;
    resetChallenge({ challengeUrl }: {
        challengeUrl: any;
    }): Promise<any>;
    replayChallenge({ challengeUrl }: {
        challengeUrl: any;
    }): Promise<any>;
    approve({ userId }: {
        userId: any;
    }): Promise<any>;
    ignore({ userId }: {
        userId: any;
    }): Promise<any>;
    follow({ userId }: {
        userId: any;
    }): Promise<any>;
    unfollow({ userId }: {
        userId: any;
    }): Promise<any>;
    block({ userId }: {
        userId: any;
    }): Promise<any>;
    unblock({ userId }: {
        userId: any;
    }): Promise<any>;
    like({ mediaId }: {
        mediaId: any;
    }): Promise<any>;
    unlike({ mediaId }: {
        mediaId: any;
    }): Promise<any>;
    save({ mediaId }: {
        mediaId: any;
    }): Promise<any>;
    unsave({ mediaId }: {
        mediaId: any;
    }): Promise<any>;
    search({ query, context }: {
        query: any;
        context?: string;
    }): Promise<any>;
    _getPosts({ userId, perPage, nextPageToken }: {
        userId: any;
        perPage?: number;
        nextPageToken: any;
    }): Promise<any>;
    getPrivateProfilesFollowRequests(cursor: any): Promise<any>;
}
