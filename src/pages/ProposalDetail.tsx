import '../assets/styles/utility-classes.css';
import './proposalDetail.css';
import { useParams } from "react-router-dom";
import * as React from "react";
import { Link } from "react-router-dom";

import DiscourseForum from "../components/DiscourseForum";

// import { ReactComponent as ProposalIcon } from '../assets/icons/other.svg';

import { VoteButton } from '../components/VoteButton';
import { ResultsGraph } from '../components/ResultsGraph';

// import { ReactComponent as Logo } from '../assets/icons/hen-logo.svg';
// import { ReactComponent as VoteDrawIcon } from '../assets/icons/vote-draw.svg';
// import { ReactComponent as ViewsIcon } from '../assets/icons/views.svg';
// import { ReactComponent as OtherIcon } from '../assets/icons/other.svg';

async function getPollData(key: string) {
  return await fetch(`https://api.${process.env.REACT_APP_NETWORK}.tzkt.io/v1/bigmaps/${process.env.REACT_APP_BIGMAP_POLLS}/keys?key=${key}`)
    .then(response => response.json())
    .then(polls => {
      if (polls[0].key === key) {
        return polls[0];
      } else {
        throw new Error(`Poll with key ${key} not found`);
      }
    });
}
async function getVoteData(key: string) {
  return await fetch(`https://api.${process.env.REACT_APP_NETWORK}.tzkt.io/v1/bigmaps/${process.env.REACT_APP_BIGMAP_VOTES}/keys?key.string=${key}&limit=10000`)
    .then(response => response.json())
}

async function getIpfs(hash: string) {
  return await fetch(`https://infura-ipfs.io/ipfs/${hash}`)
    .then(response => response.json())
}

async function getResults(poll: string) {
  return await fetch(`/results.json`)
    .then(response => response.json())
    .then(data => {
      return data[poll];
    });
}

function sumVotes(votes: any) {
  return {
    1: votes.filter((v: any) => v.value === "1").length,
    2: votes.filter((v: any) => v.value === "2").length,
    3: votes.filter((v: any) => v.value === "3").length,
    4: votes.filter((v: any) => v.value === "4").length,
    5: votes.filter((v: any) => v.value === "5").length,
    6: votes.filter((v: any) => v.value === "6").length,
    7: votes.filter((v: any) => v.value === "7").length,
    8: votes.filter((v: any) => v.value === "8").length,
    9: votes.filter((v: any) => v.value === "9").length,
    10: votes.filter((v: any) => v.value === "10").length
  };
}

