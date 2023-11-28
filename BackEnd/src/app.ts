import express from "express";
import appConfig from "./2-utils/app-config";
import catchAll from "./4-middleware/catch-all";
import routeNotFound from "./4-middleware/route-not-found";
import productsController from "./6-controllers/products-controller";
import authController from "./6-controllers/auth-controller";
import { fileSaver } from "uploaded-file-saver";
import expressFildUpload from "express-fileupload"
import path from "path";
import cors from "cors";

// Creating the server: 
const server = express();

server.use(cors())

fileSaver.config(path.join(__dirname, "1-assets", "images"))

// Creating a request.body object containing the request body data:
server.use(express.json());

server.use(expressFildUpload())

// Connect our controllers: 
server.use("/api", productsController, authController)

// Route not found: 
server.use(routeNotFound);

// Catch all middleware: 
server.use(catchAll);

// Running the server: 
server.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));