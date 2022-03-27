import { useParams } from "react-router-dom";
import {Button} from './Button';

import { vote } from "../contract";
import { useToasts } from "react-toast-notifications";

import { ReactComponent as VoteForIcon } from '../assets/icons/vote-for.svg';
import { ReactComponent as VoteAgainstIcon } from '../assets/icons/vote-against.svg';


export const VoteButton = ({...props}) => {

  const params = useParams<{poll: string}>();
  const { addToast } = useToasts();

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
        console.error(error);
        const errorMessage = error?.message || error?.data[1]?.with?.string || "Tx Failed";
        addToast(errorMessage, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
  }
  function getTitle(i: number, pollIpfs: any) {
    if (!pollIpfs || (pollIpfs.opt1 && pollIpfs.opt1 === "")) return i===1 ? <>FOR <VoteForIcon/></> : <>AGAINST <VoteAgainstIcon/></>;
    if (!pollIpfs || (pollIpfs.opt1 && pollIpfs.opt1==='Option 1')) return "Option " + i
    if (i === 1) return pollIpfs.opt1
    if (i === 2) return pollIpfs.opt2
    if (i === 3) return pollIpfs.opt3
    if (i === 4) return pollIpfs.opt4
    if (i === 5) return pollIpfs.opt5
    if (i === 6) return pollIpfs.opt6
    if (i === 7) return pollIpfs.opt7
    if (i === 8) return pollIpfs.opt8
    if (i === 9) return pollIpfs.opt9
    if (i === 10) return pollIpfs.opt10
  }
  return (
    <Button
      voted={ props.myvote === props.optionNumber ? 'true' : 'false' }
      winner={props.winner}
      disabled={ props.disabled }
      className={props.className}
      onClick={()=>{handleVote(props.optionNumber)}} 
      style={{
          border: (props.resultsData && props.resultsData.length > 0) ? ((parseInt(
              Object.keys(props.resultsData).reduce((a,b) => props.resultsData[a] > props.resultsData[b] ? a : b, "0")
            ) === props.optionNumber) ?
              "5px solid black" :
              `3px solid hsl(${(props.optionNumber-1)*36} 70% 60%)`
          ):''
      }}
    >
      { getTitle(props.optionNumber, props.pollIpfs) }{ props.myvote === props.optionNumber && " ✔" }
    </Button>
  );
};