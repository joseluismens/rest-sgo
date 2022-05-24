const crypto = require("crypto");

const {
  controlchile,
  control,
  sgochile,
  sgo2,
  venus,
  urano,
  saturno,
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
  
  let tickets_spa = await controlchile.query(
    "SELECT * FROM tickets WHERE usuario_destino=$1 and estado = $2 ",
    [usuario, "pendiente"]
  );
  
  const tickets =  [...tickets_control.rows, ...tickets_spa.rows ];

  res.status(200).json({"tickets":tickets});
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

  const tickets = [ ...tickets_control.rows, ...tickets_spa.rows ];

  res.status(200).json({"tickets":tickets});
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
  const usuario = req.params.abonado;

  const tickets = await control.query("SELECT * FROM tickets ");
  res.status(200).json(tickets.rows);
};
const login = async (req, res) => {
  const { usuario, password } = req.body;
  const hash = crypto
    .createHash("md5")
    .update(password, "binary")
    .digest("hex");
  const query = await sgochile.query(
    "SELECT id,nombres,apellidos,codigo_venta,nivel1,img_perfil,usuario FROM usuario WHERE usuario=$1 and password = $2",
    [usuario, hash]
  );

  res.status(200).json({ usuario: query.rows[0] });
};
const getUsuariosEmpresa = async (req, res) => {
  const abonado = req.params.id;
  let usuarios = [];

  const empresa_venus = await venus.query(
    "SELECT id_empresa,nombre FROM empresa WHERE codigo_abonado = $1",
    [abonado]
  );
  if (empresa_venus.rowCount > 0) {
    empresa_venus.rows.forEach(async (element) => {
      const usuario = await venus.query(
        "SELECT id_usuario,login,password,status,tipo_user,nombre,apellido FROM usuario where id_empresa= $1",
        [element.id_empresa]
      );
      usuario.rows.forEach((element) => {
        usuarios.push({
          id_usuario: element.id_usuario,
          login: element.login,
          password: element.password,
          status: element.status,
          tipo_user: element.tipo_user,
          nombre: element.nombre + " " + element.apellido,
          servidor: "V",
        });
      });
    });
  }

  const empresa_urano = await urano.query(
    "SELECT id_empresa,nombre FROM empresa WHERE codigo_abonado = $1",
    [abonado]
  );
  if (empresa_urano.rowCount > 0) {
    empresa_urano.rows.forEach(async (element) => {
      const usuario = await urano.query(
        "SELECT id_usuario,login,password,status,tipo_user,nombre,apellido FROM usuario where id_empresa= $1",
        [element.id_empresa]
      );
      usuario.rows.forEach((element) => {
        usuarios.push({
          id_usuario: element.id_usuario,
          login: element.login,
          password: element.password,
          status: element.status,
          tipo_user: element.tipo_user,
          nombre: element.nombre + " " + element.apellido,
          servidor: "U",
        });
      });
    });
  }
  const empresa_saturno = await saturno.query(
    "SELECT id_empresa,nombre FROM empresa WHERE codigo_abonado = $1",
    [abonado]
  );
  if (empresa_saturno.rowCount > 0) {
    empresa_saturno.rows.forEach(async (element) => {
      const usuario = await saturno.query(
        "SELECT id_usuario,login,password,status,tipo_user,nombre,apellido FROM usuario where id_empresa= $1",
        [element.id_empresa]
      );
      usuario.rows.forEach((element) => {
        usuarios.push({
          id_usuario: element.id_usuario,
          login: element.login,
          password: element.password,
          status: element.status,
          tipo_user: element.tipo_user,
          nombre: element.nombre + " " + element.apellido,
          servidor: "S",
        });
      });
    });
  }
  res.status(200).json({ usuarios: usuarios });
};


const getMovilesEmpresa = async (req,res)=>{
  const {abonado} = req.params;
  let moviles = [];
  const moviles_venus = await venus.query(`
  SELECT * FROM vehiculo WHERE abonado = ${abonado} and not patente 
  like '% CUN%' order by patente asc
  `);
  if(moviles_venus.rowCount > 0){
    moviles_venus.rows.forEach((element) => {
        moviles.push ({
          "servidor":"v",
          "status":element.habilitado,
          "patente":element.patente,
          "avl":element.id_avl,
          "fecha_instalacion":element.fecha_instalacion
        });
    });
  }
  const moviles_urano = await urano.query(`
  SELECT * FROM vehiculo WHERE abonado = ${abonado} and not patente 
  like '% CUN%' order by patente asc
  `);
  if(moviles_urano.rowCount > 0){
    moviles_urano.rows.forEach((element) => {
        moviles.push ({
          "servidor":"U",
          "status":element.habilitado,
          "patente":element.patente,
          "avl":element.id_avl,
           "fecha_instalacion":element.fecha_instalacion
        });
    });
  }
 
  const moviles_saturno = await saturno.query(`
  SELECT * FROM vehiculo WHERE abonado = ${abonado} and not patente 
  like '% CUN%' order by patente asc
  `);
  if(moviles_saturno.rowCount > 0){
    moviles_saturno.rows.forEach((element) => {
        moviles.push ({
          "servidor":"S",
          "status":element.habilitado,
          "patente":element.patente,
          "avl":element.id_avl,
           "fecha_instalacion":element.fecha_instalacion
        });
    });
  }
  res.status(200).json({"moviles":moviles});

}
const getUsuarios = async (req, res) => {
  const usuarios = await sgo2.query(
    "SELECT nombres,apellidos,usuario FROM usuario where estado =$1",
    ["activo"]
  );
  res.status(200).json(usuarios.rows);
};

