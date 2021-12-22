
  let rowData = 
    { 
        Name: `George Hamilton`,
        Age: 22,
        ID: 6868
    };
    let datastore = app.datastore();
    let table = datastore.table('EmpDetails');
    let insertPromise = table.insertRow(rowData);
    insertPromise.then((row) => {
            console.log(row);
    });
