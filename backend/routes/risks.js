const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 查某資產的所有風險
router.get("/assets/:assetId/risks", (req, res) => {

  const { assetId } = req.params;

  const sql = `
    SELECT *
    FROM risk_assessments
    WHERE asset_id = ?
  `;

  db.query(sql, [assetId], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);

  });

});


// // 新增風險
// router.post("/assets/:assetId/risks", (req, res) => {

//   const { assetId } = req.params;
//   const { threat, vulnerability, risk_value } = req.body;

//   const sql = `
//     INSERT INTO risk_assessments
//     (asset_id, threat, vulnerability, risk_value)
//     VALUES (?, ?, ?, ?)
//   `;

//   db.query(
//     sql,
//     [assetId, threat, vulnerability, risk_value],
//     (err, result) => {

//       if (err) {
//         return res.status(500).json(err);
//       }

//       res.json({
//         message: "新增風險成功",
//         id: result.insertId
//       });

//     }
//   );

// });


// 修改風險
router.put("/risks/:id", (req, res) => {

  const { id } = req.params;
  const { threat, vulnerability, risk_value } = req.body;

  const sql = `
    UPDATE risk_assessments
    SET
      threat = ?,
      vulnerability = ?,
      risk_value = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [threat, vulnerability, risk_value, id],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({ message: "修改成功" });

    }
  );

});


// 刪除風險
router.delete("/risks/:id", (req, res) => {

  const { id } = req.params;

  const sql = `
    DELETE FROM risk_assessments
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json({ message: "刪除成功" });

  });

});

module.exports = router;