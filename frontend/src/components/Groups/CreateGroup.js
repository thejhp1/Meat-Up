export const CreateGroup = () => {
    return (
        <div className="create-group-container">
            <p style={{color:"#00798A", marginTop:"1rem", fontSize:"14px"}}>BECOME AN ORGANIZER</p>
            <p>We'll walk you through a few steps to build your local community</p>
            <p className="create-group-border"></p>
            <p style={{marginTop:".5rem"}}>First, set your group's location.</p>
            <p style={{fontSize:"12px", maxWidth:"22rem", marginTop:".1rem"}}>Meatup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.</p>
            <input placeholder="City, STATE" style={{fontSize:"10px"}}></input>
            <p className="create-group-borders"></p>
            <p style={{marginTop:".75rem"}}>What will your groups's name be?</p>
            <p style={{fontSize:"12px", maxWidth:"22rem", marginTop:".1rem"}}>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
            <input placeholder="What is your group name?" style={{fontSize:"10px"}}></input>
        </div>
    )
}
