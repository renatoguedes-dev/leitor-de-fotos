import express from "express";
import routes from "./routes";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

dotenv.config();

const PORT = 3000;

const server = express();

server.use(cors());

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use(routes);
server.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
