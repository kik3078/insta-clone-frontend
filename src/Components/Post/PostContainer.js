import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import useInput from "../../Hooks/useInput";
import PostPresenter from "./PostPresenter";
import { useMutation, useQuery } from "react-apollo-hooks";
import { TOGGLE_LIKE, ADD_COMMENT } from "./PostQueries";
import { ME } from "../SharedQueries";
import { toast } from "react-toastify";

const PostContainer = ({ 
    id,
    user,
    files,
    likeCount,
    isLiked,
    comments,
    createdAt,
    caption,
    location
}) => {
    const [isLikedS, setIsLiked] = useState(isLiked);
    const [likeCountS, setLikeCount] = useState(likeCount);
    const [currentItem, setCurrentItem] = useState(0);
    const [selfComments, setSelfComments] = useState([]);
    const comment = useInput("");
    const { data: meQuery } = useQuery(ME); // data 대신 meQuery를 넣음
    const [toggleLikeMutation] = useMutation(TOGGLE_LIKE, {
        variables: { postId: id }
    });
    const [addCommentMutation] = useMutation(ADD_COMMENT, {
        variables: { postId: id, text: comment.value }
    });
    const slide = useCallback(() => {
        const totalFiles = files.length;
        if (currentItem === totalFiles - 1) {
            setTimeout(() => setCurrentItem(0), 3000);
        } else {
            setTimeout(() => setCurrentItem(currentItem + 1), 3000);
        }
    }, [currentItem, files.length]);

    useEffect(() => {
        slide();
    }, [currentItem, slide]);

    const toggleLike = () => {
        toggleLikeMutation();
        if (isLikedS === true) {
            setIsLiked(false); // 좋아요 한 것을 다시 누르면 좋아요 취소
            setLikeCount(likeCountS - 1);
        } else {
            setIsLiked(true);
            setLikeCount(likeCountS + 1);
        }
    }

    const onKeyPress = (event) => {
        const { which } = event;
        // #1 fake
        if (which === 13) {
            event.preventDefault();
            comment.setValue("");
            try {
                addCommentMutation();
                setSelfComments([
                    ...selfComments, 
                    {
                        id: Math.floor(Math.random() * 100),
                        text: comment.value,
                        user: { username: meQuery.me.username }
                    }]);
            } catch {
                toast.error("Cant send comment");
            }
        }
        // #2
        // if (which === 13) {
        //     event.preventDefault();
        //     try {
        //         const {
        //             data: { addComment }
        //         } = await addCommentMutation();
        //         console.log(addComment);
        //         setSelfComments([...selfComments, addComment]);
        //         comment.setValue("");
        //     } catch {
        //         toast.error("Cant send comment");
        //     }
        // }
    };

    return (
        <PostPresenter 
            user={user}
            files={files}
            likeCount={likeCountS}
            location={location}
            caption={caption}
            isLiked={isLikedS}
            comments={comments}
            createdAt={createdAt}
            currentItem={currentItem}
            newComment={comment}
            setIsLiked={setIsLiked}
            setLikeCount={setLikeCount}
            toggleLike={toggleLike}
            onKeyPress={onKeyPress}
            selfComments={selfComments}
        />
    );
}

PostContainer.propTypes = {
    id: PropTypes.string.isRequired,
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        avatar: PropTypes.string,
        username: PropTypes.string.isRequired
    }).isRequired,
    files: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired
    })).isRequired,
    likeCount: PropTypes.number.isRequired,
    isLiked: PropTypes.bool.isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        user: PropTypes.shape({
                id: PropTypes.string.isRequired,
                username: PropTypes.string.isRequired
            }).isRequired
    })).isRequired,
    caption: PropTypes.string.isRequired,
    location: PropTypes.string,
    createdAt: PropTypes.string.isRequired
}

export default PostContainer
