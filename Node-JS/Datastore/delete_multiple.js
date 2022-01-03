const catalystSDK = require("zcatalyst-sdk-node");
const express = require("express");
const app = express();

app.use(express.json());

app.delete("/multiple", async (req, res) => {
  try {
    const deletionData = [];

    const { selectedRows, selectedAll } = req.body;

    const catalyst = catalystSDK.initialize(req);

    const zcql = catalyst.zcql();
    if (selectedAll) {
      const dataQuery = `SELECT Restaurants.ROWID FROM Restaurants LIMIT 1,${DELETION_LIMIT}`;
      const dataResult = await zcql.executeZCQLQuery(dataQuery);
      dataResult.forEach((item) => {
        deletionData.push(item.Restaurants.ROWID);
      });
    } else {
      const dataQuery = `SELECT Restaurants.ROWID FROM Restaurants WHERE Restaurants.ROWID IN (${selectedRows.join(
        ","
      )}) LIMIT 1,${DELETION_LIMIT}`;
      const dataResult = await zcql.executeZCQLQuery(dataQuery);
      dataResult.forEach((item) => {
        deletionData.push(item.Restaurants.ROWID);
      });
    }

    const deletionQuery = `DELETE FROM Restaurants WHERE Restaurants.ROWID IN (${deletionData.join(
      ","
    )})`;

    await zcql.executeZCQLQuery(deletionQuery);

    res.status(200).send({
      code: 2000,
      info: "Deletion of multiple records completed successfully",
      data: {},
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      err,
      code: 5000,
      info: "Internal server error",
      data: {},
    });
  }
});

module.exports = app;
