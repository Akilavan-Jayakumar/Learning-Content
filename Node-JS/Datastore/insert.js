const catalystSDK = require("zcatalyst-sdk-node");
const express = require("express");
const app = express();

app.use(express.json());

app.post("/insert", async (req, res) => {
  try {
    const { email, name, phone, menus, city, address, rating } = req.body;

    const catalyst = catalystSDK.initialize(req);

    const zcql = catalyst.zcql();

    const datastore = catalyst.datastore();
    const menusTable = datastore.table("Menus");
    const restaurantsTable = datastore.table("Restaurants");

    const query = `SELECT * FROM Restaurants WHERE Restaurants.email = '${email}'`;
    const queryResponse = await zcql.executeZCQLQuery(query);
    if (queryResponse.length) {
      res.status(200).send({
        code: 2001,
        info: "Email already exists",
        data: {},
      });
      return;
    }
    const { ROWID: restaurant_id } = await restaurantsTable.insertRow({
      name,
      email,
      phone,
      city,
      rating,
      address,
    });

    await menusTable.insertRows(
      menus.map((item) => {
        return {
          ...item,
          restaurant_id,
        };
      })
    );

    res.status(200).send({
      code: 2000,
      info: "Inserted successfully",
      data: {
        ROWID: restaurant_id.toString(),
        restaurant: name,
        contact_email: email,
        contact_number: phone,
        city,
        rating: rating + " / 5",
      },
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
