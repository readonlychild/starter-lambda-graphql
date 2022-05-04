var gql = {
  version: '1.0',
  _endpoint: 'https://rj07ty7re4.execute-api.us-east-1.amazonaws.com/dev/gql',
  pendingQueries: [],
  pendingFragments: [],
  send: async function (querystring) {
    querystring = querystring || '';
    let ep = this._endpoint;
    let query = this.pop();
    console.log('qry', query);
    let response = await fetch(ep + querystring, { 
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: query /* variables: */ })
      });
    return response.json();
  },
  init: function (endpoint) {
    this._endpoint = endpoint;
  },
  pop: function () {
    let q = '';
    this.pendingQueries.forEach((qry) => {
      q += `${qry.name}: ${qry.q} `;
    });
    q = `{ ${q} }`;
    this.pendingFragments.forEach((frag) => {
      q += ` ${frag}`;
    });
    this.pendingQueries = [];
    this.pendingFragments = [];
    return q;
  },
  query: function (name, fields, args, dataName) {
    dataName = dataName || name;
    let q = `${name} { ${fields} }`;
    if (args) {
      q = `${name}(${args}) { ${fields} }`;
    }
    let qry = {
      name: dataName,
      q: q
    };
    this.pendingQueries.push(qry);
  }
};
