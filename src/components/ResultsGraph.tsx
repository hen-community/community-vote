

export const ResultsGraph = ({...props}) => {
  var {pollData, hasResults, resultsData, pollIpfs} = props;
  if (hasResults && resultsData && resultsData !== {}) {} else return <></>;
  function sumVals(obj: any) {
    return Object.keys(obj).reduce((sum,key)=>sum+parseFloat(obj[key]||0),0);
  }
  return (
    <>
      {console.log(resultsData)}
      { pollIpfs.multi === 'score' && (
        <strong className="proposalDetail-graph-score">
          Total Weighted Score: {(
            resultsData[1] * 1 +
            resultsData[2] * 2 +
            resultsData[3] * 3 +
            resultsData[4] * 4 +
            resultsData[5] * 5 +
            resultsData[6] * 6 +
            resultsData[7] * 7 +
            resultsData[8] * 8 +
            resultsData[9] * 9 +
            resultsData[10] * 10
          )}
        </strong>
      )}
      <div className="proposalDetail-graph-labels">
        {pollData && [...Array(pollData.metadata.numOptions)].map((x, i) =>
        <span 
          key={i} 
          className={
            "proposalDetail-graph-label "+
            resultsData && (
              (parseInt(
                Object.keys(resultsData).reduce((a,b)=> resultsData[a] > resultsData[b] ? a : b)
              ) === (i+1)) ? 'winner' : ''
            ) 
          }
          style={{
            border: "3px solid "+ resultsData && ((parseInt(
              Object.keys(resultsData).reduce((a,b)=> resultsData[a] > resultsData[b] ? a : b)
            ) === (i+1))?"black":`hsl(${i*36} 67% 75%)`)
          }}>
          {console.log((resultsData[i+1] / sumVals(resultsData) * 100).toFixed(1))}
          {i+1}: {
            (
              (
                resultsData[i+1] /
                sumVals(resultsData)
              ) * 100
            ).toFixed(1)
          }%
        </span>
        )}
      </div>
      <div className="proposalDetail-graph-bar">
        {pollData && [...Array(pollData.metadata.numOptions)].map((x, i) =>
          <div 
            key={i} 
            className="proposalDetail-graph-bar-part" 
            style={{
              flex: resultsData[i+1] +" 0 auto", 
              background: ((parseInt(
                Object.keys(resultsData).reduce((a,b)=> resultsData[a] > resultsData[b] ? a : b)
              ) === (i+1))?"black":`hsl(${i*36} 70% 70%)`)
            }}>
          </div>
        )}
      </div>
    </>
  )
};