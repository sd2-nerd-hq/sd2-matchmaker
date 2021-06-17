import { useProfile } from "../service/socket";
import { Link, useHistory } from "react-router-dom";
import React from "react";
import { Button, Input } from "@geist-ui/react";

export function IndexPage() {
  const profile = useProfile( state => state )
  const history = useHistory()
  const [username, setUsername] = React.useState( "" )
  
  return <div className={""}>
    <div className="pa3 tc">
      {profile.username && <div>
        <div className={"f3"}>Welcome back <b>{profile.username}</b></div>
        <div className="f7 "><a onClick={profile.logout} href="#">Not me. Sign out!</a></div>
        <div className={"pt3"}>
          <Link to={"/slot"}><Button>new Match</Button></Link>
        </div>
      </div>}
      {!profile.username && <div>
        <div className="pb3">
          <h1>SD2 Matchmaker</h1>
          <div>Ban Divisions & Pick Maps. Enjoy.</div>
        </div>
        <form onSubmit={() => {
          profile.assignUsername( username )
        }
        }>
          <Input
            value={username}
            onChange={e => {
              setUsername( e.currentTarget.value )
            }}
            label={"Username"}/>
          <div className="pt2">
            <Button
              type={"submit"}
              onClick={() => {
                profile.assignUsername( username )
              }}
            >That's me!</Button>
          </div>
        
        </form>
      
      </div>}
    </div>
  </div>
}