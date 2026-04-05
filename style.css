const API = "https://script.google.com/macros/s/AKfycbyKVIhWHTaKxIDu1RMGkyaBk_dY0Ur-a-t8l52NSWel3tmd_TsSa-br40DFsgWF2kDCeg/exec";

// LOGIN
function login(){

  fetch(API+`?action=loginPadre&dni=${usuario.value}&password=${password.value}`)
  .then(r=>r.json())
  .then(data=>{

    if(!data.error){
      iniciarSesion(data);
      return;
    }

    // probar docente
    fetch(API+`?action=loginDocente&user=${usuario.value}&pass=${password.value}`)
    .then(r=>r.json())
    .then(d=>{
      if(d.error){
        alert("Datos incorrectos");
        return;
      }
      iniciarSesion(d);
    });

  });
}

// INICIAR SESIÓN
function iniciarSesion(user){

  localStorage.setItem("user", JSON.stringify(user));

  document.getElementById("login").classList.add("hidden");
  document.getElementById("panel").classList.remove("hidden");

  document.getElementById("bienvenida").innerHTML = "Bienvenido " + user.nombre;

  if(user.tipo === "padre"){
    cargarPadre(user);
  }else{
    cargarDocente(user);
  }
}

// PADRE
function cargarPadre(u){

  fetch(API+"?action=comunicados")
  .then(r=>r.json())
  .then(data=>{

    const cont = document.getElementById("contenido");
    cont.innerHTML = "";

    data
    .filter(c => c.grado == u.grado && c.seccion == u.seccion)
    .forEach(c => {

      cont.innerHTML += `
      <div class="card">
        <span class="badge">${c.grado}° ${c.seccion}</span>
        <h4>${c.titulo}</h4>
        <p>${c.mensaje}</p>

        <textarea id="r${c.id}" placeholder="Responder"></textarea>
        <button onclick="responder(${c.id},'${u.dni}')">Enviar</button>
      </div>`;
    });

  });
}

// DOCENTE
function cargarDocente(u){

  const cont = document.getElementById("contenido");

  cont.innerHTML = `
  <div class="card">
    <h4>Nuevo Comunicado</h4>
    <input id="titulo" placeholder="Título">
    <textarea id="mensaje" placeholder="Mensaje"></textarea>
    <input id="archivo" placeholder="Link archivo">

    <button onclick="publicar()">Publicar</button>
    <button onclick="verRespuestas()">Ver respuestas</button>

    <div id="respuestas"></div>
  </div>
  `;

  window.doc = u;
}

// PUBLICAR
function publicar(){

  fetch(API,{
    method:"POST",
    body:JSON.stringify({
      action:"guardarComunicado",
      titulo:document.getElementById("titulo").value,
      mensaje:document.getElementById("mensaje").value,
      grado:doc.grado,
      seccion:doc.seccion,
      archivo:document.getElementById("archivo").value
    })
  }).then(()=>alert("Publicado"));
}

// RESPONDER
function responder(id, dni){

  const texto = document.getElementById("r"+id).value;

  fetch(API,{
    method:"POST",
    body:JSON.stringify({
      action:"guardarRespuesta",
      idComunicado:id,
      dni:dni,
      respuesta:texto
    })
  }).then(()=>alert("Respuesta enviada"));
}

// VER RESPUESTAS
function verRespuestas(){

  fetch(API+"?action=respuestas")
  .then(r=>r.json())
  .then(data=>{

    const div = document.getElementById("respuestas");
    div.innerHTML = "";

    data.forEach(r => {
      div.innerHTML += `
      <div class="card">
        <b>${r.nombre}</b><br>
        ${r.respuesta}
      </div>`;
    });

  });
}

// LOGOUT
function logout(){
  localStorage.removeItem("user");
  location.reload();
}

// AUTO LOGIN
window.onload = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if(user){
    iniciarSesion(user);
  }
};
