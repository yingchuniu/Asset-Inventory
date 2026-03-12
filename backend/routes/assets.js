console.log("assets route loaded");

const express = require("express");
const router = express.Router();
const db = require("../config/db");


//查詢

router.get("/", (req, res) => {

  const keyword = req.query.keyword;

  let sql;
  let params = [];

  if (keyword) {

    sql = `
      SELECT * FROM assets
      WHERE asset_code LIKE ?
      OR asset_name LIKE ?
      OR category LIKE ?
      OR owner LIKE ?
    `;

    const search = `%${keyword}%`;
    params = [search, search, search, search];

  } else {

    sql = "SELECT * FROM assets";

  }

  db.query(sql, params, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);

  });

});


// // 查詢單筆
// router.get("/:id", (req, res) => {
//   const { id } = req.params;

//   const sql = "SELECT * FROM assets WHERE id = ?";

//   db.query(sql, [id], (err, result) => {
//     if (err) {
//       return res.status(500).json(err);
//     }

//     if (result.length === 0) {
//       return res.status(404).json({ message: "找不到資料" });
//     }

//     res.json(result[0]);
//   });
// });

router.get("/:id", (req, res) => {

  const { id } = req.params;

  const assetSql = `
    SELECT *
    FROM assets
    WHERE id = ?
  `;

  const riskSql = `
    SELECT *
    FROM risk_assessments
    WHERE asset_id = ?
    ORDER BY risk_no ASC
  `;

  db.query(assetSql, [id], (assetErr, assetResult) => {

    if (assetErr) {
      return res.status(500).json(assetErr);
    }

    if (assetResult.length === 0) {
      return res.status(404).json({ message: "找不到資料" });
    }

    db.query(riskSql, [id], (riskErr, riskResult) => {

      if (riskErr) {
        return res.status(500).json(riskErr);
      }

      res.json({
        ...assetResult[0],
        risks: riskResult
      });

    });

  });

});

// 新增
// router.post("/", (req, res) => {

//   const {
//     asset_code,
//     category,
//     asset_name,
//     confidentiality,
//     integrity,
//     availability,
//     asset_level,
//     security_level,
//     owner,
//     risks
//   } = req.body;

//   const asset_value =
//     Number(confidentiality) +
//     Number(integrity) +
//     Number(availability);

