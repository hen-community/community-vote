import '../assets/styles/utility-classes.css';
import './profile.css';
import { Link } from "react-router-dom";

import { ReactComponent as IconFor } from '../assets/icons/vote-for.svg';
import { ReactComponent as IconAgainst } from '../assets/icons/vote-against.svg';

export const Profile = (props: any) => {
  // console.log(props)
  return (
    <article className="pageContents">
      <header className="pageHeader">
        <h1>Your profile</h1>
      </header>
      <section className="pageSection-gray">
        <strong>Logged in as: { props.activeAccount }</strong>
        <div>
          { props.votes.teia23 ? 
            <span><IconFor/> This wallet is eligible to vote in the latest poll.</span> :
            <span><IconAgainst/> This wallet is not eligible to vote in the latest poll.</span>        
          }
        </div>
        <a href="https://discourse.teia.art/t/vote-discussion-total-supply-of-teia-dao-tokens/625" target="_blank">More info about vote eligibility.</a>
        {/*
        <span style={{opacity: props.votes.teia23?'1.0':'0.5'}}>Teia Users 2023 { props.votes.teia23?<IconFor/>:<IconAgainst/>}</span>
        <span style={{opacity: props.votes.tzprof?'1.0':'0.5'}}>{ props.votes.tzprof?<IconFor/>:<IconAgainst/>} Tezos Profiles</span>
        <span style={{opacity: props.votes.hDAO?'1.0':'0.5'}}>{ props.votes.hDAO?<IconFor/>:<IconAgainst/>} hDAO</span>
        <span style={{opacity: props.votes.henOG?'1.0':'0.5'}}>{ props.votes.henOG?<IconFor/>:<IconAgainst/>} h=n OG</span>
        <span style={{opacity: props.votes.badge?'1.0':'0.5'}}>{ props.votes.badge?<IconFor/>:<IconAgainst/>} Hicathon Badge</span>
        <span style={{opacity: props.votes.teia22?'1.0':'0.5'}}>{ props.votes.teia22?<IconFor/>:<IconAgainst/>} Teia Users 2022</span>
        */}
      </section>
      {/* <section className="pageSection">
        <Link to='/my-votes'>My Votes</Link>
      </section> */}
    </article>
  );
}
