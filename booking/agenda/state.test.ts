import { test } from 'node:test';
import assert from 'node:assert/strict';
import { consultaInicial, reducirConsulta, fechasConsulta, precioConsulta } from './state.ts';
import type { MedicoAgenda } from '../../lib/agenda/contrato.ts';
const especialidad = { id:'e',nombre:'Especialidad sintética' };
const medico: MedicoAgenda = {id:'1',especialidadId:'e',nombre:'Profesional sintético',horarioInformativo:null,modalidad:'ONLINE',precio:null};

test('cambiar especialidad invalida profesional y fecha, volver los conserva', () => {
  let estado = reducirConsulta(consultaInicial,{tipo:'especialidad',especialidad});
  estado = reducirConsulta(estado,{tipo:'medico',medico});
  estado = reducirConsulta(estado,{tipo:'fecha',fecha:'2026-10-10'});
  const vuelto = reducirConsulta(estado,{tipo:'volver'});
  assert.equal(vuelto.medico?.id,'1'); assert.equal(vuelto.fecha,'2026-10-10');
  assert.deepEqual(reducirConsulta(estado,{tipo:'especialidad',especialidad:{id:'otra',nombre:'Otra'}}),{paso:1,especialidad:{id:'otra',nombre:'Otra'},medico:null,fecha:''});
  assert.equal(reducirConsulta(estado,{tipo:'medico',medico:{...medico,id:'2'}}).fecha,'');
  assert.equal(reducirConsulta(estado,{tipo:'medico',medico:{...medico,especialidadId:'ajena'}}),estado);
});
test('el horizonte real es 30 días en Bolivia y no se inventa un precio', () => {
  assert.deepEqual(fechasConsulta(new Date('2026-12-31T02:00:00Z')),{hoy:'2026-12-30',ultimo:'2027-01-28'});
  assert.match(precioConsulta(null),/confirmar/);
  assert.match(precioConsulta({importeCentavos:40000,moneda:'BOB'}),/400/);
});
