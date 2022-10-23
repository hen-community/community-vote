import * as React from "react";
import { useBeaconWallet, useWallet } from "@tezos-contrib/react-wallet-provider";
import { initPollContract, initTezos, setWalletProvider } from "./contract";
import CreatePollCard from "./components/CreatePollCard";
import { Header } from "./components/Header";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import axios from "axios";

import {Home} from './pages/Home';
import {About} from './pages/About';
import {Faq} from './pages/Faq';
import {Profile} from './pages/Profile';
import {Polls} from './pages/Polls';
import { ProposalDetail } from "./pages/ProposalDetail";

import './components/pageLayout.css';

import { Footer } from './components/Footer';

import { DarkModeLoader } from "./components/DarkModeToggle";


const RPC_URL =
  process.env.REACT_APP_RPC_URL || "https://florencenet.smartpy.io/";
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

export async function getTzProfiles(address: string) {
  return await axios.post('https://indexer.tzprofiles.com/v1/graphql', {
    query: `query MyQuery { tzprofiles_by_pk(account: "${address}") { valid_claims } }`,
    operationName: 'MyQuery',
  })
}

export async function hasTzProfiles(address: string) {
  return await getTzProfiles(address).then(res => {
    return res.data.data.tzprofiles_by_pk && res.data.data.tzprofiles_by_pk.valid_claims.length > 0;
  });
}

export async function getMyVotes(address: string) {
  return await fetch(`https://api.${process.env.REACT_APP_NETWORK}.tzkt.io/v1/bigmaps/${process.env.REACT_APP_BIGMAP_VOTES}/keys?key.address=${address}`)
    .then(response => response.json())
}

const queryBadgeCheck = `query BadgeCheck($wallet: String = "") {
  hic_et_nunc_token(where: {id: {_eq: "93229"}}) {
    metadata
    title
    token_holders(where: {quantity: {_gt: "0"}, holder_id: {_eq: $wallet}}) {
      quantity
    }
  }
}`;

async function fetchGraphQL(operationsDoc: string, operationName: string, variables: object) {
  const result = await fetch(
      "https://api.hicdex.com/v1/graphql", {
          method: "POST",
          body: JSON.stringify({
              query: operationsDoc,
              variables: variables,
              operationName: operationName
          })
      }
  );
  return await result.json();
}
export async function checkBadge(address: string) {
  const { errors, data } = await fetchGraphQL(queryBadgeCheck, "BadgeCheck", {
      "wallet": address
  });
  if (errors) console.error(errors);

  const result = data.hic_et_nunc_token[0].token_holders.length > 0;
  return result
}
export async function checkHDAO(address: string) {
  // return true if wallet holds hDAO
  // https://api.tzkt.io/v1/bigmaps/515/keys?key.address=
  const result = await axios.get(`https://api.tzkt.io/v1/bigmaps/515/keys?key.address=${address}`);
  // console.log(result);
  return result.data.length > 0 ? result.data[0].value > 0 : false;
}
export async function checkHenOG(address: string) {
  // return true if wallet was a hen OG (interacted with contracts before discontinuation)
  // load in hen-users-snapshot-16-01-2022.json (or hen-ogs.json)
  const result = await axios.get(`/hen-users-snapshot-16-01-2022.json`);
  return result.data.includes(address);
}
export async function checkTeia22(address: string) {
  // return true if wallet has interacted with teia or hen before, or has any hdao on: Oct, 13 2022
  // load in hen-users-snapshot-16-01-2022.json (or hen-ogs.json)
  const result = await axios.get(`/teia_and_hen_users_snapshot_13-10-2022.json`);
  return result.data.includes(address);
}

function App() {
  const { connected, disconnect, activeAccount, connect } = useWallet();
  const beaconWallet = useBeaconWallet();
  const [votePower, setVotePower] = React.useState({
    count: 0, tzprof: false, hDAO: false, henOG: false, badge: false, teia22: false
  });
  const [myVotes, setMyVotes] = React.useState([]);
  function getVotePower(address: string) {
    var votePower = {
      count: 0, tzprof: false, hDAO: false, henOG: false, badge: false, teia22: false
    };
    Promise.all([
      hasTzProfiles(address).then(has => {
        if (has) {
          votePower.count++
          votePower.tzprof = true
        }
      },
      checkBadge(address).then(has => {
        if (has) {
          votePower.count++
          votePower.badge = true
        }
      },
      checkHDAO(address).then(has =>  {
        if (has) {
          votePower.count++
          votePower.hDAO = true
        }
      },
      checkHenOG(address).then(has =>  {
        if (has) {
          votePower.count++
          votePower.henOG = true
        }
      },
      checkTeia22(address).then(has =>  {
        if (has) {
          votePower.count++
          votePower.teia22 = true
        }
      }
    ]).then(() => {
      setVotePower(votePower);
    }).catch(err => {
      console.error(err);
    });
  };
  React.useEffect(() => {
    initTezos(RPC_URL);
    initPollContract(CONTRACT_ADDRESS);
  }, []);
  React.useEffect(() => {
    setWalletProvider(beaconWallet);
  }, [beaconWallet]);
  React.useEffect(() => {
    if (activeAccount) {
      getVotePower(activeAccount.address);
      getMyVotes(activeAccount.address).then(myVotes => {
        setMyVotes(myVotes)
      })
    }
  }, [activeAccount]);
  
  return (
    <Router>
      <DarkModeLoader />
      <div className="pageLayout">
        <div className="pageLayout-contents">
          <Header 
            votes={votePower}
            connected={connected}
            disconnect={disconnect}
            activeAccount={activeAccount}
            connect={connect}
          />
          <div className="pageLayout-body">
            <Switch>
              <Route exact path="/">
                <Home myVotes={myVotes} />
              </Route>
              <Route path="/about" component={About} />
              <Route path="/faq" component={Faq} />
              <Route path="/profile">
                { activeAccount ? (
                  <Profile 
                    activeAccount={activeAccount.address}
                    votes={ votePower }
                  />
                ) : 'Log In' }
              </Route>
              <Route path="/proposals">
                <Polls view="proposals" myVotes={myVotes} />
              </Route>
              <Route path="/questions">
                <Polls view="questions" myVotes={myVotes} />
              </Route>
              <Route path="/past-votes">
                <Polls view="past" myVotes={myVotes} />
              </Route>
              <Route path="/my-votes">
                <Polls view="my" myVotes={myVotes} />
              </Route>
              <Route path="/vote/:poll">
                <ProposalDetail
                  activeAccount={ activeAccount }
                  votePower={ votePower }
                  myVotes={myVotes} 
                />
              </Route>
              <Route path="/admin" component={CreatePollCard} />
            </Switch>
          </div>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
