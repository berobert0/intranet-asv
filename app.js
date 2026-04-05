const API="https://script.google.com/macros/s/AKfycbynTdm4U_wGx-CKkdH9nffk69MjscLkFPMXIE95w2jitmoM0-SF99KGKnB4lXiuJ9LgRg/exec";

// LOGIN
function login(){

fetch(API+`?action=loginPadre&dni=${usuario.value}&password=${password.value}`)
.then(r=>r.json())
.then(data=>{

if(!data.error){iniciarSesion(data);return;}

fetch(API+`?action=loginDocente&user=${usuario.value}&pass=${password.value}`)
.then(r=>r.json())
.then(d=>{
if(d.error){alert("Datos incorrectos");return;}
iniciarSesion(d);
});

});
}

// SESIÓN
function iniciarSesion(u){
localStorage.setItem("user",JSON.stringify(u));

loginDiv.style.display="none";
panel.classList.remove("hidden");

bienvenida.innerHTML="Bienvenido "+u.nombre;

if(u.tipo==="padre") cargarPadre(u);
else cargarDocente(u);
}

// PADRE
function cargarPadre(u){
fetch(API+"?action=comunicados")
.then(r=>r.json())
.then(data=>{
contenido.innerHTML="";

data.filter(c=>c.grado==u.grado && c.seccion==u.seccion)
.forEach(c=>{
contenido.innerHTML+=`
<div class="card">
<span class="badge">${c.grado}° ${c.seccion}</span>
<h4>${c.titulo}</h4>
<p>${c.mensaje}</p>
<textarea id="r${c.id}"></textarea>
<button onclick="responder(${c.id},'${u.dni}')">Enviar</button>
</div>`;
});
});
}

// DOCENTE
function cargarDocente(u){
contenido.innerHTML=`
<div class="card">
<h4>Nuevo Comunicado</h4>
<input id="titulo">
<textarea id="mensaje"></textarea>
<button onclick="publicar()">Publicar</button>
<button onclick="verRespuestas()">Ver respuestas</button>

<h4>Registrar Alumno</h4>
<input id="dniA">
<input id="nombreA">
<input id="gradoA">
<input id="seccionA">
<input id="passA">
<button onclick="crearAlumno()">Crear</button>

<div id="respuestas"></div>
</div>`;
window.doc=u;
}

// FUNCIONES
function publicar(){
fetch(API,{method:"POST",
body:JSON.stringify({
action:"guardarComunicado",
titulo:titulo.value,
mensaje:mensaje.value,
grado:doc.grado,
seccion:doc.seccion
})}).then(()=>alert("Publicado"));
}

function responder(id,dni){
fetch(API,{method:"POST",
body:JSON.stringify({
action:"guardarRespuesta",
idComunicado:id,
dni:dni,
respuesta:document.getElementById("r"+id).value
})}).then(()=>alert("Enviado"));
}

function crearAlumno(){
fetch(API,{method:"POST",
body:JSON.stringify({
action:"crearAlumno",
dni:dniA.value,
nombre:nombreA.value,
grado:gradoA.value,
seccion:seccionA.value,
password:passA.value
})}).then(()=>alert("Alumno creado"));
}

function verRespuestas(){
fetch(API+"?action=respuestas")
.then(r=>r.json())
.then(data=>{
respuestas.innerHTML="";
data.forEach(r=>{
respuestas.innerHTML+=`
<div class="card">
<b>${r.nombre}</b><br>
${r.respuesta}
</div>`;
});
});
}

function logout(){
localStorage.removeItem("user");
location.reload();
}

window.onload=()=>{
const u=JSON.parse(localStorage.getItem("user"));
if(u) iniciarSesion(u);
};
