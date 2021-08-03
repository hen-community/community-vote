import '../assets/styles/utility-classes.css';
import './proposalDetail.css';
import { useParams } from "react-router-dom";
import * as React from "react";

import { Button } from '../components/Button';

import { ReactComponent as Logo } from '../assets/icons/hen-logo.svg';
// import { ReactComponent as VoteForIcon } from '../assets/icons/vote-for.svg';
// import { ReactComponent as VoteAgainstIcon } from '../assets/icons/vote-against.svg';
// import { ReactComponent as VoteDrawIcon } from '../assets/icons/vote-draw.svg';
// import { ReactComponent as ViewsIcon } from '../assets/icons/views.svg';
import { ReactComponent as OtherIcon } from '../assets/icons/other.svg';

import { vote } from "../contract";
import { useToasts } from "react-toast-notifications";

async function getPollData(key: string) {
  return await fetch(`https://api.florencenet.tzkt.io/v1/bigmaps/${process.env.REACT_APP_BIGMAP_POLLS}/keys?key=${key}`)
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
  return await fetch(`https://api.florencenet.tzkt.io/v1/bigmaps/${process.env.REACT_APP_BIGMAP_VOTES}/keys`)
    .then(response => response.json())
    .then(votes => votes.filter((v: any) => v.key.string === key))
}

function sumVotes(votes: any) {
  console.log(votes)
  return {
    1: votes.filter((v: any) => v.value === "1").length,
    2: votes.filter((v: any) => v.value === "2").length,
    3: votes.filter((v: any) => v.value === "3").length,
    4: votes.filter((v: any) => v.value === "4").length
  };
}

