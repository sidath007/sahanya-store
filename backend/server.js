const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));


/* =========================================================
   HOME
========================================================= */

app.get("/", (req, res) => {

    res.json({
        message: "Sahanya Store API is running"
    });

});


/* =========================================================
   DATABASE TEST
========================================================= */

app.get("/api/test-db", async (req, res) => {

    try {

        const result =
            await pool.query("SELECT NOW()");

        res.json({
            success: true,
            message: "PostgreSQL connected successfully",
            time: result.rows[0].now
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});


/* =========================================================
   GET ALL ACCOUNTS
========================================================= */

app.get("/api/accounts", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT *
            FROM accounts
            ORDER BY id DESC
        `);

        const accounts = result.rows.map(account => ({

            id: String(account.id),

            name:
                account.name ||
                `Account #${account.id}`,

            game:
                account.game ||
                "FREE FIRE",

            server:
                account.server ||
                "SG",

            level:
                account.level ?? "",

            evo:
                account.evo_guns ?? "",

            emotes:
                account.emotes ?? "",

            bundles:
                account.bundles || "",

            description:
                account.description || "",

            price:
                account.price ?? 0,

            image:
                account.image_url || "",

            status:
                account.status ||
                "available",

            featured:
                Boolean(account.featured)

        }));

        res.json(accounts);

    } catch (error) {

        console.error(
            "GET ACCOUNTS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});


/* =========================================================
   ADD ACCOUNT
========================================================= */

app.post("/api/accounts", async (req, res) => {

    try {

        const {
            name,
            game,
            server,
            level,
            evo,
            emotes,
            bundles,
            price,
            description,
            image,
            status,
            featured
        } = req.body;


        if (!name) {

            return res.status(400).json({
                success: false,
                error: "Account name is required"
            });

        }


        const result = await pool.query(
            `
            INSERT INTO accounts
            (
                name,
                game,
                server,
                level,
                evo_guns,
                emotes,
                bundles,
                description,
                price,
                image_url,
                status,
                featured,
                updated_at
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10,
                $11,
                $12,
                CURRENT_TIMESTAMP
            )

            RETURNING *
            `,
            [
                name,
                game || "FREE FIRE",
                server || "SG",
                Number(level) || 0,
                Number(evo) || 0,
                Number(emotes) || 0,
                bundles || "0",
                description || "",
                Number(price) || 0,
                image || "",
                status || "available",
                Boolean(featured)
            ]
        );


        const account = result.rows[0];


        res.status(201).json({

            success: true,

            message:
                "Account added successfully",

            account: {

                id:
                    String(account.id),

                name:
                    account.name,

                game:
                    account.game,

                server:
                    account.server,

                level:
                    account.level,

                evo:
                    account.evo_guns,

                emotes:
                    account.emotes,

                bundles:
                    account.bundles,

                description:
                    account.description,

                price:
                    account.price,

                image:
                    account.image_url,

                status:
                    account.status,

                featured:
                    account.featured

            }

        });

    } catch (error) {

        console.error(
            "ADD ACCOUNT ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});


/* =========================================================
   UPDATE ACCOUNT
========================================================= */

app.put("/api/accounts/:id", async (req, res) => {

    try {

        const id =
            Number(req.params.id);


        if (!Number.isInteger(id)) {

            return res.status(400).json({
                success: false,
                error: "Invalid account ID"
            });

        }


        const {
            name,
            game,
            server,
            level,
            evo,
            emotes,
            bundles,
            price,
            description,
            image,
            status,
            featured
        } = req.body;


        const result = await pool.query(
            `
            UPDATE accounts

            SET
                name = $1,
                game = $2,
                server = $3,
                level = $4,
                evo_guns = $5,
                emotes = $6,
                bundles = $7,
                description = $8,
                price = $9,
                image_url = $10,
                status = $11,
                featured = $12,
                updated_at = CURRENT_TIMESTAMP

            WHERE id = $13

            RETURNING *
            `,
            [
                name,
                game || "FREE FIRE",
                server || "SG",
                Number(level) || 0,
                Number(evo) || 0,
                Number(emotes) || 0,
                bundles || "0",
                description || "",
                Number(price) || 0,
                image || "",
                status || "available",
                Boolean(featured),
                id
            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                error: "Account not found"
            });

        }


        const account =
            result.rows[0];


        res.json({

            success: true,

            message:
                "Account updated successfully",

            account: {

                id:
                    String(account.id),

                name:
                    account.name,

                game:
                    account.game,

                server:
                    account.server,

                level:
                    account.level,

                evo:
                    account.evo_guns,

                emotes:
                    account.emotes,

                bundles:
                    account.bundles,

                description:
                    account.description,

                price:
                    account.price,

                image:
                    account.image_url,

                status:
                    account.status,

                featured:
                    account.featured

            }

        });

    } catch (error) {

        console.error(
            "UPDATE ACCOUNT ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});


/* =========================================================
   DELETE ACCOUNT
========================================================= */

app.delete("/api/accounts/:id", async (req, res) => {

    try {

        const id =
            Number(req.params.id);


        if (!Number.isInteger(id)) {

            return res.status(400).json({
                success: false,
                error: "Invalid account ID"
            });

        }


        const result = await pool.query(
            `
            DELETE FROM accounts
            WHERE id = $1
            RETURNING id
            `,
            [id]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                error: "Account not found"
            });

        }


        res.json({

            success: true,

            message:
                "Account deleted successfully",

            id:
                String(id)

        });

    } catch (error) {

        console.error(
            "DELETE ACCOUNT ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});


/* =========================================================
   START SERVER
========================================================= */

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(
            `Sahanya Store API running on http://localhost:${PORT}`
        );

    }
);