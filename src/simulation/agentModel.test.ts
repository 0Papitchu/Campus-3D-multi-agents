import test from 'node:test';
import assert from 'node:assert/strict';
import {
  POLES,
  getInitialAgents,
  updateAgentState,
  assignNewTask,
  getAgentsByPole,
  getInitialProjects,
  getInitialDataFlows,
  computeSystemTelemetry,
  processCopilotQuery,
} from './agentModel.ts';
import { AGENT_STATES_CONFIG } from '../types/world.ts';

test('poles configuration has 4 distinct sci-fi districts', () => {
  assert.equal(POLES.length, 4);
  const ids = POLES.map((p) => p.id);
  assert.deepEqual(ids, ['tech', 'carole', 'contenu', 'personnel']);
});

test('initial agents has 8 agents, 2 per pole', () => {
  const agents = getInitialAgents();
  assert.equal(agents.length, 8);

  const techAgents = getAgentsByPole(agents, 'tech');
  assert.equal(techAgents.length, 2);
  assert.equal(techAgents[0].name, 'Dev IA');
  assert.equal(techAgents[1].name, 'Veille technique');

  const caroleAgents = getAgentsByPole(agents, 'carole');
  assert.equal(caroleAgents.length, 2);
  assert.equal(caroleAgents[0].name, 'Styliste');
  assert.equal(caroleAgents[1].name, 'Recherche tendances');

  const contenuAgents = getAgentsByPole(agents, 'contenu');
  assert.equal(contenuAgents.length, 2);
  assert.equal(contenuAgents[0].name, 'Script vidéo');
  assert.equal(contenuAgents[1].name, 'Montage short');

  const persoAgents = getAgentsByPole(agents, 'personnel');
  assert.equal(persoAgents.length, 2);
  assert.equal(persoAgents[0].name, 'Assistant quotidien');
  assert.equal(persoAgents[1].name, 'Organisateur');
});

test('all required operational states exist in config', () => {
  const states = Object.keys(AGENT_STATES_CONFIG);
  assert.ok(states.includes('idle'));
  assert.ok(states.includes('working'));
  assert.ok(states.includes('thinking'));
  assert.ok(states.includes('waiting'));
  assert.ok(states.includes('review'));
  assert.ok(states.includes('done'));
  assert.ok(states.includes('error'));
  assert.ok(states.includes('offline'));
});

test('updateAgentState modifies status and activity', () => {
  const agents = getInitialAgents();
  const updated = updateAgentState(agents, 'tech-dev-ia', 'done');
  const dev = updated.find((a) => a.id === 'tech-dev-ia');

  assert.equal(dev?.status, 'done');
  assert.equal(dev?.progress, 100);
  assert.equal(dev?.lastActivity, 'À l’instant');
});

test('assignNewTask resets progress and updates task description', () => {
  const agents = getInitialAgents();
  const updated = assignNewTask(
    agents,
    'carole-styliste',
    'Créer nuancier été 2027',
    'working'
  );
  const styliste = updated.find((a) => a.id === 'carole-styliste');

  assert.equal(styliste?.currentTask, 'Créer nuancier été 2027');
  assert.equal(styliste?.status, 'working');
});

test('computeSystemTelemetry calculates accurate counters', () => {
  const agents = getInitialAgents();
  const telemetry = computeSystemTelemetry(agents);
  assert.equal(telemetry.totalAgents, 8);
  assert.ok(telemetry.activeAgents >= 1);
  assert.ok(telemetry.systemAlerts >= 1); // Organisateur has error
  assert.equal(telemetry.status, 'DEGRADED');
});

test('processCopilotQuery handles blocked agents and navigation', () => {
  const agents = getInitialAgents();
  const projects = getInitialProjects();

  const queryBlocked = processCopilotQuery('Quels agents sont bloqués ?', agents, projects);
  assert.ok(queryBlocked.reply.includes('Organisateur'));
  assert.equal(queryBlocked.action?.type, 'SELECT_AGENT');

  const queryTech = processCopilotQuery('Ouvre le pôle tech', agents, projects);
  assert.equal(queryTech.action?.type, 'FOCUS_DISTRICT');
  assert.equal(queryTech.action?.targetId, 'tech');

  const queryFlight = processCopilotQuery('Active le mode flightradar', agents, projects);
  assert.equal(queryFlight.action?.type, 'SET_VIEW_MODE');
  assert.equal(queryFlight.action?.viewMode, 'flightradar');
});

test('initial data flows connects agents across districts', () => {
  const flows = getInitialDataFlows();
  assert.ok(flows.length >= 4);
  const activeFlow = flows.find((f) => f.id === 'flow-tech-to-media');
  assert.equal(activeFlow?.fromDistrictId, 'tech');
  assert.equal(activeFlow?.toDistrictId, 'contenu');
  assert.equal(activeFlow?.status, 'active');
});