export const ProposalDetail = () => {
  const params = useParams<{poll: string}>();
  const { addToast } = useToasts();
  
  const [pollData, setPollData] = React.useState({
    hash: '',
    metadata: {
      startDate: '',
      endDate: '',
      numOptions: 0
    },
    totals: {}
  });
  const [voteData, setVoteData] = React.useState([]);
  const [voteSums, setVoteSums] = React.useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0
  });
  React.useEffect(() => {
    getPollData(params.poll)
      .then(poll =>{
        console.log(poll)
        setPollData({
          hash: poll.hash,
          metadata: {
            startDate: poll.value.metadata.start_date,
            endDate: poll.value.metadata.end_date,
            numOptions: Math.floor(poll.value.metadata.num_options)
          },
          totals: poll.value.totals
        })
      })
      .catch(err => console.error(err));
    getVoteData(params.poll)
      .then(votes =>{
        console.log(votes)
        setVoteData(votes)
        setVoteSums(sumVotes(votes))
      })
      .catch(err => console.error(err));
  }, [params.poll]);

  async function handleVote(option: number) {
    if (params.poll) {
      try {
        const hash = await vote(params.poll, option);
        if (hash) {
          addToast("Tx Submitted", {
            appearance: "success",
            autoDismiss: true,
          });
        }
      } catch (error) {
        console.log(error);
        const errorMessage = error?.data[1]?.with?.string || "Tx Failed";
        addToast(errorMessage, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
  }
  const discourseThread = 'https://community.hicetnunc.xyz/t/test-proposal-'+params.poll
  // const hasVoted = false;
  console.log(voteData)
  return (
    <article className="proposalDetail pageContents">
      <header className="proposalDetail-header pageHeader">
        <div className="proposalDetail-meta">
          <div className="proposalDetail-metaPrimary">
            <div className="proposalDetail-idAndType">
              #{ params.poll } Proposal
            </div>
            <div className="proposalDetail-subCategory">
              <OtherIcon /> DAO
            </div>
            {/* <div className="proposalDetail-views">
              <ViewsIcon /> 34 Views
            </div> */}
          </div>
          <div className="proposalDetail-countdown">
            Ends in { pollData ? pollData.metadata.endDate : '...' }
          </div>
        </div>
        <h1>
        In order to connect and grow the H=N developer com...
        </h1>
        <div className="proposalDetail-url">
        { discourseThread }
        </div>
        <hr />
        { console.log(pollData) }
        { pollData.metadata.numOptions === 2 ? (
          <footer className="proposalDetail-voteStatus">
            <div className="proposalDetail-graph">
              <div><span className="text-s-bold">Results</span> <small className="text-s-light">30 votes required</small></div>
              <div>{ voteSums[1] } for • { voteSums[2] } against</div>
            </div>
            <a className="proposalDetail-discussionLink"
              href={ discourseThread }>
              Discuss on Discourse 
            </a>
            <div className="proposalDetail-yourVote">
              <div onClick={()=>{handleVote(2)}}><Button>AGAINST</Button></div>
              <div onClick={()=>{handleVote(1)}}><Button>FOR</Button></div>
            </div>
          </footer>
        ) : (
          <footer className="proposalDetail-voteStatus">
            <div className="proposalDetail-graph">
              <div><span className="text-s-bold">Results</span> <small className="text-s-light">30 votes required</small></div>
              <div>{ JSON.stringify(voteSums) }</div>
            </div>
            <a className="proposalDetail-discussionLink"
              href={ discourseThread }>
              Discuss on Discourse
            </a>
            <div className="proposalDetail-yourVote">
              <div onClick={()=>{handleVote(1)}}><Button>OPTION 1</Button></div>
              <div onClick={()=>{handleVote(2)}}><Button>OPTION 2</Button></div>
              <div onClick={()=>{handleVote(3)}}><Button>OPTION 3</Button></div>
              { pollData.metadata.numOptions > 3 ? (
                <div onClick={()=>{handleVote(4)}}><Button>OPTION 4</Button></div>
              ) : '' }
            </div>
          </footer>
        )}
      </header>
      <div className="pageSection proposalDetail-adoptionStatus">
        <Logo /> <span className="text-l-light">STATUS</span> <span className="text-l-bold">PENDING</span> <a href="#adoptiondoc">https://www.loremipsum.com/wqdwqdw/ef3243r/qwdwde42/65765y4trf</a>
      </div>
      <section className="pageSection proposalDetail-columns">
        <section className="proposalDetail-details">
          <p className="text-m-medium">In order to connect and grow the H=N developer comsectetur adipiscing elit tempus feugi?</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tincidunt orci in tempus feugiat. Duis congue ac turpis eu blandit. Phasellus dolor nisi, rutrum quis tempus in, volutpat sit amet mi. Quisque nisi tortor, dictum nec leo at, molestie eleifend ipsum. Aliquam dapibus metus nec tortor pulvinar, in commodo risus consectetur. Phasellus auctor vestibulum viverra. Nulla tristique sodales purus, ut cursus turpis ultrices eu. Sed aliquet sed lectus nec finibus. Praesent pulvinar, sapien et consequat bibendum, velit ligula porttitor odio, vel sollicitudin odio nisl nec neque. Vestibulum vel finibus mauris, et fermentum urna. Aliquam sed mauris enim. Pellentesque in arcu sapien. </p>
          <p>Phasellus dolor nisi, rutrum quis tempus in, volutpat sit amet mi. Quisque nisi tortor, dictum nec leo at, molestie eleifend ipsum. Aliquam dapibus metus nec tortor pulvinar, in commodo risus consectetur. Phasellus auctor vestibulum viverra. Nulla tristique sodales purus, ut cursus turpis ultrices eu. Sed aliquet sed lectus nec finibus. Praesent pulvinar, sapien et consequat bibendum, velit ligula porttitor odio, vel sollicitudin odio nisl nec neque. Vestibulum vel finibus mauris, et fermentum urna. Aliquam sed mauris enim. Pellentesque in arcu sapien.</p>
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
            PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV
          </p>
          <p className="text-s-light">
            Proposer:<br/>
            Hicathon
          </p>
          <p className="proposalDetail-sidebarHeader">
          <span className="proposalDetail-sidebarHeader-line"></span>
            <span className="proposalDetail-sidebarHeader-text text-s-medium">Help</span>
          </p>
          <p className="text-s-light">
            How does the voting system work?<br/>
            Sollicitudin odio nisl nec neque et fermentum?
          </p>
        </section>
      </section>
    </article>
  );
}
