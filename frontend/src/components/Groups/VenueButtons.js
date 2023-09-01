import React from "react";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import VenueModal from "../VenueModal";

export default function VenueButtons({ group }) {
  return (
    <div className="venue-buttons-container">
      {group.Venues.length <= 1 && group.Venues[0] === undefined ? (
        <button>
          <OpenModalMenuItem
            itemText="Create"
            modalComponent={<VenueModal type="Create" group={group} />}
          ></OpenModalMenuItem>
        </button>
      ) : (
        ""
      )}
      {group.Venues.length >= 1 && group.Venues[0] !== undefined ? (
        <>
          <button>
            {" "}
            <OpenModalMenuItem
              itemText="Update"
              modalComponent={<VenueModal type="Update" group={group} />}
            ></OpenModalMenuItem>
          </button>
          <button>
            {" "}
            <OpenModalMenuItem
              itemText="Delete"
              modalComponent={<VenueModal type="Delete" group={group} />}
            ></OpenModalMenuItem>
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
