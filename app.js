const API="https://script.google.com/macros/s/AKfycby-n0olfzQzJyuXEsX-lCOEZ6DXvWJeQt8neGje1-PQKRnWbijai87_RI0-WJZ4mjzRUA/exec";

// LOGIN
function login(){

fetch(API+`?action=loginPadre&user=${usuario.value}&password=${password.value}`)
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
window.usuarioActual = u;

loginDiv.style.display="none";
panel.classList.remove("hidden");

bienvenida.innerHTML="Bienvenido "+u.nombre;

if(u.tipo=="padre") cargarPadre(u);
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
<h4>${c.titulo}</h4>
<p>${c.mensaje}</p>
<textarea id="r${c.id}"></textarea>
<button onclick="responder(${c.id})">Responder</button>
</div>`;
});

// cambiar clave
contenido.innerHTML+=`
<div class="card">
<h4>Cambiar contraseña</h4>
<input id="oldPass" type="password">
<input id="newPass" type="password">
<button onclick="cambiarPassword()">Actualizar</button>
</div>`;
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

<h4>Crear Padre</h4>
<input id="dniA" placeholder="DNI Alumno">
<input id="nombreA" placeholder="Nombre Padre">
<input id="userA" placeholder="Usuario">
<input id="passA" placeholder="Contraseña">
<button onclick="crearPadre()">Crear</button>

<div id="respuestas"></div>
<button onclick="verRespuestas()">Ver respuestas</button>
</div>`;
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

function responder(id){
fetch(API,{
method:"POST",
body:JSON.stringify({
action:"guardarRespuesta",
idComunicado:id,
usuario:usuarioActual.usuario,
respuesta:document.getElementById("r"+id).value
})
}).then(()=>alert("Enviado"));
}

function crearPadre(){
fetch(API,{
method:"POST",
body:JSON.stringify({
action:"crearPadre",
dniAlumno:dniA.value,
nombre:nombreA.value,
usuario:userA.value,
password:passA.value
})
})
.then(r=>r.json())
.then(x=>alert(x.error||"Padre creado"));
}

function cambiarPassword(){
fetch(API,{
method:"POST",
body:JSON.stringify({
action:"cambiarPassword",
usuario:usuarioActual.usuario,
oldPass:oldPass.value,
newPass:newPass.value
})
})
.then(r=>r.json())
.then(x=>alert(x.error||"Actualizado"));
}

function verRespuestas(){
fetch(API+"?action=respuestas")
.then(r=>r.json())
.then(data=>{
respuestas.innerHTML="";
data.forEach(r=>{
respuestas.innerHTML+=`
<div class="card">
<b>${r.usuario}</b><br>${r.respuesta}
</div>`;
});
});
}

function logout(){
localStorage.removeItem("u");
location.reload();
}
