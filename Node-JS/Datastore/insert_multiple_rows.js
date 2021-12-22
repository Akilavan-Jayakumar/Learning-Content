//Create a JSON array with the rows to be inserted
    let rowData = [{
        Name: `Mark Wellington`,
        Age: 29,
        ID: 7218
    },
    {
        Name: `Zendaya Jones`,
        Age: 32,
        ID: 3211
    }
    ];

    //Use the table meta object to insert multiple rows which returns a promise
    let datastore = app.datastore();
    let table = datastore.table('EmpDetails');
    let insertPromise = table.insertRows(rowData);
    insertPromise.then((rows) => {
            console.log(rows);
        });
