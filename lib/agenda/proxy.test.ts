import { test } from 'node:test';
import assert from 'node:assert/strict';
import { consultarAgendaCRM } from './proxy.ts';
import { consultaAgenda, leerRespuesta } from './contrato.ts';
const config = {habilitada:true,crmUrl:'https://crm.example.test'};
const pagina = {datos:[{id:'e',nombre:'Especialidad sintética',password:'no-publicar'}],total:1,pagina:1,limite:25,totalPaginas:1};

test('solo rutas y parámetros permitidos; sin proxy abierto ni consultas duplicadas', () => {
  for (const [r,q] of [['../admin',''],['especialidades','url=http://otra.test'],['medicos','especialidadId=1&especialidadId=2'],['especialidades','pagina=0']]) {
    assert.equal(consultaAgenda(r,new URLSearchParams(q)),null);
  }
});
test('apagada no llama al CRM y no guarda disponibilidad en caché', async () => {
  let llamadas=0;
  const pedir: typeof fetch = async () => { llamadas++; return Response.json(pagina); };
  const r=await consultarAgendaCRM('especialidades',new URLSearchParams(),{...config,habilitada:false},pedir);
  assert.equal(r.status,503); assert.equal(llamadas,0); assert.equal(r.headers.get('cache-control'),'no-store');
});
test('el proxy elimina extras, fija origen, timeout y no-store', async () => {
  const pedir: typeof fetch = async (url, opciones) => {
    assert.equal(String(url),'https://crm.example.test/publico/agenda/especialidades?pagina=1&limite=25');
    assert.equal(opciones?.cache,'no-store'); assert.equal(opciones?.redirect,'error'); assert.ok(opciones?.signal);
    return Response.json(pagina);
  };
  const r=await consultarAgendaCRM('especialidades',new URLSearchParams(),config,pedir);
  assert.equal(r.status,200); assert.doesNotMatch(await r.text(),/password|no-publicar/);
});
test('caída, HTML y datos inválidos se muestran como error, nunca como vacío', async () => {
  for (const pedir of [async()=>new Response('fallo',{status:500}),async()=>new Response('<html>error</html>'),async()=>Response.json({...pagina,total:50})]) {
    const r=await consultarAgendaCRM('especialidades',new URLSearchParams(),config,pedir);
    assert.equal(r.status,503);
  }
});
test('disponibilidad caducada, de otro médico y horas duplicadas se rechazan', () => {
  const base={medicoId:'1',fecha:'2026-10-07',zonaHoraria:'America/La_Paz',consultadoEn:new Date().toISOString(),estado:'DISPONIBLE',horarios:[{id:'h',hora:'09:00'}]};
  const query=new URLSearchParams({medicoId:'1',fecha:'2026-10-07'});
  for (const cambio of [{medicoId:'2'},{consultadoEn:new Date(Date.now()-61000).toISOString()},{horarios:[{id:'h',hora:'09:00'},{id:'otro',hora:'09:00'}]}]) {
    assert.throws(()=>leerRespuesta('disponibilidad',{...base,...cambio},query));
  }
  assert.equal(leerRespuesta('disponibilidad',base,query).horarios[0].hora,'09:00');
});
