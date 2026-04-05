const API="https://script.google.com/macros/s/AKfycbzhabdY66pe7xG9mVkhFt0Gz-9P5s-KsjooeQpcvhsMjg3u-CqGnhCd2pO5HDz8EIlqJQ/exec";

// LOGIN
function login(){

fetch(API+`?action=loginPadre&dni=${usuario.value}&password=${password.value}`)
.then(r=>r.json())
.then(d=>{

if(!d.error){start(d);return;}

fetch(API+`?action=loginDocente&user=${usuario.value}&pass=${password.value}`)
.then(r=>r.json())
.then(x=>{
if(x.error){alert("Datos incorrectos");return;}
start(x);
});

});
}

// INICIO
function start(u){
localStorage.setItem("u",JSON.stringify(u));

loginDiv.style.display="none";
panel.classList.remove("hidden");

bienvenida.innerHTML="Bienvenido "+u.nombre;

if(u.tipo=="padre") cargar(u);
else docente(u);
}

// PADRE
function cargar(u){
fetch(API+"?action=comunicados")
.then(r=>r.json())
.then(data=>{
contenido.innerHTML="";

data.filter(c=>c.grado==u.grado && c.seccion==u.seccion)
.forEach(c=>{
contenido.innerHTML+=`
<div class="card">
<h4>${c.titulo}</h4>
<p>${c.mensaje}</p>
<textarea id="r${c.id}"></textarea>
<button onclick="responder(${c.id},'${u.dni}')">Responder</button>
</div>`;
});
});
}

// DOCENTE
function docente(u){
contenido.innerHTML=`
<div class="card">
<h4>Nuevo Comunicado</h4>
<input id="titulo">
<textarea id="mensaje"></textarea>
<button onclick="publicar()">Publicar</button>

<h4>Registrar Alumno</h4>
<input id="dniA">
<input id="nombreA">
<input id="gradoA">
<input id="seccionA">
<button onclick="crear()">Crear</button>

<div id="respuestas"></div>
<button onclick="verRespuestas()">Ver respuestas</button>
</div>
`;
window.doc=u;
}

// FUNCIONES
function publicar(){
fetch(API,{
method:"POST",
body:JSON.stringify({
action:"guardarComunicado",
titulo:titulo.value,
mensaje:mensaje.value,
grado:doc.grado,
seccion:doc.seccion
})
}).then(()=>alert("Publicado"));
}

function responder(id,dni){
fetch(API,{
method:"POST",
body:JSON.stringify({
action:"guardarRespuesta",
idComunicado:id,
dni:dni,
respuesta:document.getElementById("r"+id).value
})
}).then(()=>alert("Enviado"));
}

function crear(){
fetch(API,{
method:"POST",
body:JSON.stringify({
action:"crearAlumno",
dni:dniA.value,
nombre:nombreA.value,
grado:gradoA.value,
seccion:seccionA.value
})
}).then(()=>alert("Alumno creado"));
}

function verRespuestas(){
fetch(API+"?action=respuestas")
.then(r=>r.json())
.then(data=>{
respuestas.innerHTML="";
data.forEach(r=>{
respuestas.innerHTML+=`
<div class="card">
<b>${r.nombre}</b><br>${r.respuesta}
</div>`;
});
});
}

function logout(){
localStorage.removeItem("u");
location.reload();
}
