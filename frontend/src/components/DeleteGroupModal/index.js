import React from "react";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { useModal } from "../../context/Modal";
import "./DeleteGroup.css"

function DeleteGroupModal() {
    const { closeModal } = useModal();
    const handleSubmit = () => {
        console.log('asd')
    }
    return (
        <div className="delete-modal-container">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this group?</p>
            <button className="delete-modal-button-yes" onClick={handleSubmit}>Yes (Delete Group)</button>
            <button className="delete-modal-button-no" onClick={closeModal}>No (Keep Group)</button>
        </div>
    )
}

export default DeleteGroupModal
