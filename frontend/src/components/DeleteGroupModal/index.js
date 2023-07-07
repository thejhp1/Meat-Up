import React from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { thunkDeleteGroup } from "../../store/groups";
import "./DeleteGroup.css"
import { thunkDeleteEvent } from "../../store/events";

function DeleteGroupModal({type, event}) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const groupStore = useSelector((state) => state.groups);
    let word = ""

    function handleSubmit() {
        if (type === "event") {
            dispatch(thunkDeleteEvent(event.id))
            closeModal()
            window.location.href='/events'
        } else if (type === "group") {
            dispatch(thunkDeleteGroup(Object.values(groupStore)[0].id))
            closeModal()
            window.location.href='/groups'
        }
    }

    if (type === "event") {
        word = "Event"
    } else if (type === "group") {
        word = "Group"
    }

    return (
        <div className="delete-modal-container">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this {word.toLowerCase()}?</p>
            <button className="delete-modal-button-yes" onClick={() => handleSubmit()}>Yes (Delete {word})</button>
            <button className="delete-modal-button-no" onClick={closeModal}>No (Keep {word})</button>
        </div>
    )
}

export default DeleteGroupModal
