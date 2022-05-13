const { Router } = require("express");
const router = Router();

const {
  getClientes_spa,
  getClientes_control,
  getTickets,
  getInfoCliente,
  getTicketsUsuario,
  getUsuario,
  login,
  getTicketsPendientes,
  getTicketsRealizados
} = require("../controllers/index.controller");

router.get("/clientes_spa", getClientes_spa);
router.get("/clientes_control", getClientes_control);
router.get("/tickets", getTickets);
router.get("/tickets-pendientes/:usuario", getTicketsPendientes);
router.get("/tickets-realizados/:usuario", getTicketsRealizados);

router.get("/cliente/:id", getInfoCliente);
router.get("/tickets/:usuario", getTicketsUsuario);
router.get("/usuario/:id", getUsuario);
router.post("/login", login);

module.exports = router;
