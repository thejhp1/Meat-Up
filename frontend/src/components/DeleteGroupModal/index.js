import React from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { thunkDeleteGroup } from "../../store/groups";
import "./DeleteGroup.css"

function DeleteGroupModal() {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const groupStore = useSelector((state) => state.groups);

    function handleSubmit() {
        dispatch(thunkDeleteGroup(Object.values(groupStore)[0].id))
        closeModal()
        window.location.href='/groups'
    }

    return (
        <div className="delete-modal-container">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this group?</p>
            <button className="delete-modal-button-yes" onClick={() => handleSubmit()}>Yes (Delete Group)</button>
            <button className="delete-modal-button-no" onClick={closeModal}>No (Keep Group)</button>
        </div>
    )
}

export default DeleteGroupModal
