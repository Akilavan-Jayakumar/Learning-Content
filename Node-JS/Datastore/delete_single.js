const catalystSDK = require("zcatalyst-sdk-node");
const express = require("express");
const app = express();

app.use(express.json());

app.delete("/single", async (req, res) => {
	try {
	  const restaurant_id = req.query.restaurant_id;
	  const catalyst = res.locals.catalyst;
	  const table = catalyst.datastore().table("Restaurants");
	  await table.deleteRow(restaurant_id);
	  res.status(200).send({
		code: 2000,
		info: "Deleted the row successfully",
		data: {},
	  });
	} catch (err) {
	  console.log(err);
	  res.status(500).send({
		err,
		code: 5000,
		info: "Some error occurred",
		data: {},
	  });
	}
  });

module.exports = app;