export const ProposalDetail = (props: any) => {
  const activeAccount = props.activeAccount && props.activeAccount.address
  const votePower = props.votePower

  const params = useParams<{poll: string}>();

  const [hasResults, setHasResults] = React.useState(false);
  const [resultsData, setResultsData] = React.useState({} as any);
  
  const [pollData, setPollData] = React.useState({
    hash: '',
    metadata: {
      startDate: '',
      endDate: '',
      numOptions: 0,
      category: '',
      title: ''
    },
    totals: {}
  });
  const [voteData, setVoteData] = React.useState({votes:[],myvote:0});
  const [voteSums, setVoteSums] = React.useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0
  });
  const [pollIpfs, setPollIpfs] = React.useState({
    description: '',
    opt1: 'Option 1',
    opt2: 'Option 2',
    opt3: 'Option 3',
    opt4: 'Option 4',
    opt5: 'Option 5',
    opt6: 'Option 6',
    opt7: 'Option 7',
    opt8: 'Option 8',
    opt9: 'Option 9',
    opt10: 'Option 10',
    multi: "false"
  });
  React.useEffect(() => {
    getPollData(params.poll)
      .then(poll =>{
        setPollData({ 
          hash: poll.hash,
          metadata: {
            startDate: poll.value.metadata.start_date,
            endDate: poll.value.metadata.end_date,
            numOptions: Math.floor(poll.value.metadata.num_options),
            category: poll.value.metadata.category,
            title: poll.value.metadata.title
          },
          totals: poll.value.totals
        })
      })
      .catch(err => console.error(err));
    getIpfs(params.poll)
      .then(ipfs =>{
        setPollIpfs(ipfs)
      }
    )
    getResults(params.poll)
      .then((results:any) =>{
        if (results !== undefined) {
          setHasResults(true)
          for(let i = 1; i <= 10; i++) {
            if (results[i] === 'undefined') results[i] = 0;
          }
          setResultsData(results)
        }
      }
    )
  }, [params.poll]);
  React.useEffect(() => {
    getVoteData(params.poll)
      .then(votes =>{
        var myvote = 0
        for (let i = 0; i < votes.length; i++) {
          if (votes[i].key.address === activeAccount) {
            myvote = votes[i].value * 1;
          }
        }
        setVoteData({
          votes: votes,
          myvote: myvote
        })
        setVoteSums(sumVotes(votes))
      })
      .catch(err => console.error(err));
  }, [params.poll, activeAccount]);

  return (
    <article className="proposalDetail pageContents">
      <header className="proposalDetail-header pageHeader">
        <div className="proposalDetail-meta">
          <div className="proposalDetail-countdown text-s">
            Ends { pollData ? pollData.metadata.endDate.substring(0,10) : '...' }
          </div>
        </div>
        <h1>
        { pollData.metadata.title }
        </h1>
        { pollIpfs.multi === 'score' && (
          <div><strong>Scored Vote:</strong>  Please rank this proposal from 1 to 5 (5 is the best)</div>
        )}
        <hr />
        { pollIpfs.opt1 === "" ? (
          <footer className="proposalDetail-voteStatus proposalDetail-yesNo">
            <div className="proposalDetail-graph">
              { hasResults && (
                <>
                  <div className="proposalDetail-graph-labels">
                    <span className={"proposalDetail-graph-label "+(resultsData["1"]>resultsData["2"]?'winner':'') }>For {((resultsData["1"] / (resultsData["1"] + resultsData["2"])) * 100).toFixed(0)}%</span>
                    <span className="proposalDetail-graph-label">Against {((resultsData["2"] / (resultsData["1"] + resultsData["2"])) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="proposalDetail-graph-bar">
                    <div className="proposalDetail-graph-bar-part" style={{flex: resultsData["1"]+" 0 auto", background: (resultsData["1"]>resultsData["2"]?"black":"var(--shade-5)")}}></div>
                    <div className="proposalDetail-graph-bar-part" style={{flex: resultsData["2"]+" 0 auto", background: (resultsData["2"]>resultsData["1"]?"black":"var(--shade-5)")}}></div>
                  </div>
                </>
              )}
              <div>
                <a href="#votes" className="text-s-bold">Votes Submitted:</a>&nbsp;
                { Object.values(voteSums).reduce((a, b) => a + b, 0) || 0 }
                {/* <small className="text-s-light"> &nbsp; (30 votes required)</small> */}
              </div>
            </div>
            <div className={"proposalDetail-yourVote multi-"+(pollIpfs.multi)}>
              <VoteButton
                myvote={voteData.myvote}
                optionNumber={2}
                disabled={ !votePower.henOG }
              />
              <VoteButton
                myvote={voteData.myvote}
                optionNumber={1}
                disabled={ !votePower.henOG }
              />
            </div>
             { votePower.henOG || (
               <span>Sync your teia wallet to vote. Voting currently limited to artists and collectors who interacted with hicetnunc before the website was discontinued (11/11/21).</span>
              ) }
          </footer>
        ) : (
          <footer className="proposalDetail-voteStatus proposalDetail-multi">
            <div className="proposalDetail-graph">
              <ResultsGraph
                pollData={pollData}
                resultsData={resultsData}
                hasResults={hasResults}
                pollIpfs={pollIpfs}
              />
              <div>
                <a href="#votes" className="text-s-bold">Votes Submitted:</a>&nbsp;
                { Object.values(voteSums).reduce((a, b) => a + b, 0) || 0 }
                {/* <small className="text-s-light"> (30 votes required)</small> */}
              </div>
            </div>
            <div className={"proposalDetail-yourVote multi-"+(pollIpfs.multi)}>
              { [1,2,3,4,5,6,7,8,9,10].map(i => (
                pollData.metadata.numOptions > i-1 && <VoteButton
                  myvote={voteData.myvote}
                  optionNumber={i}
                  disabled={ !votePower.henOG || hasResults }
                  resultsData={resultsData}
                  pollIpfs={pollIpfs}
                />
              ))}
            </div>
            { votePower.henOG || (
              <span>Sync your teia wallet to vote. Voting currently limited to artists and collectors who interacted with hicetnunc before the website was discontinued.</span>
            ) }
          </footer>
        )}
      </header>
      <section className="pageSection proposalDetail-columns">
        <section className="proposalDetail-details">
          <p>{ pollIpfs.description }</p>
          <DiscourseForum/>
        </section>
        <section className="proposalDetail-sidebar">
          <p className="proposalDetail-sidebarHeader">
            <span className="proposalDetail-sidebarHeader-line"></span>
            <span className="proposalDetail-sidebarHeader-text text-s-medium">Specs</span>
          </p>
          <p className="text-s-light">
            Start date:<br/>
            { pollData.metadata.startDate }
          </p>
          <p className="text-s-light">
            End date:<br/>
            { pollData.metadata.endDate }
          </p>
          <p className="text-s-light">
            Hash:<br/>
            <a target="_blank" rel="noreferrer" href={"https://ipfs.io/ipfs/"+ params.poll }>{ params.poll }</a>
          </p>
          <p className="proposalDetail-sidebarHeader">
          <span className="proposalDetail-sidebarHeader-line"></span>
            <span className="proposalDetail-sidebarHeader-text text-s-medium">Help</span>
          </p>
          <p className="text-s-light">
            <Link to="/faq">How does the voting system work?</Link>
          </p>
          <p className="proposalDetail-sidebarHeader">
          <span className="proposalDetail-sidebarHeader-line"></span>
            <span className="proposalDetail-sidebarHeader-text text-s-medium" id="votes">Votes</span>
          </p>
          <ul className="text-s-light voteRow-list">
            { voteData && voteData.votes.slice(0,50).map((vote: any) => 
              <li className="voteRow" key={vote.id}>
                {/* { vote.key.address.substr(0,4)+"..."+vote.key.address.substr(vote.key.address.length - 4,vote.key.address.length) } voted { vote.value === "1" ? 'for' : 'against' } */}
                <a target="_blank" rel="noreferrer" href={"https://better-call.dev/mainnet/big_map/"+process.env.REACT_APP_BIGMAP_VOTES+"/"+vote.hash }>{ vote.key.address }</a>
              </li>
            )}
            <a href={"https://better-call.dev/mainnet/big_map/"+process.env.REACT_APP_BIGMAP_VOTES }>View all votes</a>
          </ul>
        </section>
      </section>
    </article>
  );
}