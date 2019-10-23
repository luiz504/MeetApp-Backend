import { Router } from "express";

const routes = new Router();

routes.get("/", (req, res) => {
  return res.json({ msg: "hello World" });
});

export default routes;
