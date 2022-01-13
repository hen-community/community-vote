import { Link } from "react-router-dom";

import '../assets/styles/utility-classes.css';
import './about.css';

export const About = () => {
  return (
    <article className="pageContents--centered">
      <header className="pageHeader pageHeader--centered">
        <h1>ABOUT</h1>
        <h3 className="text-xl">The voice of the hic et nunc community amplified.</h3>
      </header>
      <section className="pageSection">
        <h2>Let's build the next hicetnunc</h2>
        <p>The founder of hicetnunc, crzypatchwork, announced the end of his experimental NFT platform on 11/11/2021. The original domain (hicetnunc.xyz) is since unreachable. To preserve the history and artwork of hicetnunc, and to continue the decentralized mission, members of the community have organized to begin a new chapter in the history of hicetnunc, with the same philosophy and a new name. We aim to continue the spirit of hicetnunc on the tezos blockchain for those that rely on its accessibility and to step further into decentralization of the platform.</p>
      </section>
      <section className="pageSection">
        <h2>What can I do here?</h2>
        <p>You are the voice of the community. The HENC (hen-community) uses this tool for on-chain voting. While we are working on setting up a full DAO structure, this tool will allow us to vote on important decisions with hicetnunc wallets used before the discontinuation of hicetnunc.xyz.</p>
      </section>
      <section className="pageSection">
        <h2>Why this tool?</h2>
        <p>Because we believe that, together, we can create tools and applications respecting the community’s needs and wishes. The process of forming a real DAO will take a long time and we want to be able to vote on pressing decisions transparently and on-chain.</p>
      </section>
      <h3>In the end, we are all building the future of the hicetnunc ecosystem together.</h3>
      <br>
      <section className="pageSection">
        <h2>How does it work?</h2>
        <ol>
          <li>Currently, proposals and questions are discussed at the HENC discord and the community ‘discourse’ forum and then put up for a vote here.</li>
          <li>Check the list of what is to be voted in the menu ‘Proposals’ and ‘Questions’.</li>
          <li>Click on one proposal or question, see the different voting options, how many votes have been done, discuss them via the ‘discourse’ forum.</li>
          <li>For the proposals, vote by selecting one option and then clicking on it.</li>
          <li>Results are tabulated at the end of the voting period, to determine whether it met quorum (if set) and was successful.</li>
        </ol>
        <p>Visit our FAQ to learn more about how to submit proposals, earn voting rights, what the criteria are for a successful proposal, and what the adoption policies are.</p>
      </section>
      <br>
      <section className="pageSection">
        <p><Link to="/">H=N Community Vote</Link> is an experimental fork of <a href="https://github.com/kylegrover/hicvote" target="_blank" rel="noreferrer">H=N Vote</a>, created for the H=N community to collectively decide it's future.</p>
      </section>
    </article>
  );
};
