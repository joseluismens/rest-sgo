const crypto = require("crypto");

const {
  controlchile,
  control,
  sgochile,
  sgo2,
} = require("../databases/databases");

const getClientes_spa = async (req, res) => {
  const clientes_spa = await controlchile.query(
    "SELECT codigo_abonado, nombre, razon_social, giro, direccion, ciudad, comuna, region, rut, rep_legal, rut_rep_legal,tel_movil,fecha_ingreso,fecha_pago,valor_equipo,valor_mensualidad,correo,cod_ejec_venta,tipo_cliente,estado,email_rlegal FROM clientes "
  );
  res.status(200).json(clientes_spa.rows);
};
const getClientes_control = async (req, res) => {
  const clientes_control = await control.query("SELECT * FROM clientes ");
  res.status(200).json(clientes_control.rows);
};
const getTickets = async (req, res) => {
  const tickets = await control.query("SELECT * FROM tickets ");
  res.status(200).json(tickets.rows);
};

const getTicketsPendientes = async (req, res) => {
  const { usuario } = req.params;
  let tickets_control = await control.query(
    "SELECT * FROM tickets WHERE usuario_destino=$1 and estado = $2 ",
    [usuario, "pendiente"]
  );
  if (tickets_control.rows == 0) {
    tickets_control = {};
  }
  let tickets_spa = await controlchile.query(
    "SELECT * FROM tickets WHERE usuario_destino=$1 and estado = $2 ",
    [usuario, "pendiente"]
  );
  if (tickets_spa.rows == 0) {
    tickets_spa = {};
  }
  const tickets = { ...tickets_control.rows, ...tickets_spa.rows };

  res.status(200).json(tickets);
};
const getTicketsRealizados = async (req, res) => {
  const { usuario } = req.params;
  const tickets_control = await control.query(
    "SELECT * FROM tickets WHERE usuario=$1 and estado = $2 ",
    [usuario, "cerrado"]
  );
  const tickets_spa = await controlchile.query(
    "SELECT * FROM tickets WHERE usuario=$1 and estado = $2 ",
    [usuario, "cerrado"]
  );

  const tickets = { ...tickets_control.rows, ...tickets_spa.rows };

  res.status(200).json(tickets);
};
const getUsuario = async (req, res) => {
  const { id } = req.params;
  info = await sgochile.query("SELECT * FROM usuario where id = $1 ", [id]);
  res.status(200).json(info.rows);
};
const getInfoCliente = async (req, res) => {
  const abonado = req.params.id;
  let info;
  if (abonado >= 3000) {
    info = await controlchile.query(
      "SELECT * FROM clientes where codigo_abonado = $1 ",
      [abonado]
    );
  } else {
    info = await control.query(
      "SELECT * FROM clientes where codigo_abonado = $1 ",
      [abonado]
    );
  }
  res.status(200).json(info.rows[0]);
};
const getTicketsUsuario = async (req, res) => {
  const usuario = req.paramas.abonado;

  const tickets = await control.query("SELECT * FROM tickets ");
  res.status(200).json(tickets.rows);
};
const login = async (req, res) => {
  const { usuario, password } = req.body;
  console.log({ usuario, password });
  const hash = crypto
    .createHash("md5")
    .update(password, "binary")
    .digest("hex");
  console.log(hash);
  const query = await sgochile.query(
    "SELECT id,nombres,apellidos,codigo_venta,nivel1,img_perfil,usuario FROM usuario WHERE usuario=$1 and password = $2",
    [usuario, hash]
  );

  res.status(200).json({ usuario: query.rows[0] });
};
const getUsuarios = async (req, res) => {
  const usuarios = await sgo2.query(
    "SELECT nombres,apellidos,usuario FROM usuario where estado =$1",
    ["activo"]
  );
  res.status(200).json(usuarios.rows);
};

module.exports = {
  getClientes_spa,
  getClientes_control,
  getTickets,
  getInfoCliente,
  getTicketsUsuario,
  getUsuario,
  login,
  getTicketsPendientes,
  getTicketsRealizados,
  getUsuarios,
  getInfoCliente
};
