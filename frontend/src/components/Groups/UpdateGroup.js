import { GroupForm } from "./GroupForm";
import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { thunkGetGroupDetail } from "../../store/groups";
import { useParams } from "react-router-dom";
export const UpdateGroup = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const group = useSelector((state) =>
    state.groups ? state.groups[groupId] : null
  );
  useEffect(() => {
    dispatch(thunkGetGroupDetail(groupId));
  }, [dispatch, groupId]);
  if (!group) return <></>;
  console.log(group);
  return <GroupForm formType="Update" group={group} />;
};
