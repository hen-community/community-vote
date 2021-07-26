const axios = require('axios')

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
    console.log(result);

    return await result.json();
}

export async function checkBadge(address: string) {
    const {
        errors,
        data
    } = await fetchGraphQL(queryBadgeCheck, "BadgeCheck", {
        "wallet": address
    });
    if (errors) console.error(errors);

    const result = data.hic_et_nunc_token[0].token_holders.length > 0;
    return result
}
export async function getTzProfiles(address: string) {
    return await axios.post('https://indexer.tzprofiles.com/v1/graphql', {
      query: `query MyQuery { tzprofiles_by_pk(account: "${address}") { valid_claims } }`,
      variables: null,
      operationName: 'MyQuery',
    })
}

export async function hasTzProfiles(address: string) {
    await getTzProfiles(address).then(res => {
        return typeof res.data.tzprofiles_by_pk !== 'undefined';
    });
    return false;
}