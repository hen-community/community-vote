import { useWallet } from "@tz-contrib/react-wallet-provider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

import { checkBadge, hasTzProfiles } from './api';

export default function Nav() {
  // const { ... } = useParams();
  const { disconnect, activeAccount, connect } = useWallet();
  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/" style={{flex:1,color:'white',fontWeight:'bold',textDecoration:'none'}}>HICVOTE</Link>
        {activeAccount ? (
          <>
            {activeAccount.address} (votes: 
            {checkBadge(activeAccount.address)?'1':'x'}
            {hasTzProfiles(activeAccount.address)?'2':'x'}
            )
            <Button color="inherit" onClick={()=>console.log([
                checkBadge(activeAccount.address),
                hasTzProfiles(activeAccount.address)
              ]) }>
              Check Badge
            </Button>
            <Button color="inherit" onClick={disconnect}>
              Logout
            </Button>
          </>
        ) : (
          <Button color="inherit" onClick={connect}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
