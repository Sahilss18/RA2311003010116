const express = require("express");
const axios = require("axios");
const knapsack = require("./solver");
const Log = require("../logging_middleware/logger");

const app = express();
app.use(express.json());

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzczcyMjdAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMTI3NiwiaWF0IjoxNzc3NzAwMzc2LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZWU5YjhlNzMtZjcyMC00ZGRiLTljNGYtZjZkMDUwNmFiYjdhIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2FoaWwgc2luZ2giLCJzdWIiOiI3NjhlY2E2Yi0yNGU1LTRkOTYtYjk0Yi1kYzc3NzhjNzZhZWYifSwiZW1haWwiOiJzczcyMjdAc3JtaXN0LmVkdS5pbiIsIm5hbWUiOiJzYWhpbCBzaW5naCIsInJvbGxObyI6InJhMjMxMTAwMzAxMDExNiIsImFjY2Vzc0NvZGUiOiJRa2JweEgiLCJjbGllbnRJRCI6Ijc2OGVjYTZiLTI0ZTUtNGQ5Ni1iOTRiLWRjNzc3OGM3NmFlZiIsImNsaWVudFNlY3JldCI6IldieWdmYVpRbVBYdGtHQmoifQ.Zc5OzFuWhQ0MPcBLzKIbWZvc7VL_whnmswV5_5F45l4";

app.get("/schedule", async (req, res) => {
    try {
        await Log("backend", "info", "route", "Schedule API called", TOKEN);

        const depotRes = await axios.get(
            "http://20.207.122.201/evaluation-service/depots",
            { headers: { Authorization: `Bearer ${TOKEN}` } }
        );

        const vehicleRes = await axios.get(
            "http://20.207.122.201/evaluation-service/vehicles",
            { headers: { Authorization: `Bearer ${TOKEN}` } }
        );

        const depots = depotRes.data.depots;
        const vehicles = vehicleRes.data.vehicles;

        let result = [];

        for (let depot of depots) {
            await Log("backend", "debug", "service", `Processing depot ${depot.ID}`, TOKEN);

            const maxImpact = knapsack(vehicles, depot.MechanicHours);

            result.push({
                depotId: depot.ID,
                maxImpact: maxImpact
            });
        }

        await Log("backend", "info", "controller", "Schedule computed", TOKEN);

        res.json(result);

    } catch (err) {
        await Log("backend", "error", "handler", err.message, TOKEN);
        res.status(500).send("Error");
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});