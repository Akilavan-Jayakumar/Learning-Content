const catalystSDK = require("zcatalyst-sdk-node");
const express = require("express");
const app = express();

app.use(express.json());

app.put("/update", async (req, res) => {
  try {
    const restaurant_id = req.query.restaurant_id;
    const { email, name, phone, menus, city, address, rating } = req.body;

    const catalyst = catalystSDK.initialize(app);

    const zcql = catalyst.zcql();

    const datastore = catalyst.datastore();
    const menusTable = datastore.table("Menus");
    const restaurantsTable = datastore.table("Restaurants");

    const deleteQuery = `DELETE FROM Menus WHERE Menus.restaurant_id = '${restaurant_id}'`;
    const query = `SELECT * FROM Restaurants WHERE Restaurants.email = '${email}'`;
    const queryResponse = await zcql.executeZCQLQuery(query);
    if (queryResponse.length) {
      if (queryResponse[0].Restaurants.ROWID !== restaurant_id) {
        res.status(200).send({
          code: 2001,
          info: "Email already exists",
          data: {},
        });
        return;
      }
    }
    await restaurantsTable.updateRow({
      ROWID: restaurant_id,
      name,
      email,
      phone,
      city,
      rating,
      address,
    });

    await zcql.executeZCQLQuery(deleteQuery);
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
      info: "Updated successfully",
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
