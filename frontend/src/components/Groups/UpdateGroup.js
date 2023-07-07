import { GroupForm } from "./GroupForm";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { thunkGetGroupDetail } from "../../store/groups";
import { useParams } from "react-router-dom";
export const UpdateGroup = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session);
  const group = useSelector((state) =>
    state.groups ? state.groups[groupId] : null
  );
  useEffect(() => {
    dispatch(thunkGetGroupDetail(groupId));   
  }, [dispatch, groupId]);
  if (!group) return <></>;
  if (session.user === null) return window.location.href = "/not-found"
  if (group.organizerId === session.user.id) {
    return <GroupForm formType="Update" group={group} />;
  } else {
    window.location.href = "/not-found"
  }

};