const getClientesSuspendidos =  async (req,res)=>{
  const codigo_venta = req.params.codigo_venta;
  let clientes =[];
  if (codigo_venta=="000") {
    let clientes_sgo = await controlchile.query("SELECT * FROM clientes WHERE spf=1");
    let clientes_ltda = await control.query("SELECT * FROM clientes WHERE spf=1");
    clientes = [...clientes_sgo.rows, ...clientes_ltda.rows]

  }
  else{
    let clientes_sgo = await controlchile.query("SELECT * FROM clientes WHERE spf=1 and cod_ejec_venta = $1",[codigo_venta]);
    let clientes_ltda = await control.query("SELECT * FROM clientes WHERE spf=1 and cod_ejec_venta = $1",[codigo_venta]);
    clientes = [...clientes_sgo.rows, ...clientes_ltda.rows]

  }
  res.status(200).json({"suspendidos":clientes})
}
const crearTicket = async (req,res)=>{
  const last_id = await controlchile.query("SELECT max(id_ticket) FROM tickets")
  const new_id = last_id.rows[0].max+1;

  const {comentario,ticket,destinatario,enviada_por,abonado} = req.body;
  const estado = "pendiente";
  const date = new Date();
  const fecha_ingreso = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
  const hour= date.getHours();
  const minutes = date.getMinutes();
  const seconds=date.getSeconds();
  let min = minutes;
  let sec = seconds; 
  let h = hour;
  if (minutes <10) {
     min = "0"+minutes
  }
  if (seconds <10) {
    sec= "0"+seconds
 }
 if (hour <10) {
  h= "0"+hour
}
  const hora = h+":"+min+':'+sec;
  console.log(hora);
  if (ticket=="si") {
    const nuevo_ticket = await controlchile.query(`INSERT INTO tickets (id_ticket,codigo_abonado,texto,fecha_ingreso,estado,usuario,usuario_destino) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [new_id,abonado,comentario,fecha_ingreso,estado,enviada_por,destinatario]);
    return res.status(200).json({"creado":"si","message":"Ticket creado"});
    
  }else{
    const last_id_bitacora = await sgochile.query("SELECT max(id) FROM log_llamadas")

    const nueva_bitacora = await sgochile.query(`INSERT INTO log_llamadas (descripcion,abonado, usuario,fecha_ingreso,hora,estado) values ($1,$2,$3,$4,$5,$6)`,[comentario,abonado,enviada_por,fecha_ingreso,hora,estado])
    
    return res.status(200).json({"creado":"si","message":"Bitacora creada"});

  }
}

const actualizarTicket  = async (req,res)=>{


  const {id_ticket,texto,abonado,estado} = req.body;

  if (abonado >=3000) {
      actualizar = await controlchile.query("UPDATE tickets SET estado =$1,texto=$2 WHERE id_ticket=$3 and codigo_abonado=$4",[estado,texto,id_ticket,abonado]);
  }else{
      actualizar = await control.query("UPDATE tickets SET estado =$1,texto=$2 WHERE id_ticket=$3 and codigo_abonado=$4",[estado,texto,id_ticket,abonado]);

  }
  if (actualizar.rowCount>0) {
    return res.status(200).json({ "error":false   });
    
  }else{
    return res.status(200).json({ "error":true   });

  }
  console.log(actualizar);
}
const events = async (req,res)=>{
  const {usuario} = req.params;
  console.log(usuario);
  let events  = await sgochile.query("select * from events where event_for=$1 and event_type=$2",[usuario,"task"]);
  console.log(events.rows);
  if (events.rowCount>0) {
    res.status(200).json({"tareas":events.rows});
    
  }else{
    res.status(200).json({"message":"not found"});

  }
}
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
  getInfoCliente,
  getUsuariosEmpresa,
  getMovilesEmpresa,
  getClientesSuspendidos,
  crearTicket,
  events,
  actualizarTicket
};
