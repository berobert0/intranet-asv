const API="https://script.google.com/macros/s/AKfycbzaYBWNJzZ9_aj3XOo-SIGIYQa4WOuVTzuzBLCEartF40jp7ohJUciYUvkIGfsKBWYCuQ/exec";

function login(){
fetch(API+`?action=loginPadre&dni=${usuario.value}&password=${password.value}`)
.then(r=>r.json())
.then(d=>{
if(!d.error){start(d);return;}

fetch(API+`?action=loginDocente&user=${usuario.value}&pass=${password.value}`)
.then(r=>r.json())
.then(x=>{
if(x.error){alert("Error");return;}
start(x);
});
});
}

function start(u){
localStorage.setItem("u",JSON.stringify(u));
loginDiv.style.display="none";
panel.classList.remove("hidden");
bienvenida.innerHTML="Bienvenido "+u.nombre;

if(u.tipo=="padre") cargar(u);
else docente(u);
}

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
<button onclick="resp(${c.id},'${u.dni}')">Enviar</button>
</div>`;
});
});
}

function docente(u){
contenido.innerHTML=`
<div class="card">
<input id="titulo">
<textarea id="mensaje"></textarea>
<button onclick="pub()">Publicar</button>

<h4>Crear alumno</h4>
<input id="dniA">
<input id="nombreA">
<input id="gradoA">
<input id="seccionA">
<input id="passA">
<button onclick="crear()">Crear</button>

<div id="respuestas"></div>
</div>`;
window.doc=u;
}

function pub(){
fetch(API,{method:"POST",
body:JSON.stringify({
action:"guardarComunicado",
titulo:titulo.value,
mensaje:mensaje.value,
grado:doc.grado,
seccion:doc.seccion
})}).then(()=>alert("Publicado"));
}

function resp(id,dni){
fetch(API,{method:"POST",
body:JSON.stringify({
action:"guardarRespuesta",
idComunicado:id,
dni:dni,
respuesta:document.getElementById("r"+id).value
})});
}

function crear(){
fetch(API,{method:"POST",
body:JSON.stringify({
action:"crearAlumno",
dni:dniA.value,
nombre:nombreA.value,
grado:gradoA.value,
seccion:seccionA.value,
password:passA.value
})})
.then(r=>r.json())
.then(x=>alert(x.error||"Creado"));
}

function logout(){
localStorage.removeItem("u");
location.reload();
}
