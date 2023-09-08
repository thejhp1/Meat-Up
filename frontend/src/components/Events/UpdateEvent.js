import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { EventForm } from "./EventForm";
import { thunkGetEventDetail } from "../../store/events";

export default function UpdateEvent() {
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const event = useSelector((state) => state?.events[eventId] );
    useEffect(() => {
      dispatch(thunkGetEventDetail(eventId))
    }, [dispatch, eventId]);
    if (!event) return <></>;
    return (
        <EventForm formType="Update" event={event} />
    )
}