//   const assetSql = `
//     INSERT INTO assets
//     (
//       asset_code,
//       category,
//       asset_name,
//       confidentiality,
//       integrity,
//       availability,
//       asset_value,
//       asset_level,
//       security_level,
//       owner
//     )
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   db.beginTransaction((err) => {

//     if (err) {
//       return res.status(500).json(err);
//     }

//     db.query(
//       assetSql,
//       [
//         asset_code,
//         category,
//         asset_name,
//         confidentiality,
//         integrity,
//         availability,
//         asset_value,
//         asset_level,
//         security_level,
//         owner
//       ],
//       (assetErr, assetResult) => {

//         if (assetErr) {
//           return db.rollback(() => {
//             res.status(500).json(assetErr);
//           });
//         }

//         const assetId = assetResult.insertId;

//         const riskSql = `
//           INSERT INTO risk_assessments
//           (asset_id, risk_no, threat, vulnerability, risk_value)
//           VALUES ?
//         `;

//         const riskValues = risks.map(r => [
//           assetId,
//           r.risk_no,
//           r.threat,
//           r.vulnerability,
//           r.risk_value
//         ]);

//         db.query(riskSql, [riskValues], (riskErr) => {

//           if (riskErr) {
//             return db.rollback(() => {
//               res.status(500).json(riskErr);
//             });
//           }

//           db.commit((commitErr) => {

//             if (commitErr) {
//               return db.rollback(() => {
//                 res.status(500).json(commitErr);
//               });
//             }

//             res.json({
//               message: "新增成功",
//               id: assetId
//             });

//           });

//         });

//       }
//     );

//   });

// });


// 新增
function getAssetCodePrefix(category) {
  switch (category) {
    case "資訊資產":
      return "I";
    case "系統設備":
      return "S";
    case "應用系統":
      return "A";
    default:
      return "I";
  }
}

function buildAssetCode(category, id) {
  const prefix = getAssetCodePrefix(category);
  return `${prefix}-${String(id).padStart(3, "0")}`;
}

// 新增
router.post("/", (req, res) => {
  const {
    category,
    asset_name,
    confidentiality,
    integrity,
    availability,
    asset_level,
    security_level,
    owner,
    risks
  } = req.body;

  const asset_value =
    Number(confidentiality) +
    Number(integrity) +
    Number(availability);

  const insertAssetSql = `
    INSERT INTO assets
    (
      category,
      asset_name,
      confidentiality,
      integrity,
      availability,
      asset_value,
      asset_level,
      security_level,
      owner
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json(err);
    }

    db.query(
      insertAssetSql,
      [
        category,
        asset_name,
        confidentiality,
        integrity,
        availability,
        asset_value,
        asset_level,
        security_level,
        owner
      ],
      (assetErr, assetResult) => {
        if (assetErr) {
          return db.rollback(() => {
            res.status(500).json(assetErr);
          });
        }

        const assetId = assetResult.insertId;
        const assetCode = buildAssetCode(category, assetId);

        const updateCodeSql = `
          UPDATE assets
          SET asset_code = ?
          WHERE id = ?
        `;

        db.query(updateCodeSql, [assetCode, assetId], (codeErr) => {
          if (codeErr) {
            return db.rollback(() => {
              res.status(500).json(codeErr);
            });
          }

          const riskSql = `
            INSERT INTO risk_assessments
            (
              asset_id,
              risk_no,
              threat,
              vulnerability,
              description,
              c_impact,
              i_impact,
              a_impact,
              impact_level,
              likelihood,
              risk_value
            )
            VALUES ?
          `;

          const riskValues = risks.map((r) => [
            assetId,
            r.risk_no,
            r.threat,
            r.vulnerability,
            r.description,
            r.c_impact,
            r.i_impact,
            r.a_impact,
            r.impact_level,
            r.likelihood,
            r.risk_value
          ]);

          db.query(riskSql, [riskValues], (riskErr) => {
            if (riskErr) {
              return db.rollback(() => {
                res.status(500).json(riskErr);
              });
            }

            db.commit((commitErr) => {
              if (commitErr) {
                return db.rollback(() => {
                  res.status(500).json(commitErr);
                });
              }

              res.status(201).json({
                message: "新增成功",
                id: assetId,
                asset_code: assetCode
              });
            });
          });
        });
      }
    );
  });
});

// 修改
router.put("/:id", (req, res) => {

  const id = req.params.id;

  const {
    asset_code,
    category,
    asset_name,
    confidentiality,
    integrity,
    availability,
    asset_level,
    security_level,
    owner,
    risks
  } = req.body;

  const asset_value =
    Number(confidentiality) +
    Number(integrity) +
    Number(availability);

  const assetSql = `
    UPDATE assets
    SET
      asset_code = ?,
      category = ?,
      asset_name = ?,
      confidentiality = ?,
      integrity = ?,
      availability = ?,
      asset_value = ?,
      asset_level = ?,
      security_level = ?,
      owner = ?
    WHERE id = ?
  `;

  db.beginTransaction((err) => {

    if (err) {
      return res.status(500).json(err);
    }

    db.query(
      assetSql,
      [
        asset_code,
        category,
        asset_name,
        confidentiality,
        integrity,
        availability,
        asset_value,
        asset_level,
        security_level,
        owner,
        id
      ],
      (assetErr) => {

        if (assetErr) {
          return db.rollback(() => {
            res.status(500).json(assetErr);
          });
        }

        const riskSql = `
  UPDATE risk_assessments
  SET
    threat = ?,
    vulnerability = ?,
    description = ?,
    c_impact = ?,
    i_impact = ?,
    a_impact = ?,
    impact_level = ?,
    likelihood = ?,
    risk_value = ?
  WHERE asset_id = ? AND risk_no = ?
`;

        const updates = risks.map(r => new Promise((resolve, reject) => {
          db.query(
            riskSql,
            [
              r.threat,
              r.vulnerability,
              r.description,
              r.c_impact,
              r.i_impact,
              r.a_impact,
              r.impact_level,
              r.likelihood,
              r.risk_value,
              id,
              r.risk_no
            ],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        }));

        Promise.all(updates)
          .then(() => {

            db.commit((commitErr) => {

              if (commitErr) {
                return db.rollback(() => {
                  res.status(500).json(commitErr);
                });
              }

              res.json({
                message: "修改成功"
              });

            });

          })
          .catch((riskErr) => {

            db.rollback(() => {
              res.status(500).json(riskErr);
            });

          });

      }
    );

  });

});

// 刪除
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const deleteRisksSql = `
    DELETE FROM risk_assessments
    WHERE asset_id = ?
  `;

  const deleteAssetSql = `
    DELETE FROM assets
    WHERE id = ?
  `;

  db.beginTransaction((txErr) => {
    if (txErr) {
      return res.status(500).json(txErr);
    }

    db.query(deleteRisksSql, [id], (riskErr) => {
      if (riskErr) {
        return db.rollback(() => {
          res.status(500).json(riskErr);
        });
      }

      db.query(deleteAssetSql, [id], (assetErr, result) => {
        if (assetErr) {
          return db.rollback(() => {
            res.status(500).json(assetErr);
          });
        }

        if (result.affectedRows === 0) {
          return db.rollback(() => {
            res.status(404).json({
              message: "找不到資料"
            });
          });
        }

        db.commit((commitErr) => {
          if (commitErr) {
            return db.rollback(() => {
              res.status(500).json(commitErr);
            });
          }

          res.json({
            message: "刪除成功"
          });
        });
      });
    });
  });
});
module.exports = router;