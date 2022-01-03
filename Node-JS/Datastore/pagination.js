const catalystSDK = require("zcatalyst-sdk-node");
const express = require("express");
const app = express();

app.use(express.json());

app.get("/all", async (req, res) => {
  try {
    const rowsPerPage = parseInt(req.query.rowsPerPage);
    let currentPage = parseInt(req.query.currentPage);

    const catalyst = catalystSDK.initialize(req);

    const zcql = catalyst.zcql();

    const countQuery = `SELECT COUNT(Restaurants.ROWID) FROM Restaurants`;
    const countResponse = await zcql.executeZCQLQuery(countQuery);

    const total = parseInt(countResponse[0].Restaurants.ROWID);
    if (total) {
      const totalPages = Math.ceil(total / rowsPerPage);
      if (currentPage > totalPages) {
        currentPage = totalPages;
      }
      const startIndex = currentPage * rowsPerPage + 1;
      const dataQuery = `SELECT Restaurants.ROWID,Restaurants.name,Restaurants.phone,
                         Restaurants.city,Restaurants.rating,Restaurants.email 
                         FROM Restaurants 
                         LIMIT ${startIndex},${rowsPerPage}`;
      const dataResponse = await zcql.executeZCQLQuery(dataQuery);
      res.status(200).send({
        code: 2000,
        info: "Fetched data successfully",
        data: {
          data: dataResponse.map((item) => {
            const {
              ROWID,
              name: restaurant,
              phone: contact_number,
              email: contact_email,
              city,
              rating,
            } = item.Restaurants;

            return {
              ROWID,
              restaurant,
              contact_email,
              contact_number,
              city,
              rating: `${rating} / 5`,
            };
          }),
          currentPage,
          total,
        },
      });
    } else {
      res.status(200).send({
        code: 4000,
        info: "No records found",
        data: {},
      });
    }
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
