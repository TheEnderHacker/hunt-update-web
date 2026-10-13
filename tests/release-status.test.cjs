'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

function testAt(clock, expectedDone, expectedNext, expectedItemStatus) {
  class FakeElement {
    constructor() { this.children = []; this.textContent=''; this.dataset={}; this.classList={toggle(){}}; }
    replaceChildren(...items) { this.children = [...items]; }
    append(...items) { this.children.push(...items); }
    addEventListener() {}
    setAttribute() {}
    getAttribute() { return 'false'; }
    querySelector() { return null; }
    querySelectorAll() { return []; }
  }
  const elements = new Map();
  const get = id => { if (!elements.has(id)) elements.set(id,new FakeElement()); return elements.get(id); };
  const itemStatuses = [new FakeElement(), new FakeElement()];
  itemStatuses[0].dataset.releaseStatus='2026-09-08';
  itemStatuses[1].dataset.releaseStatus='2026-10-06';
  class FixedDate extends Date {
    constructor(...args){ super(...(args.length ? args : [clock])); }
    static now(){return new Date(clock).getTime();}
    static parse(s){return Date.parse(s);}
  }
  const doc = {
    getElementById:get,
    createElement:()=>new FakeElement(),
    querySelectorAll:(query)=>query==='[data-release-status]'?itemStatuses:[]
  };
  vm.runInNewContext(source,{
    document:doc,
    window:{setInterval(){return 1;}},
    Intl,Date:FixedDate,console
  },{filename:'app.js'});
  assert.equal(get('release-done').children.length,expectedDone,`released count at ${clock}`);
  assert.equal(Number(get('release-done-count').textContent),expectedDone,`badge count at ${clock}`);
  assert.equal(get('release-next').children.length,Math.max(expectedNext,1),`future count at ${clock}`);
  assert.match(itemStatuses[0].textContent,expectedItemStatus,`item status at ${clock}`);
  assert.ok(get('status-asof').textContent.includes('2026'));
}

testAt('2026-10-13T15:30:00Z',4,3,/DATUM ERREICHT/);
testAt('2026-10-14T09:00:00Z',5,2,/DATUM ERREICHT/);
testAt('2026-11-10T09:00:00Z',6,0,/DATUM ERREICHT/);
console.log('PASS · 3 Europe/Berlin date-boundary scenarios');
