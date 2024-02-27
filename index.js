const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.v6mnx4h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "pages" directory
app.use(express.static(__dirname + "/pages"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const registrationData = new Registration({
            name,
            email,
            password,
        });
        await registrationData.save();
        console.log("Registration successful"); // Debugging message
        res.sendFile(__dirname + "/pages/success.html");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
