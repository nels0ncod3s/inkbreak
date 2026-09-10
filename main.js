import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const PAPER = 0xf2eee2;
const PAPER_BRIGHT = 0xfffdf5;
const PAPER_SHADE = 0xebe6d8;
const INK = 0x174d9a;
const INK_DARK = 0x123d7a;

const MAP_SIZE = 72;
const HALF_MAP = MAP_SIZE / 2;

const game = document.querySelector('#game');
const menu = document.querySelector('#menu');
const playBtn = document.querySelector('#play-btn');
const storyBtn = document.querySelector('#story-btn');
const staminaFill = document.querySelector('#stamina-fill');
const staminaValue = document.querySelector('#stamina-value');
const coordsEl = document.querySelector('#coords');
const ammoCurrentEl = document.querySelector('#ammo-current');
const ammoReserveEl = document.querySelector('#ammo-reserve');
const healthFill = document.querySelector('#health-fill');
const healthValue = document.querySelector('#health-value');
const reloadNote = document.querySelector('#reload-note');
const hitmarkerEl = document.querySelector('#hitmarker');
const combatMessageEl = document.querySelector('#combat-message');
const damageVignetteEl = document.querySelector('#damage-vignette');
const targetCountEl = document.querySelector('#target-count');
const movementNoteEl = document.querySelector('#movement-note');
const pageCountEl = document.querySelector('#page-count');
const roundCountEl = document.querySelector('#round-count');
const weaponNameEl = document.querySelector('#weapon-name');
const ammoLabelEl = document.querySelector('#ammo-label');
const roundBannerEl = document.querySelector('#round-banner');
const roundBannerKickerEl = document.querySelector('#round-banner-kicker');
const roundBannerTitleEl = document.querySelector('#round-banner-title');
const roundBannerSubtitleEl = document.querySelector('#round-banner-subtitle');
const weaponSlotEls = [...document.querySelectorAll('.weapon-slot')];
const scopeOverlayEl = document.querySelector('#scope-overlay');
const bossHudEl = document.querySelector('#boss-hud');
const bossHealthFillEl = document.querySelector('#boss-health-fill');
const bossPhaseEl = document.querySelector('#boss-phase');
const mapNameEl = document.querySelector('#map-name');
const pageLabelEl = document.querySelector('#page-label');
const roundLabelEl = document.querySelector('#round-label');
const targetLabelEl = document.querySelector('#target-label');
const storyHudEl = document.querySelector('#story-hud');
const storyObjectiveTextEl = document.querySelector('#story-objective-text');
const storySpeakerEl = document.querySelector('#story-speaker');
const storyDialogueTextEl = document.querySelector('#story-dialogue-text');
const storyWakeOverlayEl = document.querySelector('#story-wake-overlay');
const storyDialogueScreenEl = document.querySelector('#story-dialogue-screen');
const storyScreenKickerEl = document.querySelector('#story-screen-kicker');
const storyScreenSpeakerEl = document.querySelector('#story-screen-speaker');
const storyScreenTextEl = document.querySelector('#story-screen-text');
const storyDialogueProgressEl = document.querySelector('#story-dialogue-progress');
const storyChoiceListEl = document.querySelector('#story-choice-list');
const storyDialogueContinueEl = document.querySelector('#story-dialogue-continue');
const inkCountEl = document.querySelector('#ink-count');
const arenaObjectiveEl = document.querySelector('#arena-objective');
const arenaObjectiveKickerEl = document.querySelector('#arena-objective-kicker');
const arenaObjectiveTextEl = document.querySelector('#arena-objective-text');
const arenaObjectiveProgressEl = document.querySelector('#arena-objective-progress');
const objectiveFillEl = document.querySelector('#objective-fill');
const upgradeScreenEl = document.querySelector('#upgrade-screen');
const upgradeCardsEl = document.querySelector('#upgrade-cards');
const upgradeInkEl = document.querySelector('#upgrade-ink');
const chapterOneCardEl = document.querySelector('#chapter-one-card');
const chapterTwoCardEl = document.querySelector('#chapter-two-card');
const awarenessLayerEl = document.querySelector('#awareness-layer');
const chapterProgressNoteEl = document.querySelector('#chapter-progress-note');
const chapterCards = [...document.querySelectorAll('.chapter-card')];


// ---------- Mobile touch shell ----------
const IS_TOUCH_DEVICE = navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches || navigator.userAgentData?.mobile === true || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const mobileControlsEl = document.querySelector('#mobile-controls');
const mobileJoystickEl = document.querySelector('#mobile-joystick');
const mobileJoystickKnobEl = document.querySelector('#mobile-joystick-knob');
const mobileLookZoneEl = document.querySelector('#mobile-look-zone');
const mobileFireBtn = document.querySelector('#mobile-fire');
const mobileAimBtn = document.querySelector('#mobile-aim');
const mobileReloadBtn = document.querySelector('#mobile-reload');
const mobileJumpBtn = document.querySelector('#mobile-jump');
const mobileCrouchBtn = document.querySelector('#mobile-crouch');
const mobileDashBtn = document.querySelector('#mobile-dash');
const mobileWeaponBtn = document.querySelector('#mobile-weapon');
const mobileUseBtn = document.querySelector('#mobile-use');
const mobilePauseBtn = document.querySelector('#mobile-pause');
const mobileLandscapeBtn = document.querySelector('#mobile-landscape-btn');
const mobileActionClusterEl = document.querySelector('#mobile-action-cluster');
const orientationGateEl = document.querySelector('#orientation-gate');

document.body.classList.toggle('touch-device', IS_TOUCH_DEVICE);
// Do not request fullscreen/orientation during page boot. On real phones that can
// steal or cancel the first gameplay touch stream. The manifest advertises
// landscape for installed PWAs and the portrait rotate gate handles browser play.
let mobileSessionActive = false;
let mobileMoveX = 0;
let mobileMoveY = 0;
let mobileSprintHeld = false;
let mobileCrouchHeld = false;
let mobileJoystickPointer = null;
let mobileLookPointer = null;
let mobileLookLastX = 0;
let mobileLookLastY = 0;
let mobileLookAccumX = 0;
let mobileLookAccumY = 0;
let mobileAimActive = false;
let mobileCrouchLatched = false;

function controlSessionActive() {
  return controls.isLocked || (IS_TOUCH_DEVICE && mobileSessionActive);
}

function clearMobileInputs() {
  mobileMoveX = 0;
  mobileMoveY = 0;
  mobileSprintHeld = false;
  mobileCrouchHeld = false;
  mobileJoystickPointer = null;
  mobileLookPointer = null;
  mobileLookAccumX = 0;
  mobileLookAccumY = 0;
  mobileAimActive = false;
  mobileCrouchLatched = false;
  triggerHeld = false;
  rightMouseDown = false;
  isAiming = false;
  mobileJoystickKnobEl?.style.setProperty('transform', 'translate(-50%, -50%)');
  mobileCrouchBtn?.classList.remove('pressed', 'latched');
  mobileJoystickEl?.classList.remove('sprinting');
  mobileFireBtn?.classList.remove('pressed');
  mobileAimBtn?.classList.remove('pressed');
  mobileReloadBtn?.classList.remove('pressed');
}

async function requestMobileLandscape() {
  if (!IS_TOUCH_DEVICE) return;
  // iOS Safari/PWA does not reliably support the standard fullscreen +
  // orientation-lock path. More importantly, attempting it while gameplay is
  // starting can interrupt the first touch stream. On iOS we rely on the
  // portrait rotate gate and the manifest's landscape preference instead.
  if (IS_IOS) return;
  try {
    const root = document.documentElement;
    if (!document.fullscreenElement) {
      if (root.requestFullscreen) await root.requestFullscreen({ navigationUI: 'hide' }).catch(() => root.requestFullscreen().catch(() => {}));
      else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen();
    }
  } catch {}
  try {
    if (screen.orientation?.lock) await screen.orientation.lock('landscape');
  } catch {}
}

function activateControlSession() {
  if (!IS_TOUCH_DEVICE) {
    controls.lock();
    return;
  }
  // Input must become live immediately. Fullscreen/orientation APIs can take time,
  // reject, or settle after a browser UI transition. Gameplay must never wait on them.
  // Make touch controls live synchronously. No fullscreen/orientation call is
  // allowed in this critical path because those browser UI transitions can
  // cancel the first joystick touch on iOS/Android.
  clearMobileInputs();
  mobileSessionActive = true;
  document.body.classList.add('mobile-playing');
  document.body.classList.remove('front-menu');
  menu.classList.remove('visible');
  // Force layout now so the joystick has a real hit box before the player's
  // first post-Play touch instead of waiting for a later paint/frame.
  if (mobileJoystickEl) void mobileJoystickEl.offsetWidth;
  if (gameMode === 'arena' && typeof roundState !== 'undefined' && roundState === 'boot') startRound(1);
  if (gameMode === 'story' && typeof storyState !== 'undefined' && storyState === 'boot') startStoryMode();
}

function pauseMobileGame() {
  if (!IS_TOUCH_DEVICE || !mobileSessionActive) return;
  mobileSessionActive = false;
  clearMobileInputs();
  document.body.classList.remove('mobile-playing');
  showMenuPanel(gameStarted ? 'pause' : 'main', false);
}

function leaveControlSessionForOverlay() {
  if (IS_TOUCH_DEVICE) {
    mobileSessionActive = false;
    clearMobileInputs();
    document.body.classList.remove('mobile-playing');
  } else if (controls.isLocked) {
    controls.unlock();
  }
}

function resumeControlSessionAfterOverlay() {
  if (IS_TOUCH_DEVICE) activateControlSession();
  else controls.lock();
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(PAPER);
scene.fog = new THREE.Fog(PAPER, 34, 116);

const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.05, 180);
camera.position.set(0, 1.72, 16);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, IS_TOUCH_DEVICE ? 1.4 : 1.75));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
game.appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, document.body);
controls.pointerSpeed = 0.78;
controls.minPolarAngle = 0.15;
controls.maxPolarAngle = Math.PI - 0.15;

const menuPanels = [...document.querySelectorAll('.menu-panel')];
const menuOpenButtons = [...document.querySelectorAll('[data-open-panel]')];
const resumeBtn = document.querySelector('#resume-btn');
const restartRunBtn = document.querySelector('#restart-run-btn');
const mainMenuBtn = document.querySelector('#main-menu-btn');
const sensitivitySetting = document.querySelector('#sensitivity-setting');
const sensitivityValue = document.querySelector('#sensitivity-value');
const fovSetting = document.querySelector('#fov-setting');
const fovValue = document.querySelector('#fov-value');
const volumeSetting = document.querySelector('#volume-setting');
const volumeValue = document.querySelector('#volume-value');

let gameStarted = false;
let gameMode = 'arena';
let selectedStoryChapter = 0;
let storyProgress = (() => {
  try { return Math.max(0, Number(localStorage.getItem('inkbreak_story_progress') || 0)); }
  catch { return 0; }
})();
let currentMenuPanel = 'main';
let previousMenuPanel = 'main';
let userBaseFov = 72;

function showMenuPanel(name, remember = true) {
  if (remember && (name === 'controls' || name === 'settings')) previousMenuPanel = currentMenuPanel;
  currentMenuPanel = name;
  menu.dataset.mode = name === 'pause' ? 'pause' : 'main';
  menuPanels.forEach(panel => panel.classList.toggle('active', panel.dataset.panel === name));
  menu.classList.add('visible');
}

menuOpenButtons.forEach(button => {
  button.addEventListener('click', () => {
    const requested = button.dataset.openPanel;
    if (button.classList.contains('menu-back')) showMenuPanel(previousMenuPanel || 'main', false);
    else showMenuPanel(requested);
  });
});

sensitivitySetting?.addEventListener('input', () => {
  controls.pointerSpeed = Number(sensitivitySetting.value);
  sensitivityValue.textContent = Number(sensitivitySetting.value).toFixed(2);
});

fovSetting?.addEventListener('input', () => {
  userBaseFov = Number(fovSetting.value);
  fovValue.textContent = `${Math.round(userBaseFov)}°`;
  if (!isAiming) {
    camera.fov = userBaseFov;
    camera.updateProjectionMatrix();
  }
});

volumeSetting?.addEventListener('input', () => {
  const value = Number(volumeSetting.value) / 100;
  volumeValue.textContent = `${Math.round(value * 100)}%`;
  setMasterVolume(value);
});

function refreshChapterMenu() {
  const chapterOneUnlocked = storyProgress >= 1;
  const chapterTwoUnlocked = storyProgress >= 2;
  chapterOneCardEl?.classList.toggle('locked', !chapterOneUnlocked);
  chapterTwoCardEl?.classList.toggle('locked', !chapterTwoUnlocked);
  if (chapterProgressNoteEl) {
    chapterProgressNoteEl.textContent = chapterTwoUnlocked
      ? 'Corrections unlocked // story progress is saved in this browser.'
      : chapterOneUnlocked
        ? 'Complete Wrong Page to unlock Corrections.'
        : 'Complete The Margin to unlock Wrong Page.';
  }
  if (storyBtn) {
    storyBtn.textContent = chapterTwoUnlocked
      ? 'CONTINUE STORY // CORRECTIONS'
      : chapterOneUnlocked ? 'CONTINUE STORY // WRONG PAGE' : 'STORY MODE // THE MARGIN';
  }
}

function saveStoryProgress(value) {
  storyProgress = Math.max(storyProgress, value);
  try { localStorage.setItem('inkbreak_story_progress', String(storyProgress)); } catch {}
  refreshChapterMenu();
}

function launchGameMode(mode, chapter = selectedStoryChapter) {
  getAudioContext();
  gameMode = mode;
  if (mode === 'story') selectedStoryChapter = chapter;
  resetRunToBoot();
  gameStarted = true;
  document.body.classList.remove('front-menu');
  document.body.classList.toggle('story-mode', gameMode === 'story');
  activateControlSession();
}

playBtn.addEventListener('click', () => launchGameMode('arena'));
storyBtn?.addEventListener('click', () => launchGameMode('story', storyProgress >= 2 ? 2 : (storyProgress >= 1 ? 1 : 0)));
chapterCards.forEach(card => card.addEventListener('click', () => {
  const chapter = Number(card.dataset.chapter || 0);
  if (chapter === 1 && storyProgress < 1) return;
  if (chapter === 2 && storyProgress < 2) return;
  launchGameMode('story', chapter);
}));
refreshChapterMenu();
resumeBtn?.addEventListener('click', () => activateControlSession());
restartRunBtn?.addEventListener('click', () => {
  resetRunToBoot();
  gameStarted = true;
  document.body.classList.remove('front-menu');
  document.body.classList.toggle('story-mode', gameMode === 'story');
  activateControlSession();
});
mainMenuBtn?.addEventListener('click', () => {
  resetRunToBoot();
  gameStarted = false;
  mobileSessionActive = false;
  clearMobileInputs();
  document.body.classList.add('front-menu');
  document.body.classList.remove('story-mode', 'mobile-playing');
  if (!IS_TOUCH_DEVICE && controls.isLocked) controls.unlock();
  showMenuPanel('main', false);
});

controls.addEventListener('lock', () => {
  document.body.classList.remove('front-menu');
  menu.classList.remove('visible');
  if (gameMode === 'arena' && typeof roundState !== 'undefined' && roundState === 'boot') startRound(1);
  if (gameMode === 'story' && typeof storyState !== 'undefined' && storyState === 'boot') startStoryMode();
});
controls.addEventListener('unlock', () => {
  if (upgradeChoosing) {
    menu.classList.remove('visible');
    return;
  }
  showMenuPanel(gameStarted ? 'pause' : 'main', false);
});

const keys = Object.create(null);
window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyE' && !e.repeat && typeof tryReadNearbyStoryNote === 'function' && tryReadNearbyStoryNote()) {
    e.preventDefault();
    return;
  }
  if (typeof upgradeChoosing !== 'undefined' && upgradeChoosing && /^Digit[1-3]$/.test(e.code) && !e.repeat) {
    e.preventDefault();
    chooseUpgrade(Number(e.code.slice(-1)) - 1);
    return;
  }
  if (gameMode === 'story' && storyDialogueBlocking && /^Digit[1-3]$/.test(e.code) && !e.repeat) {
    const line = storyDialogueQueue[storyDialogueIndex];
    if (line?.choices?.length) {
      e.preventDefault();
      chooseStoryDialogueChoice(Number(e.code.slice(-1)) - 1);
      return;
    }
  }
  if (gameMode === 'story' && storyDialogueBlocking && ['Space', 'Enter'].includes(e.code) && !e.repeat) {
    e.preventDefault();
    advanceStoryDialogue();
    return;
  }
  if (gameMode === 'story' && storyInputLocked) {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ControlLeft', 'ControlRight', 'KeyC', 'KeyQ'].includes(e.code)) e.preventDefault();
    return;
  }

  keys[e.code] = true;
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ControlLeft', 'ControlRight'].includes(e.code)) e.preventDefault();
  if (e.code === 'Space' && !e.repeat) tryJump();
  if (e.code === 'KeyQ' && !e.repeat) tryDash();
  if (['ControlLeft', 'ControlRight', 'KeyC'].includes(e.code) && !e.repeat) tryStartSlide();
  if (!e.repeat && /^Digit[0-6]$/.test(e.code)) switchWeaponBySlot(Number(e.code.slice(-1)));
});
window.addEventListener('keyup', (e) => keys[e.code] = false);

// ---------- Hand-drawn materials ----------
const paperMaterial = new THREE.MeshBasicMaterial({ color: PAPER_BRIGHT });
const paperShadeMaterial = new THREE.MeshBasicMaterial({ color: PAPER_SHADE });
const transparentMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });

const colliders = [];
const sketchMeshes = [];

function makeSketchBox({
  x = 0, y = 0.5, z = 0,
  w = 1, h = 1, d = 1,
  solid = true,
  shade = false,
  rotationY = 0,
  rotationX = 0,
  rotationZ = 0,
  jitter = true,
  collider = true
}) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geometry, solid ? (shade ? paperShadeMaterial : paperMaterial) : transparentMaterial);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rotationX, rotationY, rotationZ);
  scene.add(mesh);

  addSketchOutlines(mesh, geometry, jitter);
  addHatching(mesh, w, h, d);
  sketchMeshes.push(mesh);

  if (collider) {
    geometry.computeBoundingBox();
    mesh.updateMatrixWorld(true);
    const colliderBox = geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld);
    mesh.userData.colliderBox = colliderBox;
    colliders.push(colliderBox);
  }
  return mesh;
}

function addSketchOutlines(mesh, geometry, jitter = true) {
  const edges = new THREE.EdgesGeometry(geometry, 25);
  const passes = jitter ? 4 : 1;
  for (let i = 0; i < passes; i++) {
    const opacity = i === 0 ? 0.92 : Math.max(0.1, 0.28 - i * 0.05);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity })
    );
    if (i > 0) {
      const dir = i % 2 === 0 ? 1 : -1;
      line.position.set(0.006 * i * dir, 0.004 * i * -dir, 0.005 * i * dir);
      line.rotation.set(0.002 * i, -0.003 * i * dir, 0.002 * i * -dir);
    }
    mesh.add(line);
  }
}

function addHatching(mesh, w, h, d) {
  const group = new THREE.Group();
  const count = Math.min(20, Math.max(5, Math.round((w + d) * 0.85)));
  const verts = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 1) / (count + 1);
    const y = -h / 2 + 0.08;
    const x = -w / 2 + t * w;
    const lift = (i % 3) * 0.015;
    verts.push(x - 0.14, y + 0.01 + lift, d / 2 + 0.003, x + 0.17, y + 0.14 + lift, d / 2 + 0.003);
  }
  if (verts.length) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    group.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: INK_DARK, transparent: true, opacity: 0.18 })));
  }
  mesh.add(group);
}

function addScribbleLine(points, opacity = 0.55) {
  const group = new THREE.Group();
  for (let pass = 0; pass < 3; pass++) {
    const pts = points.map((p, i) => p.clone().add(new THREE.Vector3(
      Math.sin(i * 7.11 + pass * 0.7) * (0.015 + pass * 0.004),
      Math.cos(i * 4.73 + pass * 0.8) * 0.008,
      Math.sin(i * 3.91 + pass * 0.9) * (0.015 + pass * 0.004)
    )));
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    group.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: pass === 0 ? opacity : opacity * .28 })));
  }
  scene.add(group);
  return group;
}

function addFloorScribbles() {
  const scribbles = [
    [new THREE.Vector3(-12, .018, 22), new THREE.Vector3(-7, .018, 18), new THREE.Vector3(-3.5, .018, 14)],
    [new THREE.Vector3(-3.5, .018, 14), new THREE.Vector3(-4.8, .018, 16.4), new THREE.Vector3(-1.1, .018, 15.1)],
    [new THREE.Vector3(11, .018, -22), new THREE.Vector3(15, .018, -16), new THREE.Vector3(19, .018, -11)],
    [new THREE.Vector3(0, .018, 27), new THREE.Vector3(3.5, .018, 22), new THREE.Vector3(6.5, .018, 20)],
    [new THREE.Vector3(-18, .018, -8), new THREE.Vector3(-12, .018, -6), new THREE.Vector3(-8, .018, -2)]
  ];
  scribbles.forEach((pts, i) => addScribbleLine(pts, i % 2 ? .27 : .36));
}

// ---------- Map ----------
function buildMap() {
  // Floor
  makeSketchBox({ x: 0, y: -0.18, z: 0, w: MAP_SIZE, h: 0.35, d: MAP_SIZE, shade: false, collider: false, jitter: false });
  buildNotebookGrid();

  // Perimeter walls
  makeSketchBox({ x: 0, y: 2.25, z: -(HALF_MAP + 0.5), w: MAP_SIZE + 2, h: 4.5, d: 1 });
  makeSketchBox({ x: 0, y: 2.25, z: HALF_MAP + 0.5, w: MAP_SIZE + 2, h: 4.5, d: 1 });
  makeSketchBox({ x: -(HALF_MAP + 0.5), y: 2.25, z: 0, w: 1, h: 4.5, d: MAP_SIZE + 2 });
  makeSketchBox({ x: HALF_MAP + 0.5, y: 2.25, z: 0, w: 1, h: 4.5, d: MAP_SIZE + 2 });

  // Spawn lane cover
  makeSketchBox({ x: -9, y: 1.1, z: 14, w: 2.4, h: 2.2, d: 6.8, shade: true, rotationY: .06 });
  makeSketchBox({ x: 9, y: 0.85, z: 14, w: 4.6, h: 1.7, d: 2.6, rotationY: -.08 });

  // Central compound
  makeSketchBox({ x: 0, y: 1.3, z: 0, w: 10.4, h: 2.6, d: 1.2, shade: true });
  makeSketchBox({ x: -4.6, y: 1.3, z: -4.1, w: 1.15, h: 2.6, d: 8.4, shade: true });
  makeSketchBox({ x: 4.6, y: 1.3, z: -4.1, w: 1.15, h: 2.6, d: 8.4, shade: true });
  makeSketchBox({ x: 0, y: 0.75, z: -7.8, w: 6.8, h: 1.5, d: 2.2, shade: false, rotationY: .05 });

  // Left lane structures
  makeSketchBox({ x: -18, y: .65, z: -4, w: 4.1, h: 1.3, d: 4.4, rotationY: .12 });
  makeSketchBox({ x: -22.4, y: 1.85, z: 6, w: 1.25, h: 3.7, d: 7.5, rotationY: -.06, shade: true });
  makeSketchBox({ x: -24, y: .55, z: -15.5, w: 5.2, h: 1.1, d: 2.4, rotationY: -.1 });
  makeSketchBox({ x: -16, y: 1.25, z: -18.3, w: 2.2, h: 2.5, d: 6.2, rotationY: .08, shade: true });
  makeSketchBox({ x: -11.8, y: .45, z: -23, w: 5.2, h: .9, d: 1.5, rotationY: -.11 });
  makeSketchBox({ x: -14.6, y: .9, z: 23, w: 6, h: 1.8, d: 3.2, rotationY: -.07, shade: true });

  // Right lane structures
  makeSketchBox({ x: 18.6, y: 1.35, z: 1.5, w: 3.2, h: 2.7, d: 8.5, rotationY: .1 });
  makeSketchBox({ x: 22, y: .55, z: -11.5, w: 5.8, h: 1.1, d: 2.6, rotationY: -.12 });
  makeSketchBox({ x: 12.5, y: .55, z: -17, w: 3.4, h: 1.1, d: 5.2, rotationY: .05, shade: true });
  makeSketchBox({ x: 23, y: 1.5, z: 16, w: 2.1, h: 3, d: 8.4, rotationY: .12, shade: true });
  makeSketchBox({ x: 15, y: .95, z: 24.5, w: 7.2, h: 1.9, d: 2.4, rotationY: -.06 });
  makeSketchBox({ x: 10.8, y: .45, z: -25.5, w: 5.4, h: .9, d: 1.5, rotationY: .11 });

  // Far side structures
  makeSketchBox({ x: 0, y: 1.1, z: -27, w: 9.2, h: 2.2, d: 2.2, shade: true });
  makeSketchBox({ x: -10.5, y: .6, z: -30, w: 3.8, h: 1.2, d: 3.6, rotationY: .03 });
  makeSketchBox({ x: 11.5, y: .6, z: -30, w: 4.4, h: 1.2, d: 3.8, rotationY: -.07 });
  makeSketchBox({ x: -24.5, y: .65, z: 29, w: 4, h: 1.3, d: 4.4, rotationY: .09 });
  makeSketchBox({ x: 24.5, y: .65, z: 29, w: 4, h: 1.3, d: 4.4, rotationY: -.09 });

  // Skinny marker pillars
  [
    [-28, -23], [28, 22], [-26, 24], [27, -24], [-2, 24], [2, -23], [-31, 2], [31, -1]
  ].forEach(([x, z], i) => makeSketchBox({ x, y: 2.5, z, w: .7, h: 5 + (i % 2) * .6, d: .7, shade: true, rotationY: i * .1 }));

  // Some low stepping cover pieces for navigation variety
  [
    [-5, 0.36, 20, 3.2, 0.72, 3],
    [5, 0.36, 21.5, 3.2, 0.72, 3],
    [-20, 0.36, 14, 3, 0.72, 2.4],
    [20, 0.36, 11, 3, 0.72, 2.4],
    [0, 0.36, -18, 4, 0.72, 2.4]
  ].forEach(([x, y, z, w, h, d], i) => makeSketchBox({ x, y, z, w, h, d, rotationY: (i - 2) * 0.05, shade: i % 2 === 0 }));

  // Phase 2 sightline towers. Decorative for now; their bases provide extra cover.
  makeSketchBox({ x: -27, y: 1.4, z: -3, w: 4.6, h: 2.8, d: 4.6, shade: true, rotationY: .04 });
  makeSketchBox({ x: 27, y: 1.4, z: 4, w: 4.6, h: 2.8, d: 4.6, shade: true, rotationY: -.05 });

  buildSniperPlatform();
  addFloorScribbles();
  addMapLabels();
}


function buildSniperPlatform() {
  // A readable, climbable sniper nest. The stairs rise in <= 0.5m steps so the
  // controller can step onto them naturally, while the deck sits high enough to
  // create a genuinely useful long-range angle over the arena.
  const towerX = -29;
  const towerZ = 11.5;
  const deckTop = 4.45;

  makeSketchBox({ x: towerX, y: deckTop - .28, z: towerZ, w: 5.6, h: .56, d: 5.6, shade: true });
  makeSketchBox({ x: towerX - 2.35, y: 2.1, z: towerZ, w: .34, h: 4.2, d: 5.0, shade: true });
  makeSketchBox({ x: towerX + 2.35, y: 2.1, z: towerZ, w: .34, h: 4.2, d: 5.0, shade: true });

  // Deliberately chunky, overlapping stair blocks. Earlier decorative rotations
  // created tiny gaps in the collision boxes, so these are now dead-straight and
  // overlap each other enough that the controller always has a top surface underfoot.
  for (let i = 0; i < 9; i++) {
    const top = .45 * (i + 1);
    makeSketchBox({
      x: towerX,
      y: top / 2,
      z: towerZ + 8.2 - i * .80,
      w: 3.15,
      h: top,
      d: 1.18,
      shade: i % 2 === 0,
      rotationY: 0,
      collider: false
    });
  }

  // Low railings, deliberately incomplete so the player can still jump off.
  makeSketchBox({ x: towerX, y: deckTop + .52, z: towerZ - 2.55, w: 5.2, h: .86, d: .16, shade: true });
  makeSketchBox({ x: towerX - 2.55, y: deckTop + .52, z: towerZ, w: .16, h: .86, d: 5.0, shade: true });
  makeLabel('SNIPER NEST ↑', new THREE.Vector3(towerX, deckTop + 1.4, towerZ + 1.2), 0, .68);
}

function buildNotebookGrid() {
  const size = MAP_SIZE;
  const step = 2;
  const points = [];
  for (let i = -size / 2; i <= size / 2; i += step) {
    points.push(-size / 2, 0.01, i, size / 2, 0.01, i);
    points.push(i, 0.01, -size / 2, i, 0.01, size / 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  scene.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.09 })));

  const major = [];
  const majorStep = 8;
  for (let i = -size / 2; i <= size / 2; i += majorStep) {
    major.push(-size / 2, 0.012, i, size / 2, 0.012, i);
    major.push(i, 0.012, -size / 2, i, 0.012, size / 2);
  }
  const g2 = new THREE.BufferGeometry();
  g2.setAttribute('position', new THREE.Float32BufferAttribute(major, 3));
  scene.add(new THREE.LineSegments(g2, new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.14 })));
}

function makeLabel(text, position, rotationY = 0, scale = 2.2) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#174d9a';
  ctx.font = 'bold 42px Courier New';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 62);
  ctx.globalAlpha = .35;
  ctx.fillText(text, 258, 64);
  ctx.globalAlpha = .18;
  ctx.fillText(text, 254, 60);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  sprite.position.copy(position);
  sprite.scale.set(scale * 4, scale, 1);
  sprite.material.rotation = rotationY;
  scene.add(sprite);
  return sprite;
}

function addMapLabels() {
  makeLabel('SPAWN →', new THREE.Vector3(-7, .04, 25), 0, .85);
  makeLabel('MID', new THREE.Vector3(0, 3.6, .4), 0, .78);
  makeLabel('LEFT LANE', new THREE.Vector3(-20, 2.8, -2), 0, .72);
  makeLabel('RIGHT LANE', new THREE.Vector3(20, 2.8, -2), 0, .72);
  makeLabel('DO NOT TRUST THIS WALL', new THREE.Vector3(0, 3.25, -(HALF_MAP + 0.07)), 0, .68);
}

buildMap();

// ---------- Story Mode prototype map ----------
const STORY_X = 140;
const STORY_Z = 0;
const STORY_SIZE_X = 46;
const STORY_SIZE_Z = 52;
const STORY_SPAWN = new THREE.Vector3(STORY_X, 1.72, 20);
const STORY_SIGNAL = new THREE.Vector3(STORY_X, 0, -3);
const STORY_RELAY = new THREE.Vector3(STORY_X + 6.2, 0, -11.2);
const STORY_EXTRACTION = new THREE.Vector3(STORY_X, 0, -21);
let storyMarker = null;

function buildGridPatch(cx, cz, sx, sz, step = 2) {
  const pts = [];
  for (let z = -sz/2; z <= sz/2; z += step) {
    pts.push(cx - sx/2, .011, cz + z, cx + sx/2, .011, cz + z);
  }
  for (let x = -sx/2; x <= sx/2; x += step) {
    pts.push(cx + x, .011, cz - sz/2, cx + x, .011, cz + sz/2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  scene.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: .085 })));
}

function buildStoryMap() {
  makeSketchBox({ x: STORY_X, y: -.18, z: STORY_Z, w: STORY_SIZE_X, h: .35, d: STORY_SIZE_Z, collider: false, jitter: false });
  buildGridPatch(STORY_X, STORY_Z, STORY_SIZE_X, STORY_SIZE_Z);

  const hx = STORY_SIZE_X / 2;
  const hz = STORY_SIZE_Z / 2;
  makeSketchBox({ x: STORY_X, y: 2.8, z: STORY_Z - hz - .5, w: STORY_SIZE_X + 2, h: 5.6, d: 1, shade: true });
  makeSketchBox({ x: STORY_X, y: 2.8, z: STORY_Z + hz + .5, w: STORY_SIZE_X + 2, h: 5.6, d: 1, shade: true });
  makeSketchBox({ x: STORY_X - hx - .5, y: 2.8, z: STORY_Z, w: 1, h: 5.6, d: STORY_SIZE_Z + 2, shade: true });
  makeSketchBox({ x: STORY_X + hx + .5, y: 2.8, z: STORY_Z, w: 1, h: 5.6, d: STORY_SIZE_Z + 2, shade: true });

  // A narrow paper district, intentionally different from the open arena.
  const blocks = [
    [-14, 13, 8, 6, 9], [14, 13, 8, 7, 9],
    [-14, 1, 8, 8, 8], [14, 2, 8, 6, 8],
    [-14, -12, 8, 7, 9], [14, -12, 8, 8, 9],
    [-8, -20, 5, 4.5, 6], [9, -20, 6, 5.2, 6]
  ];
  blocks.forEach(([dx,z,w,h,d], i) => makeSketchBox({
    x: STORY_X + dx, y: h/2, z, w, h, d, shade: i % 2 === 0, rotationY: (i % 3 - 1) * .025
  }));

  // Street cover and a broken checkpoint gate.
  makeSketchBox({ x: STORY_X - 5.6, y: .7, z: 7, w: 3.8, h: 1.4, d: 1.0, rotationY: .08 });
  makeSketchBox({ x: STORY_X + 5.4, y: .55, z: 1, w: 3.1, h: 1.1, d: 2.1, shade: true, rotationY: -.08 });
  makeSketchBox({ x: STORY_X - 5.7, y: 1.4, z: -8, w: .65, h: 2.8, d: 4.8, shade: true });
  makeSketchBox({ x: STORY_X + 5.7, y: 1.4, z: -8, w: .65, h: 2.8, d: 4.8, shade: true });
  makeSketchBox({ x: STORY_X, y: 2.65, z: -8, w: 11.0, h: .45, d: .55, shade: true });

  // Relay station used by the expanded prologue objective.
  makeSketchBox({ x: STORY_RELAY.x, y: .78, z: STORY_RELAY.z, w: 1.5, h: 1.56, d: 1.5, shade: true, rotationY: .05 });
  makeSketchBox({ x: STORY_RELAY.x, y: 1.95, z: STORY_RELAY.z, w: .16, h: 2.35, d: .16, shade: true });
  makeLabel('RELAY?', new THREE.Vector3(STORY_RELAY.x, 3.45, STORY_RELAY.z), 0, .48);

  makeLabel('MARGIN DISTRICT', new THREE.Vector3(STORY_X, 4.2, 15), 0, .85);
  makeLabel('SIGNAL ↓', new THREE.Vector3(STORY_X, .12, -1.5), 0, .56);
  makeLabel('EXIT?', new THREE.Vector3(STORY_X, 3.0, -23.8), 0, .58);
}

function createStoryMarker() {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: .78 });
  for (let pass = 0; pass < 3; pass++) {
    const pts = [];
    const r = 1.0 + pass * .06;
    for (let i = 0; i < 42; i++) {
      const a = (i / 42) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, .03 + pass * .012, Math.sin(a) * r));
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const loop = new THREE.LineLoop(g, material.clone());
    loop.rotation.y = pass * .03;
    group.add(loop);
  }
  const arrow = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 3.1, 0), new THREE.Vector3(0, .45, 0),
    new THREE.Vector3(-.35, .85, 0), new THREE.Vector3(0, .45, 0),
    new THREE.Vector3(.35, .85, 0)
  ]);
  group.add(new THREE.LineSegments(arrow, material.clone()));
  group.visible = false;
  scene.add(group);
  return group;
}

buildStoryMap();
storyMarker = createStoryMarker();

// ---------- Story Chapter One // Wrong Page ----------
const STORY_ONE_X = 220;
const STORY_ONE_Z = 0;
const STORY_ONE_SIZE_X = 58;
const STORY_ONE_SIZE_Z = 66;
const STORY_ONE_SPAWN = new THREE.Vector3(STORY_ONE_X, 1.72, 27);
const STORY_ONE_FIRST_MARK = new THREE.Vector3(STORY_ONE_X - 4, 0, 12);
const STORY_ONE_BRIDGE_SWITCH = new THREE.Vector3(STORY_ONE_X + 7, 0, -3);
const STORY_ONE_CORRECTION = new THREE.Vector3(STORY_ONE_X, 0, -17);
const STORY_ONE_EXIT = new THREE.Vector3(STORY_ONE_X, 0, -27);
let storyBridgeBarrier = null;

function buildStoryOneMap() {
  makeSketchBox({ x: STORY_ONE_X, y: -.18, z: STORY_ONE_Z, w: STORY_ONE_SIZE_X, h: .35, d: STORY_ONE_SIZE_Z, collider: false, jitter: false });
  buildGridPatch(STORY_ONE_X, STORY_ONE_Z, STORY_ONE_SIZE_X, STORY_ONE_SIZE_Z);
  const hx = STORY_ONE_SIZE_X / 2;
  const hz = STORY_ONE_SIZE_Z / 2;
  makeSketchBox({ x: STORY_ONE_X, y: 3.0, z: STORY_ONE_Z - hz - .5, w: STORY_ONE_SIZE_X + 2, h: 6, d: 1, shade: true });
  makeSketchBox({ x: STORY_ONE_X, y: 3.0, z: STORY_ONE_Z + hz + .5, w: STORY_ONE_SIZE_X + 2, h: 6, d: 1, shade: true });
  makeSketchBox({ x: STORY_ONE_X - hx - .5, y: 3.0, z: STORY_ONE_Z, w: 1, h: 6, d: STORY_ONE_SIZE_Z + 2, shade: true });
  makeSketchBox({ x: STORY_ONE_X + hx + .5, y: 3.0, z: STORY_ONE_Z, w: 1, h: 6, d: STORY_ONE_SIZE_Z + 2, shade: true });

  // Half-finished city blocks. The blank gaps are deliberate story space.
  [
    [-18, 21, 8, 7, 8], [16, 22, 9, 9, 8],
    [-18, 8, 9, 10, 8], [17, 8, 8, 6, 8],
    [-17, -8, 8, 7, 9], [18, -9, 9, 10, 9],
    [-18, -23, 9, 8, 7], [17, -24, 8, 5, 7]
  ].forEach(([dx,z,w,h,d], i) => makeSketchBox({
    x: STORY_ONE_X + dx, y: h/2, z, w, h, d, shade: i % 2 === 0, rotationY: (i % 3 - 1) * .035
  }));

  // Incomplete architecture and cover.
  makeSketchBox({ x: STORY_ONE_X - 6, y: 1.25, z: 16, w: 5.6, h: 2.5, d: .65, rotationY: .08, shade: true });
  makeSketchBox({ x: STORY_ONE_X + 7, y: .72, z: 9, w: 4.2, h: 1.44, d: 1.1, rotationY: -.12 });
  makeSketchBox({ x: STORY_ONE_X - 7, y: .55, z: -4, w: 3.5, h: 1.1, d: 2.6, shade: true });
  storyBridgeBarrier = makeSketchBox({ x: STORY_ONE_X, y: .78, z: -6.2, w: 15.5, h: 1.56, d: 1.05, shade: false });
  makeLabel('BLANK // NO LINE', new THREE.Vector3(STORY_ONE_X, 2.0, -6.0), 0, .42);
  makeSketchBox({ x: STORY_ONE_X + 8, y: 1.3, z: -12, w: 1.0, h: 2.6, d: 7.2, rotationY: .05, shade: true });
  makeSketchBox({ x: STORY_ONE_X - 8, y: 1.25, z: -20, w: 1.0, h: 2.5, d: 6.4, rotationY: -.05 });

  // World writing / environmental storytelling.
  makeLabel('WRONG PAGE', new THREE.Vector3(STORY_ONE_X, 4.4, 23), 0, .78);
  makeLabel('THE MARGIN IS NOT EMPTY', new THREE.Vector3(STORY_ONE_X - 1, 3.0, 5), 0, .48);
  makeLabel('PAGE 17 WAS HERE', new THREE.Vector3(STORY_ONE_X + 10, 2.8, -6), 0, .44);
  makeLabel('DO NOT LET IT FINISH YOU', new THREE.Vector3(STORY_ONE_X - 7, 2.9, -14), 0, .42);
  makeLabel('PROPERTY OF PAGE 4', new THREE.Vector3(STORY_ONE_X + 5, .1, -21), 0, .38);
}

buildStoryOneMap();

const storyNotes = [];
let nearbyStoryNote = null;
let lastStoryNotePromptAt = 0;
function createStoryNote(x,z,title,text,chapter=1) {
  const mesh=makeSketchBox({x,y:.045,z,w:1.15,h:.07,d:.82,collider:false,shade:false,rotationY:(Math.random()-.5)*.25});
  mesh.userData.storyNote=true;
  storyNotes.push({mesh,title,text,read:false,chapter});
  makeLabel('NOTE',new THREE.Vector3(x,.18,z),0,.18);
}
createStoryNote(STORY_ONE_X-10, 15, 'FIELD NOTE // PAGE 17', 'Correctors do not arrive before a boundary failure. If they are already waiting, the page knew the breach was coming.',1);
createStoryNote(STORY_ONE_X+9, -3, 'FIELD NOTE // REPAIR LOG', 'The Artist is not creating new matter. Every observed stroke matches missing geometry. It may be repairing damage.',1);
createStoryNote(STORY_ONE_X-4, -23, 'FIELD NOTE // RADIO', 'MARA transmission timestamp: three days before Margin District existed. Source location unresolved.',1);

function updateStoryNotes() {
  nearbyStoryNote=null;
  if(gameMode!=='story'||storyDialogueBlocking) return;
  let best=1.65;
  storyNotes.forEach(note=>{
    if(note.read || note.chapter !== selectedStoryChapter) return;
    const d=Math.hypot(camera.position.x-note.mesh.position.x,camera.position.z-note.mesh.position.z);
    if(d<best){best=d;nearbyStoryNote=note;}
  });
  if(nearbyStoryNote && !combatIsActive() && performance.now()-lastStoryNotePromptAt>220) {
    lastStoryNotePromptAt=performance.now();
    showCombatMessage('E // READ FIELD NOTE',260);
  }
}

function tryReadNearbyStoryNote() {
  if(!nearbyStoryNote||storyDialogueBlocking||gameMode!=='story') return false;
  const note=nearbyStoryNote; note.read=true; nearbyStoryNote=null;
  showStoryDialogueSequence([{kicker:note.title,speaker:'FOUND TEXT',text:note.text}]);
  return true;
}

// ---------- Story Chapter Two // Corrections ----------
const STORY_TWO_X = 350;
const STORY_TWO_Z = 0;
const STORY_TWO_SIZE_X = 70;
const STORY_TWO_SIZE_Z = 84;
const STORY_TWO_SPAWN = new THREE.Vector3(STORY_TWO_X, 1.72, 35);
const STORY_TWO_GATE = new THREE.Vector3(STORY_TWO_X - 5, 0, 23);
const STORY_TWO_ARCHIVE = new THREE.Vector3(STORY_TWO_X + 4, 0, 10);
const STORY_TWO_PRESS = new THREE.Vector3(STORY_TWO_X, 0, -4);
const STORY_TWO_SAFE = new THREE.Vector3(STORY_TWO_X - 6, 0, -23);
const STORY_TWO_EXIT = new THREE.Vector3(STORY_TWO_X, 0, -34);
let storyDefenseEndsAt = 0;
let storyDefenseWave = 0;
let storyRunAmbushSpawned = false;

function buildStoryTwoMap() {
  makeSketchBox({ x: STORY_TWO_X, y: -.18, z: STORY_TWO_Z, w: STORY_TWO_SIZE_X, h: .35, d: STORY_TWO_SIZE_Z, collider: false, jitter: false });
  buildGridPatch(STORY_TWO_X, STORY_TWO_Z, STORY_TWO_SIZE_X, STORY_TWO_SIZE_Z);
  const hx=STORY_TWO_SIZE_X/2, hz=STORY_TWO_SIZE_Z/2;
  makeSketchBox({x:STORY_TWO_X,y:3.2,z:STORY_TWO_Z-hz-.5,w:STORY_TWO_SIZE_X+2,h:6.4,d:1,shade:true});
  makeSketchBox({x:STORY_TWO_X,y:3.2,z:STORY_TWO_Z+hz+.5,w:STORY_TWO_SIZE_X+2,h:6.4,d:1,shade:true});
  makeSketchBox({x:STORY_TWO_X-hx-.5,y:3.2,z:STORY_TWO_Z,w:1,h:6.4,d:STORY_TWO_SIZE_Z+2,shade:true});
  makeSketchBox({x:STORY_TWO_X+hx+.5,y:3.2,z:STORY_TWO_Z,w:1,h:6.4,d:STORY_TWO_SIZE_Z+2,shade:true});

  // Archive blocks create three readable spaces: intake yard, press hall, correction corridor.
  [
    [-22,27,10,8,9],[20,27,11,10,9],[-22,13,10,11,9],[20,13,11,7,9],
    [-22,-2,11,8,10],[22,-3,10,11,10],[-20,-18,11,9,9],[20,-19,11,8,9],
    [-21,-32,9,7,7],[21,-33,9,10,7]
  ].forEach(([dx,z,w,h,d],i)=>makeSketchBox({x:STORY_TWO_X+dx,y:h/2,z,w,h,d,shade:i%2===0,rotationY:(i%3-1)*.025}));

  // Intake gate and archive terminal.
  makeSketchBox({x:STORY_TWO_X-8,y:1.35,z:20,w:.7,h:2.7,d:7,shade:true});
  makeSketchBox({x:STORY_TWO_X+8,y:1.35,z:20,w:.7,h:2.7,d:7,shade:true});
  makeSketchBox({x:STORY_TWO_X,y:2.55,z:20,w:15.5,h:.42,d:.55,shade:true});
  makeSketchBox({x:STORY_TWO_ARCHIVE.x,y:.82,z:STORY_TWO_ARCHIVE.z,w:1.8,h:1.64,d:1.4,shade:true});
  makeLabel('ARCHIVE TERMINAL',new THREE.Vector3(STORY_TWO_ARCHIVE.x,2.55,STORY_TWO_ARCHIVE.z),0,.42);

  // Ink press defense room, with low cover that keeps the player moving.
  makeSketchBox({x:STORY_TWO_PRESS.x,y:.65,z:STORY_TWO_PRESS.z,w:2.2,h:1.3,d:2.2,shade:true});
  [[-8,-1],[8,-1],[-7,-9],[7,-9]].forEach(([dx,z],i)=>makeSketchBox({x:STORY_TWO_X+dx,y:.55,z,w:3.5,h:1.1,d:1.5,shade:i%2===0,rotationY:(i%2?-.1:.1)}));
  makeLabel('INK PRESS // HOLD',new THREE.Vector3(STORY_TWO_X,2.6,-4),0,.5);

  // Narrow correction corridor. Eraser cover objects already provide the "page deleting cover" idea in Arena;
  // these static fins make the story chase visually different.
  for(let i=0;i<5;i++){
    makeSketchBox({x:STORY_TWO_X+(i%2?7:-7),y:1.45,z:-14-i*3.2,w:1.0,h:2.9,d:4.0,shade:i%2===0});
  }
  makeLabel('CORRECTION ARCHIVE',new THREE.Vector3(STORY_TWO_X,4.5,31),0,.82);
  makeLabel('ONLY FINISHED LINES MAY PASS',new THREE.Vector3(STORY_TWO_X,3.0,17),0,.43);
  makeLabel('UNAUTHORIZED DRAFT → ERASE',new THREE.Vector3(STORY_TWO_X-3,3.0,-13),0,.40);
  makeLabel('PROOFREADER',new THREE.Vector3(STORY_TWO_X,3.2,-31),0,.52);
}

buildStoryTwoMap();
createStoryNote(STORY_TWO_X-11, 27, 'ARCHIVE MEMO // INTAKE', 'Every correction begins with classification. Draft. Copy. Borrowed line. The last category has no approved disposal method.',2);
createStoryNote(STORY_TWO_X+10, 5, 'ARCHIVE LOG // MARA', 'Voiceprint MARA appears in six pages simultaneously. No source body located. Recommendation: treat signal as persistent annotation, not resident.',2);
createStoryNote(STORY_TWO_X-9, -19, 'ARCHIVE LOG // ARTIST', 'Repair entity continues replacing erased geometry. Hostile designation disputed. The page survives longer when it is active.',2);

// ---------- Living page / dynamic redraw system ----------
const dynamicStructures = [];
let dynamicDrawStartedAt = 0;

function clearDynamicStructures() {
  while (dynamicStructures.length) {
    const mesh = dynamicStructures.pop();
    const si = sketchMeshes.indexOf(mesh);
    if (si >= 0) sketchMeshes.splice(si, 1);
    const ci = colliders.indexOf(mesh.userData.colliderBox);
    if (ci >= 0) colliders.splice(ci, 1);
    scene.remove(mesh);
    mesh.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose?.();
      if (obj.material && obj.material !== paperMaterial && obj.material !== paperShadeMaterial && obj.material !== transparentMaterial) {
        obj.material.dispose?.();
      }
    });
  }
}

function dynamicBox(opts) {
  const safe = { ...opts };
  if (Math.hypot(camera.position.x - safe.x, camera.position.z - safe.z) < 2.6) {
    safe.x += camera.position.x <= safe.x ? 3.2 : -3.2;
  }
  const mesh = makeSketchBox(safe);
  mesh.userData.finalScaleY = mesh.scale.y;
  mesh.scale.y = .025;
  dynamicStructures.push(mesh);
  return mesh;
}

function redrawArenaForRound(roundIndex, artistPhase = 0) {
  clearDynamicStructures();
  dynamicDrawStartedAt = performance.now();

  if (roundIndex === 1) {
    dynamicBox({ x: -3.8, y: .72, z: 10.5, w: 5.2, h: 1.44, d: .7, rotationY: .12, shade: true });
    dynamicBox({ x: 4.8, y: .72, z: 7.8, w: 4.2, h: 1.44, d: .7, rotationY: -.16 });
    dynamicBox({ x: 0, y: .52, z: 17.8, w: 3.1, h: 1.04, d: 2.1, rotationY: .08, shade: true });
  } else if (roundIndex === 2) {
    dynamicBox({ x: -7.8, y: 1.55, z: -2.5, w: .75, h: 3.1, d: 5.4, rotationY: .08, shade: true });
    dynamicBox({ x: 8.2, y: 1.55, z: 1.8, w: .75, h: 3.1, d: 5.4, rotationY: -.08, shade: true });
    dynamicBox({ x: 0, y: .66, z: 8.5, w: 5.8, h: 1.32, d: .8, rotationY: .02 });
  } else if (roundIndex === 3) {
    dynamicBox({ x: -6.3, y: 1.0, z: 6.2, w: 7.0, h: 2.0, d: .72, rotationY: .55, shade: true });
    dynamicBox({ x: 6.4, y: 1.0, z: -5.2, w: 7.0, h: 2.0, d: .72, rotationY: .55 });
    dynamicBox({ x: -12.5, y: .65, z: 12.0, w: 3.4, h: 1.3, d: 2.8, rotationY: -.2 });
    dynamicBox({ x: 13.5, y: .65, z: -12.0, w: 3.4, h: 1.3, d: 2.8, rotationY: .2 });
  } else if (roundIndex === 4) {
    if (artistPhase <= 1) {
      [[-8,-8],[8,-8],[-8,8],[8,8]].forEach(([x,z], i) => dynamicBox({ x, y: 1.15, z, w: 3.6, h: 2.3, d: 1.0, rotationY: i % 2 ? .24 : -.24, shade: i % 2 === 0 }));
      dynamicBox({ x: 0, y: .6, z: 0, w: 3.8, h: 1.2, d: 3.8, rotationY: .08, shade: true });
    } else if (artistPhase === 2) {
      dynamicBox({ x: -10.5, y: 1.05, z: 0, w: .85, h: 2.1, d: 8.0, rotationY: .28, shade: true });
      dynamicBox({ x: 10.5, y: 1.05, z: 0, w: .85, h: 2.1, d: 8.0, rotationY: -.28, shade: true });
      dynamicBox({ x: 0, y: .78, z: -10, w: 7.0, h: 1.56, d: .75, rotationY: .1 });
      dynamicBox({ x: 0, y: .78, z: 10, w: 7.0, h: 1.56, d: .75, rotationY: -.1 });
    } else {
      dynamicBox({ x: -5.8, y: 2.1, z: -4.5, w: .7, h: 4.2, d: .7, shade: true });
      dynamicBox({ x: 5.8, y: 2.1, z: 4.5, w: .7, h: 4.2, d: .7, shade: true });
      dynamicBox({ x: 0, y: .5, z: -12, w: 4.0, h: 1.0, d: 2.2, rotationY: .12 });
      dynamicBox({ x: 0, y: .5, z: 12, w: 4.0, h: 1.0, d: 2.2, rotationY: -.12 });
    }
  }

  if (roundIndex > 0) playMapDrawSound();
}

function updateDynamicStructures(now) {
  if (!dynamicStructures.length) return;
  const t = THREE.MathUtils.clamp((now - dynamicDrawStartedAt) / 720, 0, 1);
  const eased = t * t * (3 - 2 * t);
  dynamicStructures.forEach((mesh, i) => {
    mesh.scale.y = Math.max(.025, eased);
    mesh.rotation.z += Math.sin((now + i * 117) * .01) * .00006 * (1 - t);
  });
}

// ---------- Interactive paper environment ----------
const explosiveBarrels = [];
const breakableWalls = [];
const inkPuddles = [];
const foldRamps = [];
const eraserCovers = [];
let storyBridgeBuilt = false;
let lastRampLaunchAt = 0;

function removeColliderForMesh(mesh) {
  const box = mesh?.userData?.colliderBox;
  if (!box) return;
  const i = colliders.indexOf(box);
  if (i >= 0) colliders.splice(i, 1);
}

function restoreColliderForMesh(mesh) {
  const box = mesh?.userData?.colliderBox;
  if (box && !colliders.includes(box)) colliders.push(box);
}

function createExplosiveInkBarrel(x, z, story = false) {
  const mesh = makeSketchBox({ x, y: .62, z, w: .78, h: 1.24, d: .78, shade: true });
  mesh.userData.envType = 'barrel';
  mesh.userData.hp = 42;
  mesh.userData.storyObject = story;
  explosiveBarrels.push(mesh);
  makeLabel('INK', new THREE.Vector3(x, 1.55, z), 0, .24);
  return mesh;
}

function createBreakablePaperWall(x, z, w = 4.2, h = 2.5, rot = 0, story = false) {
  const mesh = makeSketchBox({ x, y: h/2, z, w, h, d: .34, rotationY: rot, shade: false });
  mesh.userData.envType = 'breakable';
  mesh.userData.hp = 125;
  mesh.userData.storyObject = story;
  breakableWalls.push(mesh);
  return mesh;
}

function createInkPuddle(x, z, radius = 2.4, story = false) {
  const g = new THREE.CircleGeometry(radius, 36);
  const m = new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: .115, side: THREE.DoubleSide, depthWrite: false });
  const mesh = new THREE.Mesh(g, m);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, .025, z);
  scene.add(mesh);
  const outline = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(Array.from({length:40},(_,i)=>{
      const a=i/40*Math.PI*2; const r=radius*(.94+Math.sin(i*2.37)*.035);
      return new THREE.Vector3(x+Math.cos(a)*r,.031,z+Math.sin(a)*r);
    })),
    new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: .34 })
  );
  scene.add(outline);
  inkPuddles.push({ x, z, radius, mesh, outline, story });
}

function createFoldRamp(x, z, rotY = 0, story = false) {
  const group = new THREE.Group();
  const ramp = new THREE.Mesh(new THREE.BoxGeometry(3.2, .12, 4.8), paperMaterial);
  addSketchOutlines(ramp, ramp.geometry, true);
  ramp.rotation.x = -.28;
  ramp.position.y = .72;
  group.add(ramp);
  group.position.set(x, 0, z);
  group.rotation.y = rotY;
  scene.add(group);
  foldRamps.push({ x, z, rotY, group, story, radius: 2.1 });
  makeLabel('FOLD →', new THREE.Vector3(x, .15, z + 1.4), 0, .32);
}

function createEraserCover(x, z) {
  const cover = makeSketchBox({ x, y: 1.05, z, w: 4.2, h: 2.1, d: .72, shade: true, rotationY: .08 });
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(2.6, 2.72, 30),
    new THREE.MeshBasicMaterial({ color: PAPER_BRIGHT, side: THREE.DoubleSide, transparent: true, opacity: .72, depthWrite: false })
  );
  ring.rotation.x = -Math.PI/2;
  ring.position.set(x,.035,z);
  scene.add(ring);
  eraserCovers.push({ cover, ring, phase: Math.random()*5000, erased:false });
}

function buildInteractiveEnvironment() {
  // Arena combat toys.
  createExplosiveInkBarrel(-10, 3);
  createExplosiveInkBarrel(12, -7);
  createExplosiveInkBarrel(20, 19);
  createBreakablePaperWall(-2, 13, 4.8, 2.35, .08);
  createBreakablePaperWall(14, 5, 3.8, 2.2, -.16);
  createInkPuddle(-15, -11, 2.8);
  createInkPuddle(16, 13, 2.5);
  createFoldRamp(-21, 20, .45);
  createFoldRamp(22, -20, -.55);
  createEraserCover(-13, 11);
  createEraserCover(13, -13);

  // Chapter One gets its own authored interactions.
  createExplosiveInkBarrel(STORY_ONE_X - 5, -9, true);
  createBreakablePaperWall(STORY_ONE_X + 1.5, -14, 5.2, 2.5, .03, true);
  createInkPuddle(STORY_ONE_X - 7, 6, 2.3, true);
  createFoldRamp(STORY_ONE_X + 9, -20, -.15, true);
}

function explodeInkBarrel(mesh) {
  if (!mesh || mesh.userData.exploded) return;
  mesh.userData.exploded = true;
  const p = mesh.position.clone();
  spawnInkBurst(p.clone().add(new THREE.Vector3(0,.7,0)), 34, .9);
  playNoiseBurst(.065, .22, 720);
  playTone(95, 34, .25, .055, 'sawtooth');
  damageEnemiesInRadius(p, 5.2, 120, null, true);
  const pd = Math.hypot(camera.position.x-p.x, camera.position.z-p.z);
  if (pd < 4.6) damagePlayer(Math.max(0, 36*(1-pd/4.6)));
  removeColliderForMesh(mesh);
  mesh.visible = false;
  setTimeout(() => { mesh.userData.hp = 42; mesh.userData.exploded = false; mesh.visible = true; restoreColliderForMesh(mesh); }, 14000);
}

function damageEnvironment(mesh, amount, hitPoint) {
  if (!mesh?.userData?.envType) return false;
  if (mesh.userData.envType === 'barrel') {
    mesh.userData.hp -= amount;
    spawnInkBurst(hitPoint, 5, .22);
    if (mesh.userData.hp <= 0) explodeInkBarrel(mesh);
    return true;
  }
  if (mesh.userData.envType === 'breakable') {
    mesh.userData.hp -= amount;
    spawnInkBurst(hitPoint, 6, .24);
    if (mesh.userData.hp <= 0) {
      removeColliderForMesh(mesh);
      mesh.visible = false;
      spawnPaperBreakChunks(mesh.position.clone(), 18);
      playNoiseBurst(.03, .18, 1500);
    }
    return true;
  }
  return false;
}

function spawnPaperBreakChunks(center, count = 14) {
  for (let i=0;i<count;i++) {
    const g = new THREE.BoxGeometry(.08+Math.random()*.14,.05+Math.random()*.1,.08+Math.random()*.14);
    const m = new THREE.MeshBasicMaterial({ color: i%2 ? PAPER_BRIGHT : PAPER_SHADE, transparent:true, opacity:1 });
    const cube = new THREE.Mesh(g,m); addSketchOutlines(cube,g,false);
    cube.position.copy(center).add(new THREE.Vector3((Math.random()-.5)*2.2,Math.random()*1.8,(Math.random()-.5)*.7));
    scene.add(cube);
    deathChunks.push({ mesh:cube, velocity:new THREE.Vector3((Math.random()-.5)*3.2,1+Math.random()*3,(Math.random()-.5)*3.2), spin:new THREE.Vector3(Math.random()*8,Math.random()*8,Math.random()*8), born:performance.now(), life:1100+Math.random()*650, ground:.04, bounces:1 });
  }
}

function damageEnemiesInRadius(point, radius, maxDamage, exclude = null, explosive = false) {
  enemies.forEach(enemy => {
    if (!enemy.alive || enemy.dying || !enemy.activeInRound || enemy === exclude) return;
    const d = enemy.group.position.distanceTo(point);
    if (d > radius) return;
    const dmg = Math.max(8, maxDamage * (1 - d/radius));
    const dir = enemy.group.position.clone().sub(point).normalize();
    damageEnemy(enemy, dmg, 'body', enemy.group.position.clone().add(new THREE.Vector3(0,1,0)), dir);
    if (explosive) enemy.knockbackVelocity.addScaledVector(dir, 5.5);
  });
}

function buildStoryBridge() {
  if (storyBridgeBuilt) return;
  storyBridgeBuilt = true;
  if (storyBridgeBarrier) { storyBridgeBarrier.visible = false; removeColliderForMesh(storyBridgeBarrier); }
  dynamicDrawStartedAt = performance.now();
  for (let i=0;i<6;i++) {
    const mesh = dynamicBox({ x: STORY_ONE_X + (i-2.5)*1.55, y:.18, z:-6.2, w:1.48, h:.36, d:4.0, shade:i%2===0 });
    mesh.userData.storyBridge = true;
  }
  playMapDrawSound();
  showRoundBanner('WRONG PAGE', 'BRIDGE // DRAWN', 'THE PAGE IS HELPING. FOR NOW.', 1900);
}

function pointInInkPuddle(x,z) {
  return inkPuddles.some(p => {
    if (gameMode === 'story' && !p.story) return false;
    if (gameMode === 'arena' && p.story) return false;
    return Math.hypot(x-p.x,z-p.z) < p.radius;
  });
}

function updateInteractiveEnvironment(now, dt) {
  // Eraser zones periodically remove and redraw cover in Arena.
  if (gameMode === 'arena') {
    eraserCovers.forEach((entry,i) => {
      const phase = (now + entry.phase + i*900) % 7600;
      const shouldErase = phase > 5200 && phase < 6900;
      if (shouldErase !== entry.erased) {
        entry.erased = shouldErase;
        entry.cover.visible = !shouldErase;
        if (shouldErase) removeColliderForMesh(entry.cover); else restoreColliderForMesh(entry.cover);
        entry.ring.material.opacity = shouldErase ? .95 : .55;
        if (shouldErase) playNoiseBurst(.012,.18,2200);
      }
    });
  }

  // Folded-paper ramps launch the player and preserve forward momentum.
  if (controlSessionActive() && performance.now()-lastRampLaunchAt > 900) {
    for (const r of foldRamps) {
      if (gameMode === 'story' && !r.story) continue;
      if (gameMode === 'arena' && r.story) continue;
      if (Math.hypot(camera.position.x-r.x,camera.position.z-r.z) < r.radius && grounded && Math.hypot(velocity.x,velocity.z) > 3.5) {
        const dir = new THREE.Vector3(Math.sin(r.rotY),0,-Math.cos(r.rotY));
        velocity.x += dir.x*5.2; velocity.z += dir.z*5.2; velocity.y = Math.max(velocity.y,8.4);
        grounded = false; lastRampLaunchAt = performance.now(); impactFovKick = Math.max(impactFovKick,4);
        playMovementSound('dash');
        break;
      }
    }
  }
}

buildInteractiveEnvironment();

// ---------- First-person weapon viewmodel ----------
// The weapon is built from simple Three.js primitives so the whole thing keeps the
// blue-ballpoint/paper language instead of suddenly becoming a photorealistic asset.
const viewModel = new THREE.Group();
camera.add(viewModel);

const weaponRig = new THREE.Group();
viewModel.add(weaponRig);

const WEAPON_BASE_POS = new THREE.Vector3(.34, -.30, -.73);
const WEAPON_BASE_ROT = new THREE.Euler(-.035, -.075, -.025);
weaponRig.position.copy(WEAPON_BASE_POS);
weaponRig.rotation.copy(WEAPON_BASE_ROT);

const gunPaper = new THREE.MeshBasicMaterial({ color: 0xeee8d8 });
const gunShade = new THREE.MeshBasicMaterial({ color: 0xe5dfcf });
const handPaper = new THREE.MeshBasicMaterial({ color: 0xf6efdc });

function addWeaponMesh(parent, geometry, material, position, rotation = new THREE.Euler()) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  mesh.rotation.copy(rotation);
  addSketchOutlines(mesh, geometry, true);
  parent.add(mesh);
  return mesh;
}

function boxPart(parent, w, h, d, x, y, z, rx = 0, ry = 0, rz = 0, material = gunPaper) {
  return addWeaponMesh(parent, new THREE.BoxGeometry(w, h, d), material, new THREE.Vector3(x, y, z), new THREE.Euler(rx, ry, rz));
}

function cylinderPart(parent, radius, length, x, y, z, rx = Math.PI / 2, ry = 0, rz = 0, material = gunShade) {
  return addWeaponMesh(parent, new THREE.CylinderGeometry(radius, radius, length, 10), material, new THREE.Vector3(x, y, z), new THREE.Euler(rx, ry, rz));
}

// Main carbine silhouette.
const gunBody = new THREE.Group();
weaponRig.add(gunBody);

// Upper/lower receiver.
boxPart(gunBody, .34, .18, .46, 0, .015, 0);
boxPart(gunBody, .30, .17, .31, 0, -.125, .045, -.035, 0, 0, gunShade);

// Handguard + top rail.
boxPart(gunBody, .31, .17, .55, 0, .018, -.49, 0, 0, 0, gunPaper);
boxPart(gunBody, .22, .035, .92, 0, .126, -.25, 0, 0, 0, gunShade);
for (let i = 0; i < 4; i++) {
  boxPart(gunBody, .325, .025, .025, 0, .026, -.30 - i * .13, 0, 0, 0, gunShade);
}

// Barrel + muzzle device.
cylinderPart(gunBody, .031, .42, 0, .02, -.94);
cylinderPart(gunBody, .048, .14, 0, .02, -1.22, Math.PI / 2, 0, 0, gunPaper);
boxPart(gunBody, .095, .022, .12, 0, .02, -1.22, 0, 0, 0, gunShade);

// Buffer tube and stock.
cylinderPart(gunBody, .045, .29, 0, .005, .37);
boxPart(gunBody, .26, .22, .18, 0, -.035, .56, 0, 0, 0, gunPaper);
boxPart(gunBody, .30, .055, .18, 0, -.15, .56, 0, 0, 0, gunShade);

// Pistol grip and trigger guard.
boxPart(gunBody, .16, .34, .15, .035, -.33, .16, -.26, 0, 0, gunShade);
boxPart(gunBody, .19, .026, .18, -.005, -.245, -.015, 0, 0, 0, gunPaper);
boxPart(gunBody, .025, .13, .18, -.095, -.19, -.015, 0, 0, 0, gunPaper);
boxPart(gunBody, .025, .13, .18, .085, -.19, -.015, 0, 0, 0, gunPaper);

// Sights.
boxPart(gunBody, .13, .075, .065, 0, .185, .12, 0, 0, 0, gunShade);
boxPart(gunBody, .09, .13, .055, 0, .205, -.69, 0, 0, 0, gunShade);
boxPart(gunBody, .018, .075, .018, 0, .285, -.69, 0, 0, 0, gunPaper);

// Charging handle is a real animated part during reload.
const chargingHandle = new THREE.Group();
weaponRig.add(chargingHandle);
boxPart(chargingHandle, .29, .045, .11, 0, .115, .17, 0, 0, 0, gunShade);
const CHARGE_BASE_Z = 0;

function buildMagazine(parent) {
  const group = new THREE.Group();
  parent.add(group);
  boxPart(group, .17, .15, .18, 0, 0, 0, -.03, 0, 0, gunShade);
  boxPart(group, .18, .15, .18, 0, -.135, .012, -.07, 0, 0, gunShade);
  boxPart(group, .19, .15, .18, 0, -.275, .035, -.11, 0, 0, gunShade);
  return group;
}

const seatedMagazine = buildMagazine(weaponRig);
const MAG_SEATED_POS = new THREE.Vector3(0, -.235, -.055);
function getCurrentMagSeat(out = new THREE.Vector3()) {
  const profile = typeof currentWeapon === 'function' ? currentWeapon() : null;
  const pos = profile?.magPos || [MAG_SEATED_POS.x, MAG_SEATED_POS.y, MAG_SEATED_POS.z];
  return out.set(...pos);
}
seatedMagazine.position.copy(MAG_SEATED_POS);

// A second magazine is hidden off-screen until the hand brings it up.
const spareMagazine = buildMagazine(weaponRig);
spareMagazine.visible = false;

// Right hand remains on the pistol grip.
const rightHand = new THREE.Group();
weaponRig.add(rightHand);
boxPart(rightHand, .18, .22, .17, .11, -.36, .16, -.14, 0, -.10, handPaper);
boxPart(rightHand, .16, .18, .48, .19, -.47, .43, .10, -.05, -.08, handPaper);

// Support hand moves through the entire reload path.
const leftHand = new THREE.Group();
weaponRig.add(leftHand);
boxPart(leftHand, .19, .17, .19, 0, 0, 0, .08, 0, .08, handPaper);
boxPart(leftHand, .16, .17, .48, -.06, -.10, .32, .18, .06, .10, handPaper);
const LEFT_HAND_BASE = new THREE.Vector3(-.13, -.17, -.58);
leftHand.position.copy(LEFT_HAND_BASE);

// Small scribbled accent marks make the weapon feel less CAD-perfect.
const gunAccentMaterial = new THREE.LineBasicMaterial({ color: INK_DARK, transparent: true, opacity: .45 });
[
  [[-.15,.07,-.27],[.15,.07,-.27]],
  [[-.14,-.07,.03],[.14,-.07,.03]],
  [[-.12,.045,-.58],[.12,.045,-.58]],
  [[-.12,.045,-.71],[.12,.045,-.71]]
].forEach(seg => {
  const g = new THREE.BufferGeometry().setFromPoints(seg.map(([x,y,z]) => new THREE.Vector3(x,y,z)));
  gunBody.add(new THREE.Line(g, gunAccentMaterial));
});

// Weapon motion state.
let recoilKick = 0;
let recoilPitch = 0;
let recoilYaw = 0;
let recoilRoll = 0;
let weaponSwayX = 0;
let weaponSwayY = 0;
let reloadStartAt = 0;
let reloadAmmoCommitted = false;

window.addEventListener('mousemove', (e) => {
  if (!controls.isLocked || IS_TOUCH_DEVICE) return;
  weaponSwayX = THREE.MathUtils.clamp(weaponSwayX + e.movementX * .00022, -.022, .022);
  weaponSwayY = THREE.MathUtils.clamp(weaponSwayY + e.movementY * .00018, -.018, .018);
});
// ---------- Progression, enemy classes, pickups, and encounter director ----------
const enemyHitMeshes = [];
const enemies = [];
const pickups = [];
const enemyRaycaster = new THREE.Raycaster();

const enemySpawnPoints = [
  [-15, 8], [15, 8], [-20, -8], [20, -7], [-10, -21], [10, -22], [-27, 19], [27, 20],
  [-25, -24], [25, -24], [-4, -30], [4, 29], [-29, 4], [29, -4]
];

const ENEMY_TYPES = {
  rifleman: {
    label: 'RIFLE', hp: 92, scale: [1, 1, 1], behavior: 'rifleman', speed: .55,
    range: 29, accuracyMin: .28, accuracyMax: .58, damageMin: 4, damageMax: 7,
    shotMin: 1650, shotMax: 2250
  },
  rusher: {
    label: 'RUSH', hp: 68, scale: [.9, .94, .9], behavior: 'rusher', speed: 3.45,
    range: 1.75, accuracyMin: 1, accuracyMax: 1, damageMin: 8, damageMax: 11,
    shotMin: 1050, shotMax: 1350
  },
  sniper: {
    label: 'SNIPE', hp: 72, scale: [.92, 1.05, .9], behavior: 'sniper', speed: .1,
    range: 48, accuracyMin: .62, accuracyMax: .80, damageMin: 14, damageMax: 18,
    shotMin: 3000, shotMax: 3800
  },
  heavy: {
    label: 'HEAVY', hp: 185, scale: [1.25, 1.2, 1.25], behavior: 'heavy', speed: .7,
    range: 28, accuracyMin: .28, accuracyMax: .50, damageMin: 6, damageMax: 9,
    shotMin: 1050, shotMax: 1450
  },
  flanker: {
    label: 'FLANK', hp: 82, scale: [.92, 1, .92], behavior: 'flanker', speed: 2.15,
    range: 27, accuracyMin: .34, accuracyMax: .61, damageMin: 5, damageMax: 8,
    shotMin: 1450, shotMax: 2050
  },
  corrector: {
    label: 'CORRECTOR', hp: 108, scale: [1.0, 1.04, 1.0], behavior: 'corrector', speed: 1.72,
    range: 31, accuracyMin: .46, accuracyMax: .68, damageMin: 6, damageMax: 9,
    shotMin: 1350, shotMax: 1850
  },
  proofreader: {
    label: 'PROOFREADER', hp: 360, scale: [1.42, 1.38, 1.42], behavior: 'guardian', speed: 1.22,
    range: 34, accuracyMin: .38, accuracyMax: .60, damageMin: 7, damageMax: 10,
    shotMin: 920, shotMax: 1260
  },
  guardian: {
    label: 'PAGE GUARDIAN', hp: 430, scale: [1.55, 1.48, 1.55], behavior: 'guardian', speed: 1.05,
    range: 32, accuracyMin: .35, accuracyMax: .58, damageMin: 7, damageMax: 10,
    shotMin: 850, shotMax: 1180
  },
  artist: {
    label: 'THE ARTIST', hp: 920, scale: [1.9, 1.85, 1.9], behavior: 'artist', speed: 1.25,
    range: 40, accuracyMin: .35, accuracyMax: .66, damageMin: 7, damageMax: 11,
    shotMin: 900, shotMax: 1250
  }
};

const ROUND_DEFINITIONS = [
  {
    title: 'FIRST MARKS', subtitle: 'RIFLEMEN ONLY // LEARN THE YARD', cap: 2,
    queue: ['rifleman', 'rifleman', 'rifleman'], unlock: null
  },
  {
    title: 'CLOSE THE GAP', subtitle: 'RUSHERS HAVE BEEN DRAWN IN', cap: 2,
    queue: ['rifleman', 'rusher', 'rifleman', 'rusher'], unlock: 'shotgun'
  },
  {
    title: 'LONG LINES', subtitle: 'SNIPERS NOW WATCH OPEN LANES', cap: 3,
    queue: ['rifleman', 'rusher', 'sniper', 'rifleman', 'sniper'], unlock: 'smg'
  },
  {
    title: 'BAD IDEAS IN BLUE INK', subtitle: 'HEAVIES + FLANKERS JOIN THE PAGE', cap: 3,
    queue: ['rifleman', 'flanker', 'heavy', 'rusher', 'flanker', 'heavy'], unlock: 'rifle'
  },
  {
    title: 'THE FINAL DRAWING', subtitle: 'CLEAR THE PAGE // THEN FACE THE ARTIST', cap: 3,
    queue: ['flanker', 'sniper', 'rusher', 'heavy', 'rifleman', 'artist'], unlock: 'marker'
  }
];

let pageNumber = 1;
let currentRoundIndex = 0;
let roundState = 'boot';
let roundSpawned = 0;
let roundKills = 0;
let totalKills = 0;
let nextRoundAt = 0;
let roundBannerHideAt = 0;
let playerInvulnerableUntil = 0;
let roundWarmupUntil = 0;
let activeArtist = null;
let inkTotal = 0;
let playerMaxHealth = 100;
let arenaObjective = null;
let arenaObjectiveMarker = null;
let objectiveTokens = [];
let objectiveLastDamageAt = 0;
let objectiveNextReinforcementAt = 0;
let upgradeChoosing = false;
let upgradeChoices = [];
let upgradeResumePlan = null;
let triggerHoldStartedAt = 0;
let crossoutSpeedUntil = 0;
let nextDashTrailTick = 0;

const upgradeState = {
  damageMul:1, reloadMul:1, spreadMul:1, moveMul:1, headshotMul:1, fireRateMul:1,
  damageTakenMul:1, dashCooldownMul:1, sprintDrainMul:1, maxHealthBonus:0,
  healOnKill:0, knifeHeal:0, ammoRefundChance:0, lastWord:false, lowHealthDamage:false,
  dashDamage:false, slideFeed:false, riflePenetration:false, markerSplash:false,
  shotgunRicochet:false, pistolPop:false, smgRamp:false, quietOutline:false,
  cubeShock:false, killStamina:false
};

const ARENA_OBJECTIVES = [
  { id:'erase', label:'ERASE', text:'CLEAR EVERY HOSTILE LINE' },
  { id:'hold', label:'HOLD THE LINE', text:'STAY INSIDE THE MARK' },
  { id:'relay', label:'RELAY', text:'TOUCH THREE SIGNAL MARKS' },
  { id:'marked', label:'MARKED', text:'CROSS OUT THE MARKED TARGET' },
  { id:'inkrun', label:'INK RUN', text:'COLLECT THREE INK CARTRIDGES' },
  { id:'breakout', label:'BREAKOUT', text:'OPEN THE EXIT, THEN RUN' },
  { id:'delivery', label:'DELIVERY', text:'CARRY THE MARK FROM A TO B' },
  { id:'dontstop', label:"DON'T STOP", text:'KEEP MOVING UNTIL THE TIMER ENDS' },
  { id:'nomargin', label:'NO MARGIN', text:'SURVIVE INSIDE THE SHRINKING LINE' }
];

const UPGRADES = [
  {id:'hard-ink',name:'HARD INK',desc:'+20% ranged damage.',cost:80,max:3,apply:()=>upgradeState.damageMul*=1.20},
  {id:'quick-hands',name:'QUICK HANDS',desc:'Reload animations complete 22% faster.',cost:70,max:3,apply:()=>upgradeState.reloadMul*=.78},
  {id:'straight-edge',name:'STRAIGHT EDGE',desc:'Weapon spread reduced by 28%.',cost:65,max:3,apply:()=>upgradeState.spreadMul*=.72},
  {id:'thick-paper',name:'THICK PAPER',desc:'Take 15% less damage.',cost:95,max:3,apply:()=>upgradeState.damageTakenMul*=.85},
  {id:'light-feet',name:'LIGHT FEET',desc:'+10% movement speed.',cost:75,max:3,apply:()=>upgradeState.moveMul*=1.10},
  {id:'headcase',name:'HEADCASE',desc:'+35% headshot damage.',cost:85,max:3,apply:()=>upgradeState.headshotMul*=1.35},
  {id:'overdraw',name:'OVERDRAW',desc:'+15% fire rate.',cost:85,max:3,apply:()=>upgradeState.fireRateMul*=1.15},
  {id:'extra-page',name:'EXTRA PAGE',desc:'+25 maximum health and heal 25.',cost:100,max:2,apply:()=>{upgradeState.maxHealthBonus+=25;playerMaxHealth=100+upgradeState.maxHealthBonus;playerHealth=Math.min(playerMaxHealth,playerHealth+25);updateHealthHud();}},
  {id:'second-wind',name:'SECOND WIND',desc:'Every kill restores 5 health.',cost:90,max:3,apply:()=>upgradeState.healOnKill+=5},
  {id:'crossout-ration',name:'CROSSOUT RATION',desc:'CROSSOUT gains an extra +25 health and +20 Ink.',cost:85,max:1,apply:()=>upgradeState.knifeHeal=25},
  {id:'afterimage',name:'AFTERIMAGE',desc:'Dashing damages enemies you pass.',cost:95,max:1,apply:()=>upgradeState.dashDamage=true},
  {id:'slide-feed',name:'SLIDE FEED',desc:'Kills while sliding refill 2 rounds.',cost:80,max:1,apply:()=>upgradeState.slideFeed=true},
  {id:'throughline',name:'THROUGHLINE',desc:'Ruler Rifle rounds penetrate one extra target.',cost:110,max:1,apply:()=>upgradeState.riflePenetration=true},
  {id:'marker-bloom',name:'MARKER BLOOM',desc:'Marker hits splash damage around the impact.',cost:110,max:1,apply:()=>upgradeState.markerSplash=true},
  {id:'bounce-draft',name:'BOUNCE DRAFT',desc:'Shotgun pellets ricochet once from paper walls.',cost:105,max:1,apply:()=>upgradeState.shotgunRicochet=true},
  {id:'pop-quiz',name:'POP QUIZ',desc:'Pistol headshot kills burst into damaging cubes.',cost:100,max:1,apply:()=>upgradeState.pistolPop=true},
  {id:'runaway-scribble',name:'RUNAWAY SCRIBBLE',desc:'SMG fires faster the longer you hold the trigger.',cost:105,max:1,apply:()=>upgradeState.smgRamp=true},
  {id:'last-word',name:'LAST WORD',desc:'The last round in a magazine deals 4× damage.',cost:95,max:1,apply:()=>upgradeState.lastWord=true},
  {id:'quiet-outline',name:'QUIET OUTLINE',desc:'Crouching makes Snipers dramatically less accurate.',cost:75,max:1,apply:()=>upgradeState.quietOutline=true},
  {id:'cube-shock',name:'CUBE SHOCK',desc:'Headshot kills damage nearby enemies when they break apart.',cost:110,max:1,apply:()=>upgradeState.cubeShock=true},
  {id:'kill-stamina',name:'INK LUNGS',desc:'Kills restore 14 stamina.',cost:70,max:2,apply:()=>upgradeState.killStamina+=14},
  {id:'slipstream',name:'SLIPSTREAM',desc:'Dash cooldown reduced by 20%.',cost:80,max:2,apply:()=>upgradeState.dashCooldownMul*=.8},
  {id:'long-breath',name:'LONG BREATH',desc:'Sprint drains 25% less stamina.',cost:70,max:2,apply:()=>upgradeState.sprintDrainMul*=.75},
  {id:'bad-idea',name:'BAD IDEA',desc:'Deal +30% damage while below 35% health.',cost:90,max:1,apply:()=>upgradeState.lowHealthDamage=true},
  {id:'lucky-margin',name:'LUCKY MARGIN',desc:'Kills have an 18% chance to refund a round.',cost:70,max:2,apply:()=>upgradeState.ammoRefundChance+=.18}
];
const upgradeStacks = new Map();

let storyState = 'boot';
let storyStage = 0;
let storyNextAt = 0;
let storyKills = 0;
let storyKillsRequired = 0;
let storyEncounterSerial = 0;
let activeStoryEncounterId = 0;
let storyCompletionAt = 0;
let storyInputLocked = false;
let storyDialogueBlocking = false;
let storyDialogueQueue = [];
let storyDialogueIndex = 0;
let storyDialogueOnComplete = null;
let storyWakeStartedAt = 0;
let storyWakeOpening = false;
let storyCheckpoint = STORY_SPAWN.clone();
let storyFlags = { trustedMara:false, ignoredMara:false, relayTouched:false, answeredUnknown:false };
let storySetpieceStage = 0;
let storyChoiceResolved = false;

let audioContext = null;
let masterGainNode = null;
let masterVolume = .80;

function getAudioContext() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioContext) {
    audioContext = new Ctx();
    masterGainNode = audioContext.createGain();
    masterGainNode.gain.value = masterVolume;
    masterGainNode.connect(audioContext.destination);
  }
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

function audioOutput(ctx) {
  return masterGainNode || ctx.destination;
}

function setMasterVolume(value) {
  masterVolume = THREE.MathUtils.clamp(value, 0, 1);
  if (masterGainNode && audioContext) {
    masterGainNode.gain.setTargetAtTime(masterVolume, audioContext.currentTime, .015);
  }
}

function playImpactSound(kind = 'body') {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain).connect(audioOutput(ctx));

  if (kind === 'head') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + .075);
    gain.gain.setValueAtTime(.055, now);
    gain.gain.exponentialRampToValueAtTime(.001, now + .09);
    osc.start(now); osc.stop(now + .095);
  } else if (kind === 'kill') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(210, now);
    osc.frequency.exponentialRampToValueAtTime(62, now + .16);
    gain.gain.setValueAtTime(.045, now);
    gain.gain.exponentialRampToValueAtTime(.001, now + .17);
    osc.start(now); osc.stop(now + .18);
  } else {
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(92, now + .045);
    gain.gain.setValueAtTime(.025, now);
    gain.gain.exponentialRampToValueAtTime(.001, now + .05);
    osc.start(now); osc.stop(now + .055);
  }
}


function playNoiseBurst(volume = .035, duration = .07, cutoff = 1200) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const frames = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  filter.type = 'lowpass';
  filter.frequency.value = cutoff;
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + duration);
  source.buffer = buffer;
  source.connect(filter).connect(gain).connect(audioOutput(ctx));
  source.start();
}

function playTone(freq, endFreq, duration, volume = .025, type = 'triangle') {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(.001, now + duration);
  osc.connect(gain).connect(audioOutput(ctx));
  osc.start(now); osc.stop(now + duration + .01);
}

function playGunSound(id) {
  if (id === 'knife') {
    playNoiseBurst(.018, .075, 2600);
    playTone(260, 120, .07, .012, 'triangle');
    return;
  }
  const profiles = {
    carbine: [112, 68, .07, .042, 1600], pistol: [150, 82, .065, .036, 2100],
    shotgun: [88, 42, .13, .065, 1050], smg: [132, 78, .048, .027, 1800],
    rifle: [102, 38, .16, .072, 1350], marker: [72, 30, .18, .078, 850]
  };
  const a = profiles[id] || profiles.carbine;
  playNoiseBurst(a[3], a[2], a[4]);
  playTone(a[0], a[1], a[2] * .82, a[3] * .65, id === 'smg' ? 'square' : 'sawtooth');
  setTimeout(() => playNoiseBurst(a[3] * .22, .025, 3200), 18);
}

function playEnemyShotSound(type) {
  const heavy = type === 'heavy' || type === 'artist' || type === 'guardian' || type === 'proofreader';
  playNoiseBurst(heavy ? .034 : .022, heavy ? .09 : .055, heavy ? 900 : 1450);
  playTone(heavy ? 82 : 118, heavy ? 48 : 72, heavy ? .08 : .05, heavy ? .022 : .014, 'square');
}

function playReloadSound(stage = 'start') {
  if (stage === 'start') { playNoiseBurst(.018, .05, 2500); playTone(340, 260, .045, .012, 'square'); }
  else if (stage === 'seat') { playNoiseBurst(.022, .035, 3100); playTone(470, 310, .04, .015, 'square'); }
  else { playTone(620, 420, .055, .014, 'triangle'); }
}

function playPickupSound(type) {
  playTone(type === 'health' ? 520 : 390, type === 'health' ? 820 : 640, .12, .022, 'triangle');
}

function playRoundStinger(kind = 'round') {
  if (kind === 'boss') {
    playTone(120, 62, .38, .045, 'sawtooth');
    setTimeout(() => playTone(90, 46, .42, .04, 'sawtooth'), 150);
  } else if (kind === 'complete') {
    playTone(320, 620, .16, .025, 'triangle');
    setTimeout(() => playTone(480, 880, .18, .022, 'triangle'), 110);
  } else {
    playTone(260, 460, .13, .02, 'triangle');
  }
}

function playMapDrawSound() {
  playNoiseBurst(.018, .42, 2100);
  setTimeout(() => playNoiseBurst(.013, .26, 3200), 180);
}

function playMovementSound(kind) {
  if (kind === 'dash') { playNoiseBurst(.018, .09, 2500); playTone(210, 520, .08, .012, 'triangle'); }
  else if (kind === 'slide') playNoiseBurst(.015, .18, 1400);
}

function playFootstepSound(sprinting = false, crouched = false) {
  playNoiseBurst(crouched ? .006 : (sprinting ? .012 : .008), crouched ? .025 : .035, crouched ? 1100 : 1700);
  if (!crouched) playTone(sprinting ? 92 : 108, 72, .025, sprinting ? .006 : .0045, 'triangle');
}

function playBossPhaseSound() {
  playTone(150, 55, .32, .045, 'sawtooth');
  playNoiseBurst(.035, .28, 1000);
}

function makeEnemyLabel(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#174d9a';
  ctx.font = '900 30px Courier New';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 45);
  ctx.globalAlpha = .28;
  ctx.fillText(text, 258, 47);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false }));
  sprite.scale.set(2.5, .47, 1);
  sprite.position.set(0, 2.35, 0);
  return sprite;
}

function makeEnemyPart(enemy, geometry, x, y, z, hitPart) {
  const material = new THREE.MeshBasicMaterial({ color: 0xf9f5e8, transparent: true, opacity: 1 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.userData.enemy = enemy;
  mesh.userData.hitPart = hitPart;
  mesh.userData.basePosition = mesh.position.clone();
  mesh.userData.baseRotation = mesh.rotation.clone();
  addSketchOutlines(mesh, geometry, true);
  enemy.visual.add(mesh);
  enemy.parts.push(mesh);
  if (hitPart === 'head') enemy.headMesh = mesh;
  enemyHitMeshes.push(mesh);
  return mesh;
}

function createEnemy(index) {
  const group = new THREE.Group();
  const visual = new THREE.Group();
  group.add(visual);
  const enemy = {
    group, visual, parts: [], headMesh: null, typeLabel: null, aimLine: null, bossAdornment: null,
    hp: 0, maxHp: 0, alive: false, dying: false, activeInRound: false, index,
    type: 'rifleman', config: ENEMY_TYPES.rifleman,
    origin: new THREE.Vector3(), navPosition: new THREE.Vector3(),
    phase: Math.random() * Math.PI * 2, flankSide: index % 2 ? 1 : -1,
    nextShotAt: 0, availableAt: 0, lastFiredAt: -9999,
    flinch: 0, headFlinch: 0, flinchDir: 1,
    knockbackOffset: new THREE.Vector3(), knockbackVelocity: new THREE.Vector3(),
    deathStart: 0, deathDuration: 680, deathDir: Math.random() < .5 ? -1 : 1,
    bossPhase: 1, lastBossPhase: 1,
    storyEncounterId: 0
  };
  scene.add(group);
  group.visible = false;

  makeEnemyPart(enemy, new THREE.BoxGeometry(.72, 1.05, .28), 0, 1.03, 0, 'body');
  makeEnemyPart(enemy, new THREE.BoxGeometry(.46, .46, .34), 0, 1.82, 0, 'head');
  const leftArm = makeEnemyPart(enemy, new THREE.BoxGeometry(.18, .88, .2), -.48, 1.04, 0, 'body');
  leftArm.rotation.z = -.08; leftArm.userData.baseRotation.copy(leftArm.rotation);
  const rightArm = makeEnemyPart(enemy, new THREE.BoxGeometry(.18, .88, .2), .48, 1.04, 0, 'body');
  rightArm.rotation.z = .08; rightArm.userData.baseRotation.copy(rightArm.rotation);
  const leftLeg = makeEnemyPart(enemy, new THREE.BoxGeometry(.2, .86, .22), -.22, .35, 0, 'body');
  leftLeg.rotation.z = .02; leftLeg.userData.baseRotation.copy(leftLeg.rotation);
  const rightLeg = makeEnemyPart(enemy, new THREE.BoxGeometry(.2, .86, .22), .22, .35, 0, 'body');
  rightLeg.rotation.z = -.02; rightLeg.userData.baseRotation.copy(rightLeg.rotation);

  const barrel = new THREE.Mesh(
    new THREE.BoxGeometry(.58, .1, .12),
    new THREE.MeshBasicMaterial({ color: PAPER_SHADE, transparent: true, opacity: 1 })
  );
  barrel.position.set(.34, 1.12, -.25);
  barrel.rotation.y = -.1;
  barrel.userData.basePosition = barrel.position.clone();
  barrel.userData.baseRotation = barrel.rotation.clone();
  addSketchOutlines(barrel, barrel.geometry, true);
  visual.add(barrel);
  enemy.parts.push(barrel);

  // Artist-only silhouette pieces. Hidden for normal enemies, revealed for the boss.
  const bossAdornment = new THREE.Group();
  bossAdornment.visible = false;
  visual.add(bossAdornment);
  const bossPaper = new THREE.MeshBasicMaterial({ color: 0xeee8d8, transparent: true, opacity: 1 });
  const addBossPiece = (g, x, y, z, rz = 0) => {
    const m = new THREE.Mesh(g, bossPaper);
    m.position.set(x, y, z);
    m.rotation.z = rz;
    addSketchOutlines(m, g, true);
    bossAdornment.add(m);
    return m;
  };
  addBossPiece(new THREE.BoxGeometry(.22, 1.15, .22), -.64, 1.33, .02, -.32);
  addBossPiece(new THREE.BoxGeometry(.22, 1.15, .22), .64, 1.33, .02, .32);
  addBossPiece(new THREE.BoxGeometry(.10, .62, .10), -.22, 2.38, .02, -.18);
  addBossPiece(new THREE.BoxGeometry(.10, .78, .10), 0, 2.48, .02, 0);
  addBossPiece(new THREE.BoxGeometry(.10, .62, .10), .22, 2.38, .02, .18);
  const haloGeo = new THREE.TorusGeometry(.48, .025, 5, 28);
  const halo = new THREE.Mesh(haloGeo, bossPaper);
  halo.position.set(0, 2.16, .03);
  halo.rotation.x = Math.PI / 2;
  addSketchOutlines(halo, haloGeo, true);
  bossAdornment.add(halo);
  enemy.bossAdornment = bossAdornment;

  enemies.push(enemy);
  return enemy;
}

for (let i = 0; i < 8; i++) createEnemy(i);

function clearEnemyAimLine(enemy) {
  if (!enemy.aimLine) return;
  enemy.aimLine.geometry.dispose();
  enemy.aimLine.material.dispose();
  scene.remove(enemy.aimLine);
  enemy.aimLine = null;
}

function configureEnemy(enemy, type, spawnPoint) {
  clearEnemyAimLine(enemy);
  const config = ENEMY_TYPES[type] || ENEMY_TYPES.rifleman;
  enemy.type = type;
  enemy.config = config;
  enemy.maxHp = Math.round(config.hp * (1 + (pageNumber - 1) * .10));
  enemy.hp = enemy.maxHp;
  enemy.alive = true;
  enemy.dying = false;
  enemy.activeInRound = true;
  enemy.group.visible = true;
  enemy.origin.set(spawnPoint[0], 0, spawnPoint[1]);
  enemy.navPosition.copy(enemy.origin);
  enemy.group.position.copy(enemy.origin);
  enemy.group.rotation.set(0, 0, 0);
  enemy.visual.position.set(0, 0, 0);
  enemy.visual.rotation.set(0, 0, 0);
  enemy.visual.scale.set(...config.scale);
  if (enemy.bossAdornment) enemy.bossAdornment.visible = type === 'artist';
  enemy.knockbackOffset.set(0, 0, 0);
  enemy.knockbackVelocity.set(0, 0, 0);
  enemy.flinch = 0;
  enemy.headFlinch = 0;
  enemy.bossPhase = 1;
  enemy.lastBossPhase = 1;
  enemy.flankSide = (enemy.index + roundSpawned) % 2 ? 1 : -1;
  enemy.crossoutExecution = false;

  if (enemy.typeLabel) enemy.visual.remove(enemy.typeLabel);
  enemy.typeLabel = makeEnemyLabel(config.label);
  enemy.visual.add(enemy.typeLabel);

  enemy.parts.forEach(part => {
    part.visible = true;
    if (part.userData.basePosition) part.position.copy(part.userData.basePosition);
    if (part.userData.baseRotation) part.rotation.copy(part.userData.baseRotation);
    if (part.material) {
      part.material.opacity = 1;
      part.material.color.set(type === 'corrector' ? 0xfffef9 : 0xf9f5e8);
    }
    part.children.forEach((child, idx) => {
      if (!child.material || child.material.opacity === undefined) return;
      child.material.opacity = type === 'corrector' ? (idx === 0 ? .96 : .07) : (idx === 0 ? .92 : Math.max(.10, .28 - idx * .05));
    });
  });

  enemy.lastFiredAt = -9999;
  enemy.nextShotAt = performance.now() + config.shotMin * .72 + Math.random() * (config.shotMax - config.shotMin);
  if (type === 'artist') {
    activeArtist = enemy;
    bossHudEl.classList.add('visible');
    updateBossHud(enemy);
    showRoundBanner(`PAGE ${pageNumber}`, 'THE ARTIST', 'THE PAGE IS DRAWING BACK', 2600);
    playRoundStinger('boss');
    redrawArenaForRound(4, 1);
  }
}

function deactivateEnemy(enemy) {
  clearEnemyAimLine(enemy);
  if (enemy === activeArtist) {
    activeArtist = null;
    bossHudEl.classList.remove('visible');
  }
  enemy.alive = false;
  enemy.dying = false;
  enemy.activeInRound = false;
  enemy.storyEncounterId = 0;
  enemy.objectiveMarked = false;
  enemy.group.visible = false;
  enemy.hp = 0;
  enemy.availableAt = performance.now() + 250;
}

const deathChunks = [];

function spawnDeathChunks(enemy, headshot = false) {
  enemy.group.updateMatrixWorld(true);
  const isBoss = enemy.type === 'guardian' || enemy.type === 'artist' || enemy.type === 'proofreader';
  const chunksPerPart = isBoss ? 5 : (headshot ? 4 : 3);
  const center = enemy.group.position.clone().add(new THREE.Vector3(0, 1.05, 0));
  const worldPos = new THREE.Vector3();

  enemy.parts.forEach((part, partIndex) => {
    if (!part.visible) return;
    part.getWorldPosition(worldPos);
    const localCount = part.userData.hitPart === 'head' && headshot ? chunksPerPart + 2 : chunksPerPart;
    for (let i = 0; i < localCount; i++) {
      const size = (isBoss ? .13 : .085) + Math.random() * (isBoss ? .22 : .14);
      const geometry = new THREE.BoxGeometry(size * (0.75 + Math.random()*.6), size * (0.75 + Math.random()*.7), size * (0.75 + Math.random()*.6));
      const material = new THREE.MeshBasicMaterial({
        color: (partIndex + i) % 3 === 0 ? PAPER_SHADE : PAPER_BRIGHT,
        transparent: true,
        opacity: 1
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.copy(worldPos).add(new THREE.Vector3(
        (Math.random() - .5) * .24,
        (Math.random() - .5) * .30,
        (Math.random() - .5) * .24
      ));
      cube.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
      addSketchOutlines(cube, geometry, true);
      scene.add(cube);

      const away = cube.position.clone().sub(center);
      away.y = Math.max(.15, away.y);
      if (away.lengthSq() < .01) away.set(Math.random()-.5, .4, Math.random()-.5);
      away.normalize();
      const burst = isBoss ? 4.8 : (headshot ? 4.1 : 3.2);
      const velocity = away.multiplyScalar(burst * (.55 + Math.random()*.75));
      velocity.y += (isBoss ? 2.8 : 1.9) + Math.random() * (headshot ? 2.5 : 1.6);

      deathChunks.push({
        mesh: cube,
        velocity,
        spin: new THREE.Vector3(
          (Math.random()-.5) * 13,
          (Math.random()-.5) * 13,
          (Math.random()-.5) * 13
        ),
        born: performance.now(),
        duration: isBoss ? 2600 + Math.random()*700 : 1450 + Math.random()*650,
        bounces: 0,
        ground: .035 + size * .45
      });
    }
  });

  playNoiseBurst(isBoss ? .05 : .03, isBoss ? .18 : .11, 1250);
  playTone(isBoss ? 92 : 138, 54, isBoss ? .20 : .11, isBoss ? .028 : .016, 'square');
}

function updateDeathChunks(now, dt) {
  for (let i = deathChunks.length - 1; i >= 0; i--) {
    const fx = deathChunks[i];
    const age = now - fx.born;
    const t = THREE.MathUtils.clamp(age / fx.duration, 0, 1);

    fx.velocity.y -= 9.4 * dt;
    fx.mesh.position.addScaledVector(fx.velocity, dt);
    fx.mesh.rotation.x += fx.spin.x * dt;
    fx.mesh.rotation.y += fx.spin.y * dt;
    fx.mesh.rotation.z += fx.spin.z * dt;
    fx.spin.multiplyScalar(Math.exp(-1.35 * dt));

    if (fx.mesh.position.y < fx.ground) {
      fx.mesh.position.y = fx.ground;
      if (Math.abs(fx.velocity.y) > .7 && fx.bounces < 3) {
        fx.velocity.y = Math.abs(fx.velocity.y) * .34;
        fx.velocity.x *= .72;
        fx.velocity.z *= .72;
        fx.bounces += 1;
      } else {
        fx.velocity.y = 0;
        fx.velocity.x *= Math.exp(-7 * dt);
        fx.velocity.z *= Math.exp(-7 * dt);
      }
    }

    const fade = t < .70 ? 1 : 1 - ((t - .70) / .30);
    fx.mesh.material.opacity = Math.max(0, fade);
    fx.mesh.children.forEach(child => {
      if (child.material?.transparent) child.material.opacity = Math.max(0, fade * .78);
    });
    const shrink = t < .82 ? 1 : Math.max(.03, 1 - (t - .82) / .18);
    fx.mesh.scale.setScalar(shrink);

    if (t >= 1) {
      fx.mesh.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose?.();
        if (obj.material && obj.material !== paperMaterial && obj.material !== paperShadeMaterial) obj.material.dispose?.();
      });
      scene.remove(fx.mesh);
      deathChunks.splice(i, 1);
    }
  }
}

const deathScribbles = [];
function spawnDeathScribbles(enemy, headshot = false) {
  const group = new THREE.Group();
  group.position.copy(enemy.group.position).add(new THREE.Vector3(0, 1.05, 0));
  const lineCount = (enemy.type === 'guardian' || enemy.type === 'artist' || enemy.type === 'proofreader') ? 58 : (headshot ? 28 : 21);

  for (let i = 0; i < lineCount; i++) {
    const points = [];
    let cursor = new THREE.Vector3(
      (Math.random() - .5) * ((enemy.type === 'guardian' || enemy.type === 'artist' || enemy.type === 'proofreader') ? 1.8 : .75),
      (Math.random() - .5) * ((enemy.type === 'guardian' || enemy.type === 'artist' || enemy.type === 'proofreader') ? 2.6 : 1.65),
      (Math.random() - .5) * .7
    );
    points.push(cursor.clone());
    const segments = 3 + Math.floor(Math.random() * 3);
    for (let j = 0; j < segments; j++) {
      cursor = cursor.clone().add(new THREE.Vector3(
        (Math.random() - .5) * .42,
        (Math.random() - .5) * .42,
        (Math.random() - .5) * .32
      ));
      points.push(cursor.clone());
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: INK_DARK, transparent: true, opacity: .72 });
    const line = new THREE.Line(geometry, material);
    group.add(line);
  }

  scene.add(group);
  deathScribbles.push({
    group,
    born: performance.now(),
    duration: (enemy.type === 'guardian' || enemy.type === 'artist' || enemy.type === 'proofreader') ? 1650 : (headshot ? 950 : 820),
    drift: new THREE.Vector3((Math.random()-.5)*.45, -.22, (Math.random()-.5)*.45),
    spin: (Math.random()-.5)*1.2
  });
}

function updateDeathScribbles(now, dt) {
  for (let i = deathScribbles.length - 1; i >= 0; i--) {
    const fx = deathScribbles[i];
    const t = THREE.MathUtils.clamp((now - fx.born) / fx.duration, 0, 1);
    fx.group.position.addScaledVector(fx.drift, dt);
    fx.group.position.y -= dt * .38 * (0.4 + t);
    fx.group.rotation.y += fx.spin * dt;
    fx.group.rotation.z += fx.spin * .35 * dt;
    const spread = 1 + t * .48;
    fx.group.scale.set(spread, Math.max(.08, 1 - t * .82), spread);
    fx.group.children.forEach(line => line.material.opacity = .72 * (1 - t));
    if (t >= 1) {
      fx.group.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      scene.remove(fx.group);
      deathScribbles.splice(i, 1);
    }
  }
}

function startEnemyDeath(enemy, part) {
  if (!enemy.activeInRound) return;
  enemy.alive = false;
  enemy.dying = true;
  enemy.hp = 0;
  enemy.deathStart = performance.now();
  enemy.deathDir = Math.random() < .5 ? -1 : 1;
  clearEnemyAimLine(enemy);
  spawnDeathChunks(enemy, part === 'head');
  spawnDeathScribbles(enemy, part === 'head');
  playImpactSound('kill');

  if (gameMode === 'story') {
    // Only enemies belonging to the current scripted encounter advance Story Mode.
    if (enemy.storyEncounterId && enemy.storyEncounterId === activeStoryEncounterId) storyKills += 1;
  } else {
    roundKills += 1;
    const killInk = enemy.type === 'artist' ? 300 : enemy.type === 'heavy' ? 28 : enemy.type === 'sniper' ? 18 : enemy.type === 'rusher' ? 14 : 10;
    awardInk(killInk + (part === 'head' ? 5 : 0));
    if (arenaObjective?.id === 'marked' && enemy.objectiveMarked) arenaObjective.progress = 1;
  }
  totalKills += 1;

  if (upgradeState.healOnKill > 0) {
    playerHealth = Math.min(playerMaxHealth, playerHealth + upgradeState.healOnKill);
    updateHealthHud();
  }
  if (upgradeState.killStamina > 0) stamina = Math.min(100, stamina + upgradeState.killStamina);
  if (upgradeState.slideFeed && sliding && !currentWeapon().melee) {
    ammoCurrent = Math.min(currentWeapon().magSize, ammoCurrent + 2);
    syncCurrentWeaponAmmo(); updateAmmoHud();
  }
  if (upgradeState.ammoRefundChance > 0 && !currentWeapon().melee && Math.random() < upgradeState.ammoRefundChance) {
    ammoCurrent = Math.min(currentWeapon().magSize, ammoCurrent + 1);
    syncCurrentWeaponAmmo(); updateAmmoHud();
  }
  if (part === 'head' && upgradeState.cubeShock) damageEnemiesInRadius(enemy.group.position, 4.2, 52, enemy, true);
  if (part === 'head' && currentWeaponId === 'pistol' && upgradeState.pistolPop) damageEnemiesInRadius(enemy.group.position, 4.8, 72, enemy, true);
  updateRoundHud();
  if (enemy.type === 'artist') {
    showCombatMessage('THE ARTIST // CROSSED OUT', 1800);
    playRoundStinger('complete');
    setTimeout(() => bossHudEl.classList.remove('visible'), 650);
  } else {
    showCombatMessage(enemy.type === 'guardian' ? 'PAGE GUARDIAN // ERASED' : (part === 'head' ? 'HEADSHOT // SCRIBBLED OUT' : `${enemy.config.label} // SCRIBBLED OUT`));
  }
}


function updateBossHud(enemy) {
  if (!enemy || enemy.type !== 'artist') return;
  bossHealthFillEl.style.transform = `scaleX(${THREE.MathUtils.clamp(enemy.hp / enemy.maxHp, 0, 1)})`;
  const labels = ['PHASE I // FIRST STROKE', 'PHASE II // REDRAW', 'PHASE III // CROSS-OUT'];
  bossPhaseEl.textContent = labels[(enemy.bossPhase || 1) - 1];
}

function updateArtistPhase(enemy) {
  if (enemy.type !== 'artist' || !enemy.alive) return;
  const ratio = enemy.hp / enemy.maxHp;
  const phase = ratio > .66 ? 1 : ratio > .33 ? 2 : 3;
  enemy.bossPhase = phase;
  updateBossHud(enemy);
  if (phase !== enemy.lastBossPhase) {
    enemy.lastBossPhase = phase;
    playerInvulnerableUntil = Math.max(playerInvulnerableUntil, performance.now() + 650);
    if (phase === 2) {
      showRoundBanner('THE ARTIST // PHASE II', 'REDRAW', 'THE COVER MOVES // KEEP MOVING', 2100);
      redrawArenaForRound(4, 2);
    } else if (phase === 3) {
      showRoundBanner('THE ARTIST // PHASE III', 'CROSS-OUT', 'FASTER STROKES // FEWER SAFE LINES', 2100);
      redrawArenaForRound(4, 3);
    }
    playBossPhaseSound();
  }
}

function artistShoot(enemy) {
  if (!controlSessionActive() || playerHealth <= 0) return;
  const phase = enemy.bossPhase || 1;
  const origin = enemy.group.position.clone().add(new THREE.Vector3(0, 1.9, 0));
  const target = camera.position.clone();
  const dist = origin.distanceTo(target);
  if (dist > enemy.config.range || !enemyHasLineOfSight(enemy, target)) return;

  enemy.lastFiredAt = performance.now();
  playEnemyShotSound('artist');
  const rays = phase === 1 ? 3 : phase === 2 ? 4 : 6;
  let hitChance = phase === 1 ? .22 : phase === 2 ? .20 : .17;
  let didHit = false;
  for (let i = 0; i < rays; i++) {
    const spread = phase === 1 ? .38 : phase === 2 ? .55 : .82;
    const endpoint = target.clone().add(new THREE.Vector3((Math.random()-.5)*spread*2.5, (Math.random()-.5)*spread*.8, (Math.random()-.5)*spread*2.5));
    addTemporaryTracer(origin, endpoint);
    if (!didHit && Math.random() < hitChance) {
      didHit = true;
      const damage = phase === 1 ? 9 : phase === 2 ? 11 : 13;
      damagePlayer(damage * (1 + (pageNumber - 1) * .05));
    }
  }
}

function damageEnemy(enemy, amount, part, hitPoint, shotDirection) {
  if (!enemy.alive || enemy.dying || !enemy.activeInRound) return;
  enemy.hp -= amount;
  if (enemy.type === 'artist') updateArtistPhase(enemy);
  const killed = enemy.hp <= 0;
  const headshot = part === 'head';
  flashHitmarker(killed, headshot);

  enemy.flinch = 1;
  enemy.flinchDir = Math.random() < .5 ? -1 : 1;
  if (headshot) enemy.headFlinch = 1;

  const push = shotDirection.clone();
  push.y = 0;
  if (push.lengthSq() > 0) push.normalize();
  const mass = enemy.type === 'heavy' || enemy.type === 'guardian' || enemy.type === 'artist' || enemy.type === 'proofreader' ? .36 : 1;
  enemy.knockbackVelocity.addScaledVector(push, (headshot ? 4.2 : 2.6) * mass);

  if (headshot) {
    playImpactSound('head');
    impactFovKick = Math.max(impactFovKick, 2.2);
    recoilKick = Math.min(1.2, recoilKick + .11);
    showCombatMessage(killed ? 'HEADSHOT // TARGET DOWN' : 'HEADSHOT');
  } else {
    playImpactSound('body');
  }

  spawnInkBurst(hitPoint, headshot ? 16 : 9, headshot ? .52 : .34);
  if (killed) startEnemyDeath(enemy, part);
}

function enemyHasLineOfSight(enemy, targetPos) {
  const origin = enemy.group.position.clone().add(new THREE.Vector3(0, 1.3, 0));
  const direction = targetPos.clone().sub(origin);
  const dist = direction.length();
  direction.normalize();
  enemyRaycaster.set(origin, direction);
  enemyRaycaster.far = dist;
  const blockers = enemyRaycaster.intersectObjects(sketchMeshes, false).filter(hit => hit.object.visible);
  return blockers.length === 0 || blockers[0].distance > dist - .3;
}

function enemyCanMoveAt(x, z, radius = .34) {
  for (const box of colliders) {
    if (1.7 <= box.min.y || 0 >= box.max.y) continue;
    if (x + radius > box.min.x && x - radius < box.max.x && z + radius > box.min.z && z - radius < box.max.z) return false;
  }
  return true;
}

function moveEnemyToward(enemy, target, dt, speed) {
  if (pointInInkPuddle(enemy.navPosition.x, enemy.navPosition.z)) speed *= .55;
  const dir = target.clone().sub(enemy.navPosition);
  dir.y = 0;
  if (dir.lengthSq() < .02) return;
  dir.normalize();
  const nx = enemy.navPosition.x + dir.x * speed * dt;
  const nz = enemy.navPosition.z + dir.z * speed * dt;
  if (enemyCanMoveAt(nx, enemy.navPosition.z, enemy.type === 'guardian' ? .58 : .34)) enemy.navPosition.x = nx;
  if (enemyCanMoveAt(enemy.navPosition.x, nz, enemy.type === 'guardian' ? .58 : .34)) enemy.navPosition.z = nz;
}

function updateSniperTelegraph(enemy, now, target) {
  const remaining = enemy.nextShotAt - now;
  const shouldAim = remaining > 0 && remaining < 760 && enemyHasLineOfSight(enemy, target);
  if (!shouldAim) {
    if (enemy.aimLine) enemy.aimLine.visible = false;
    return;
  }
  const origin = enemy.group.position.clone().add(new THREE.Vector3(0, 1.45, 0));
  if (!enemy.aimLine) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(6), 3));
    const material = new THREE.LineBasicMaterial({ color: INK_DARK, transparent: true, opacity: .32 });
    enemy.aimLine = new THREE.Line(geometry, material);
    scene.add(enemy.aimLine);
  }
  const arr = enemy.aimLine.geometry.attributes.position.array;
  arr[0] = origin.x; arr[1] = origin.y; arr[2] = origin.z;
  arr[3] = target.x; arr[4] = target.y; arr[5] = target.z;
  enemy.aimLine.geometry.attributes.position.needsUpdate = true;
  enemy.aimLine.visible = true;
}

function enemyShoot(enemy) {
  if (!controlSessionActive() || roundState !== 'active' || playerHealth <= 0) return;
  if (enemy.type === 'artist') {
    artistShoot(enemy);
    return;
  }
  const origin = enemy.group.position.clone().add(new THREE.Vector3(0, enemy.type === 'guardian' ? 1.65 : 1.32, 0));
  const target = camera.position.clone();
  const dist = origin.distanceTo(target);
  const cfg = enemy.config;

  if (cfg.behavior === 'rusher') {
    if (dist <= cfg.range + .35) {
      enemy.lastFiredAt = performance.now();
      playEnemyShotSound('rusher');
      addTemporaryTracer(origin, target.clone());
      damagePlayer((cfg.damageMin + Math.random() * (cfg.damageMax - cfg.damageMin)) * (1 + (pageNumber - 1) * .06));
    }
    return;
  }

  if (dist > cfg.range || !enemyHasLineOfSight(enemy, target)) return;
  enemy.lastFiredAt = performance.now();
  playEnemyShotSound(enemy.type);
  addTemporaryTracer(origin, target.clone().add(new THREE.Vector3((Math.random()-.5)*.35, (Math.random()-.5)*.25, (Math.random()-.5)*.35)));
  const distanceFactor = THREE.MathUtils.clamp(1 - dist / Math.max(1, cfg.range * 1.35), 0, 1);
  let accuracy = THREE.MathUtils.lerp(cfg.accuracyMin, cfg.accuracyMax, distanceFactor);
  if (enemy.type === 'sniper' && crouching && upgradeState.quietOutline) accuracy *= .35;
  if (Math.random() < accuracy) {
    const damage = cfg.damageMin + Math.random() * (cfg.damageMax - cfg.damageMin);
    damagePlayer(damage * (1 + (pageNumber - 1) * .06));
  }
}

function addTemporaryTracer(a, b) {
  const mid = a.clone().lerp(b, .5).add(new THREE.Vector3((Math.random()-.5)*.12, (Math.random()-.5)*.08, (Math.random()-.5)*.12));
  const tracer = addScribbleLine([a, mid, b], .42);
  setTimeout(() => scene.remove(tracer), 90);
}

function activeEnemyCount() {
  return enemies.filter(enemy => enemy.activeInRound && (enemy.alive || enemy.dying)).length;
}

function chooseSpawnPoint(spawnOrdinal) {
  const candidates = enemySpawnPoints
    .map((p, i) => ({ p, i, d: Math.hypot(camera.position.x - p[0], camera.position.z - p[1]) }))
    .filter(item => item.d > 10)
    .sort((a, b) => ((a.i * 7 + spawnOrdinal * 5) % 17) - ((b.i * 7 + spawnOrdinal * 5) % 17));
  return (candidates[spawnOrdinal % Math.max(1, candidates.length)] || { p: enemySpawnPoints[spawnOrdinal % enemySpawnPoints.length] }).p;
}

function spawnNextEnemies(now = performance.now()) {
  if (roundState !== 'active') return;
  const def = ROUND_DEFINITIONS[currentRoundIndex];
  while (roundSpawned < def.queue.length && activeEnemyCount() < def.cap) {
    const enemy = enemies.find(e => !e.activeInRound && !e.alive && !e.dying && now >= e.availableAt);
    if (!enemy) break;
    const type = def.queue[roundSpawned];
    if (type === 'artist' && activeEnemyCount() > 0) break;
    const spawn = type === 'artist' ? [0, -24] : chooseSpawnPoint(roundSpawned);
    const ordinal = roundSpawned;
    configureEnemy(enemy, type, spawn);
    enemy.objectiveMarked = !!(arenaObjective && arenaObjective.id === 'marked' && ordinal === arenaObjective.markedOrdinal);
    if (enemy.objectiveMarked) {
      if (enemy.typeLabel) enemy.visual.remove(enemy.typeLabel);
      enemy.typeLabel = makeEnemyLabel(`MARKED // ${enemy.config.label}`);
      enemy.visual.add(enemy.typeLabel);
    }
    roundSpawned += 1;
  }

  const persistentObjective = arenaObjective && ['hold','relay','inkrun','breakout','delivery','dontstop','nomargin'].includes(arenaObjective.id) && !arenaObjective.completed;
  if (persistentObjective && roundSpawned >= def.queue.length && activeEnemyCount() < Math.min(2, def.cap) && now >= objectiveNextReinforcementAt) {
    const enemy = enemies.find(e => !e.activeInRound && !e.alive && !e.dying && now >= e.availableAt);
    if (enemy) {
      const fallbackTypes = currentRoundIndex >= 2 ? ['rifleman','rusher','flanker'] : ['rifleman','rusher'];
      const type = fallbackTypes[(roundKills + pageNumber + currentRoundIndex) % fallbackTypes.length];
      configureEnemy(enemy, type, chooseSpawnPoint(roundKills + 11));
      enemy.objectiveMarked = false;
      objectiveNextReinforcementAt = now + 2200;
    }
  }
}

function showRoundBanner(kicker, title, subtitle, duration = 1800) {
  roundBannerKickerEl.textContent = kicker;
  roundBannerTitleEl.textContent = title;
  roundBannerSubtitleEl.textContent = subtitle;
  roundBannerEl.classList.add('visible');
  roundBannerHideAt = performance.now() + duration;
}

function updateInkHud() {
  const txt = String(Math.max(0, Math.floor(inkTotal))).padStart(3,'0');
  if (inkCountEl) inkCountEl.textContent = txt;
  if (upgradeInkEl) upgradeInkEl.textContent = `INK // ${txt}`;
}

function awardInk(amount, reason = '') {
  inkTotal += Math.max(0, Math.round(amount));
  updateInkHud();
  if (amount >= 50 && reason) showCombatMessage(`+${Math.round(amount)} INK // ${reason}`, 650);
}

function makeObjectiveMarker() {
  const group = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({ color: INK, transparent:true, opacity:.72 });
  for (let pass=0; pass<3; pass++) {
    const pts=[]; const r=1.55+pass*.07;
    for (let i=0;i<46;i++) { const a=i/46*Math.PI*2; pts.push(new THREE.Vector3(Math.cos(a)*r,.035+pass*.01,Math.sin(a)*r)); }
    group.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), mat.clone()));
  }
  group.visible=false; scene.add(group); return group;
}

arenaObjectiveMarker = makeObjectiveMarker();

function clearObjectiveTokens() {
  objectiveTokens.forEach(t => {
    scene.remove(t.group);
    t.group.traverse(o=>{ o.geometry?.dispose?.(); if(o.material && o.material!==paperMaterial && o.material!==paperShadeMaterial) o.material.dispose?.(); });
  });
  objectiveTokens=[];
}

function clearArenaObjectiveVisuals() {
  arenaObjectiveMarker.visible=false;
  arenaObjectiveMarker.scale.set(1,1,1);
  clearObjectiveTokens();
  arenaObjectiveEl?.classList.remove('active');
}

function spawnObjectiveToken(x,z,index) {
  const group=new THREE.Group();
  const g=new THREE.BoxGeometry(.44,.62,.32);
  const mesh=new THREE.Mesh(g,paperShadeMaterial); addSketchOutlines(mesh,g,true); group.add(mesh);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.54,.60,24),new THREE.MeshBasicMaterial({color:INK,side:THREE.DoubleSide,transparent:true,opacity:.34}));
  ring.rotation.x=-Math.PI/2; ring.position.y=-.28; group.add(ring);
  group.position.set(x,.55,z); scene.add(group);
  objectiveTokens.push({group,index,collected:false,phase:Math.random()*5});
}

function chooseObjectiveForRound(roundIndex) {
  if (roundIndex === 4) return ARENA_OBJECTIVES[0];
  if (pageNumber === 1) return [ARENA_OBJECTIVES[0],ARENA_OBJECTIVES[1],ARENA_OBJECTIVES[2],ARENA_OBJECTIVES[3]][roundIndex];
  const pool=[ARENA_OBJECTIVES[4],ARENA_OBJECTIVES[5],ARENA_OBJECTIVES[6],ARENA_OBJECTIVES[7],ARENA_OBJECTIVES[8],ARENA_OBJECTIVES[2],ARENA_OBJECTIVES[3],ARENA_OBJECTIVES[1]];
  return pool[(pageNumber + roundIndex - 2) % pool.length];
}

function beginArenaObjective() {
  clearArenaObjectiveVisuals();
  const def=ROUND_DEFINITIONS[currentRoundIndex];
  const base=chooseObjectiveForRound(currentRoundIndex);
  arenaObjective={ id:base.id,label:base.label,text:base.text,progress:0,target:1,completed:false,index:0,startedAt:performance.now(),lastTickAt:0,markedOrdinal:Math.min(2,def.queue.length-1),exitOpen:false };
  objectiveNextReinforcementAt = performance.now() + 2600;
  if (base.id==='erase') arenaObjective.target=def.queue.length;
  if (base.id==='hold') { arenaObjective.target=18; arenaObjective.point=new THREE.Vector3(0,0,8); arenaObjectiveMarker.position.copy(arenaObjective.point); arenaObjectiveMarker.visible=true; }
  if (base.id==='relay') { arenaObjective.points=[new THREE.Vector3(-15,0,11),new THREE.Vector3(15,0,2),new THREE.Vector3(0,0,-17)]; arenaObjective.target=3; arenaObjectiveMarker.position.copy(arenaObjective.points[0]); arenaObjectiveMarker.visible=true; }
  if (base.id==='marked') arenaObjective.target=1;
  if (base.id==='inkrun') { arenaObjective.target=3; [[-16,9],[16,-4],[0,-19]].forEach((p,i)=>spawnObjectiveToken(p[0],p[1],i)); }
  if (base.id==='breakout') { arenaObjective.target=1; arenaObjective.requiredKills=2; arenaObjective.exitPoint=new THREE.Vector3(0,0,-29); }
  if (base.id==='delivery') { arenaObjective.target=2; arenaObjective.pickupPoint=new THREE.Vector3(-18,0,18); arenaObjective.dropPoint=new THREE.Vector3(18,0,-18); arenaObjective.carrying=false; arenaObjectiveMarker.position.copy(arenaObjective.pickupPoint); arenaObjectiveMarker.visible=true; }
  if (base.id==='dontstop') { arenaObjective.target=22; arenaObjective.stillTime=0; }
  if (base.id==='nomargin') { arenaObjective.target=25; arenaObjective.point=new THREE.Vector3(0,0,0); arenaObjective.safeRadius=27; arenaObjectiveMarker.position.copy(arenaObjective.point); arenaObjectiveMarker.visible=true; arenaObjectiveMarker.scale.set(17,1,17); }
  arenaObjectiveEl?.classList.add('active');
  updateArenaObjectiveHud();
}

function updateArenaObjectiveHud() {
  if (!arenaObjective) return;
  arenaObjectiveKickerEl.textContent=`OBJECTIVE // ${arenaObjective.label}`;
  arenaObjectiveTextEl.textContent=arenaObjective.text;
  let ratio=0, progress='';
  if (arenaObjective.id==='hold' || arenaObjective.id==='nomargin' || arenaObjective.id==='dontstop') {
    ratio=THREE.MathUtils.clamp(arenaObjective.progress/arenaObjective.target,0,1);
    progress=`${arenaObjective.progress.toFixed(1)} / ${arenaObjective.target}s`;
  } else if (arenaObjective.id==='breakout') {
    ratio=arenaObjective.exitOpen ? 1 : THREE.MathUtils.clamp(roundKills/arenaObjective.requiredKills,0,1);
    progress=arenaObjective.exitOpen ? 'EXIT OPEN // REACH THE MARK' : `${Math.min(roundKills,arenaObjective.requiredKills)} / ${arenaObjective.requiredKills} CONTACTS`;
  } else {
    ratio=THREE.MathUtils.clamp(arenaObjective.progress/Math.max(1,arenaObjective.target),0,1);
    progress=`${Math.floor(arenaObjective.progress)} / ${arenaObjective.target}`;
  }
  objectiveFillEl.style.transform=`scaleX(${ratio})`;
  arenaObjectiveProgressEl.textContent=progress;
}

function completeArenaObjective(now=performance.now()) {
  if (!arenaObjective || arenaObjective.completed || roundState!=='active') return;
  arenaObjective.completed=true;
  awardInk(100 + currentRoundIndex*25 + Math.min(60,(pageNumber-1)*10), 'OBJECTIVE');
  clearArenaObjectiveVisuals();
  finishCurrentRound(now);
}

function updateArenaObjective(now,dt) {
  if (gameMode!=='arena' || roundState!=='active' || !arenaObjective) return;
  if (arenaObjective.id==='erase') {
    arenaObjective.progress=roundKills;
    if (roundKills>=arenaObjective.target && activeEnemyCount()===0) completeArenaObjective(now);
  } else if (arenaObjective.id==='marked') {
    if (arenaObjective.progress>=1) completeArenaObjective(now);
  } else if (arenaObjective.id==='hold') {
    const d=Math.hypot(camera.position.x-arenaObjective.point.x,camera.position.z-arenaObjective.point.z);
    if (d<2.0) arenaObjective.progress=Math.min(arenaObjective.target,arenaObjective.progress+dt);
    else arenaObjective.progress=Math.max(0,arenaObjective.progress-dt*.16);
    const pulse=1+Math.sin(now*.004)*.05; arenaObjectiveMarker.scale.set(pulse,pulse,pulse);
    if (arenaObjective.progress>=arenaObjective.target) completeArenaObjective(now);
  } else if (arenaObjective.id==='relay') {
    const p=arenaObjective.points[arenaObjective.index];
    if (p && Math.hypot(camera.position.x-p.x,camera.position.z-p.z)<1.9) {
      arenaObjective.index++; arenaObjective.progress=arenaObjective.index; playTone(420,760,.12,.018,'triangle');
      if (arenaObjective.index>=arenaObjective.points.length) completeArenaObjective(now);
      else arenaObjectiveMarker.position.copy(arenaObjective.points[arenaObjective.index]);
    }
  } else if (arenaObjective.id==='inkrun') {
    objectiveTokens.forEach(t=>{
      if(t.collected) return;
      t.group.rotation.y=now*.0012+t.phase; t.group.position.y=.55+Math.sin(now*.004+t.phase)*.1;
      if(Math.hypot(camera.position.x-t.group.position.x,camera.position.z-t.group.position.z)<1.35){t.collected=true;t.group.visible=false;arenaObjective.progress++;awardInk(18,'CARTRIDGE');playPickupSound('ammo');}
    });
    if(arenaObjective.progress>=arenaObjective.target) completeArenaObjective(now);
  } else if (arenaObjective.id==='breakout') {
    if(!arenaObjective.exitOpen && roundKills>=arenaObjective.requiredKills){arenaObjective.exitOpen=true;arenaObjectiveMarker.position.copy(arenaObjective.exitPoint);arenaObjectiveMarker.visible=true;showCombatMessage('EXIT DRAWN // MOVE',750);}
    if(arenaObjective.exitOpen && Math.hypot(camera.position.x-arenaObjective.exitPoint.x,camera.position.z-arenaObjective.exitPoint.z)<2.0) completeArenaObjective(now);
  } else if (arenaObjective.id==='delivery') {
    const targetPoint=arenaObjective.carrying?arenaObjective.dropPoint:arenaObjective.pickupPoint;
    if(Math.hypot(camera.position.x-targetPoint.x,camera.position.z-targetPoint.z)<1.9){
      if(!arenaObjective.carrying){arenaObjective.carrying=true;arenaObjective.progress=1;arenaObjectiveMarker.position.copy(arenaObjective.dropPoint);arenaObjective.text='DELIVER THE MARK TO THE FAR CIRCLE';showCombatMessage('MARK PICKED UP // MOVE',650);}
      else {arenaObjective.progress=2;completeArenaObjective(now);}
    }
  } else if (arenaObjective.id==='dontstop') {
    const speed=Math.hypot(velocity.x,velocity.z);
    if(speed>2.4){arenaObjective.progress=Math.min(arenaObjective.target,arenaObjective.progress+dt);arenaObjective.stillTime=0;}
    else {arenaObjective.stillTime+=dt;if(arenaObjective.stillTime>.8) arenaObjective.progress=Math.max(0,arenaObjective.progress-dt*.4);}
    if(arenaObjective.progress>=arenaObjective.target) completeArenaObjective(now);
  } else if (arenaObjective.id==='nomargin') {
    arenaObjective.progress=Math.min(arenaObjective.target,(now-arenaObjective.startedAt)/1000);
    arenaObjective.safeRadius=THREE.MathUtils.lerp(27,8,arenaObjective.progress/arenaObjective.target);
    arenaObjectiveMarker.scale.set(arenaObjective.safeRadius/1.55,1,arenaObjective.safeRadius/1.55);
    const d=Math.hypot(camera.position.x,camera.position.z);
    if(d>arenaObjective.safeRadius && now-objectiveLastDamageAt>760){objectiveLastDamageAt=now;damagePlayer(8);showCombatMessage('OUTSIDE THE MARGIN',360);}
    if(arenaObjective.progress>=arenaObjective.target) completeArenaObjective(now);
  }
  updateArenaObjectiveHud();
}

function resetUpgradeState() {
  Object.assign(upgradeState,{damageMul:1,reloadMul:1,spreadMul:1,moveMul:1,headshotMul:1,fireRateMul:1,damageTakenMul:1,dashCooldownMul:1,sprintDrainMul:1,maxHealthBonus:0,healOnKill:0,knifeHeal:0,ammoRefundChance:0,lastWord:false,lowHealthDamage:false,dashDamage:false,slideFeed:false,riflePenetration:false,markerSplash:false,shotgunRicochet:false,pistolPop:false,smgRamp:false,quietOutline:false,cubeShock:false,killStamina:false});
  upgradeStacks.clear(); playerMaxHealth=100;
}

function renderUpgradeCards() {
  if(!upgradeCardsEl) return;
  upgradeCardsEl.innerHTML='';
  upgradeChoices.forEach((u,i)=>{
    const btn=document.createElement('button'); btn.className='upgrade-card'+(inkTotal<u.cost?' unaffordable':'');
    btn.innerHTML=`<span class="slot">${i+1}</span><b>${u.name}</b><p>${u.desc}</p><small>${u.cost} INK // ${(upgradeStacks.get(u.id)||0)+1}/${u.max}</small>`;
    btn.addEventListener('click',()=>chooseUpgrade(i)); upgradeCardsEl.appendChild(btn);
  });
  updateInkHud();
}

function openUpgradeDraft() {
  const eligible=UPGRADES.filter(u=>(upgradeStacks.get(u.id)||0)<u.max);
  if(!eligible.length){ scheduleNextRoundAfterUpgrade(); return; }
  upgradeChoices=[]; const pool=[...eligible];
  while(upgradeChoices.length<Math.min(3,pool.length)){const i=Math.floor(Math.random()*pool.length);upgradeChoices.push(pool.splice(i,1)[0]);}
  if (upgradeChoices.every(u=>u.cost>inkTotal)) {
    const affordable=eligible.filter(u=>u.cost<=inkTotal).sort((a,b)=>a.cost-b.cost)[0];
    if (affordable) upgradeChoices[0]=affordable;
  }
  upgradeChoosing=true; roundState='upgrade'; triggerHeld=false; rightMouseDown=false; isAiming=false;
  renderUpgradeCards(); upgradeScreenEl.classList.add('visible');
  leaveControlSessionForOverlay();
}

function chooseUpgrade(index) {
  if(!upgradeChoosing) return;
  const u=upgradeChoices[index]; if(!u) return;
  if(inkTotal<u.cost){playTone(140,90,.08,.015,'square');return;}
  inkTotal-=u.cost; upgradeStacks.set(u.id,(upgradeStacks.get(u.id)||0)+1); u.apply(); updateInkHud();
  upgradeChoosing=false; upgradeScreenEl.classList.remove('visible');
  showCombatMessage(`${u.name} // DRAWN IN`,900); playMapDrawSound();
  scheduleNextRoundAfterUpgrade();
  resumeControlSessionAfterOverlay();
}

function scheduleNextRoundAfterUpgrade() {
  roundState='intermission'; nextRoundAt=performance.now()+850;
}

function updateRoundHud() {
  updateInkHud();
  if (gameMode === 'story') {
    const chapterOne = selectedStoryChapter === 1;
    const chapterTwo = selectedStoryChapter === 2;
    mapNameEl.textContent = chapterTwo ? 'CORRECTION ARCHIVE' : (chapterOne ? 'WRONG PAGE' : 'MARGIN DISTRICT');
    pageLabelEl.textContent = 'CHAPTER';
    pageCountEl.textContent = chapterTwo ? 'TWO' : (chapterOne ? 'ONE' : 'ZERO');
    roundLabelEl.textContent = 'SECTION';
    if (chapterTwo) {
      const labels = {
        waking:'INTAKE', archiveApproach:'INTAKE YARD', archivePatrol:'PATROL', archiveTerminal:'ARCHIVE', defenseApproach:'INK PRESS', defense:'HOLD', corridorRun:'CORRECTION RUN', proofreader:'PROOFREADER', endingDialogue:'EXIT', complete:'COMPLETE'
      };
      roundCountEl.textContent = labels[storyState] || 'CORRECTIONS';
      const inCombat = ['archivePatrol','defense','corridorRun','proofreader'].includes(storyState) && roundState === 'active';
      targetLabelEl.textContent = storyState === 'defense' ? 'PRESS' : (inCombat ? 'CONTACTS' : 'SIGNAL');
      targetCountEl.textContent = storyState === 'defense' && storyDefenseEndsAt ? `${Math.max(0, Math.ceil((storyDefenseEndsAt-performance.now())/1000))}s` : (inCombat ? `${storyKills} / ${storyKillsRequired}` : '---');
    } else if (chapterOne) {
      const labels = {
        waking:'ARRIVAL', introDialogue:'ARRIVAL', wrongPageWalk:'UNFINISHED STREET', firstChoice:'MARA', bridgeApproach:'BROKEN CROSSING', bridgeFight:'CORRECTORS', correction:'CORRECTION ZONE', finalRun:'RUN', endingDialogue:'EXIT', complete:'COMPLETE'
      };
      roundCountEl.textContent = labels[storyState] || 'WRONG PAGE';
      const inCombat = (storyState === 'bridgeFight' || storyState === 'correction') && roundState === 'active';
      targetLabelEl.textContent = inCombat ? 'CONTACTS' : 'SIGNAL';
      targetCountEl.textContent = inCombat ? `${storyKills} / ${storyKillsRequired}` : '---';
    } else {
      roundCountEl.textContent = storyState === 'complete' ? 'COMPLETE' : (storyState === 'combatTwo' ? 'RELAY AMBUSH' : (storyState === 'relay' || storyState === 'relayDialogue' ? 'THE RELAY' : 'THE MARGIN'));
      const inCombat = storyState === 'combatOne' || storyState === 'combatTwo';
      targetLabelEl.textContent = inCombat ? 'CONTACTS' : (storyState === 'relay' ? 'RELAY' : 'SIGNAL');
      targetCountEl.textContent = inCombat ? `${storyKills} / ${storyKillsRequired}` : (storyState === 'extract' ? 'EXIT' : '---');
    }
    arenaObjectiveEl?.classList.remove('active');
    return;
  }
  const def = ROUND_DEFINITIONS[currentRoundIndex];
  mapNameEl.textContent = 'SKETCHYARD XL';
  pageLabelEl.textContent = 'PAGE';
  pageCountEl.textContent = pageNumber;
  roundLabelEl.textContent = 'ROUND';
  roundCountEl.textContent = `${currentRoundIndex + 1} / ${ROUND_DEFINITIONS.length}`;
  targetLabelEl.textContent = arenaObjective ? 'OBJECTIVE' : 'THREATS';
  targetCountEl.textContent = arenaObjective ? arenaObjective.label : `${roundKills} / ${def.queue.length}`;
}

// ---------- Subtle directional awareness ----------
const awarenessArrowPool = [];
function makeAwarenessArrow() {
  const el = document.createElement('div');
  el.className = 'awareness-arrow';
  el.innerHTML = '<span class="awareness-dot"></span>';
  awarenessLayerEl?.appendChild(el);
  awarenessArrowPool.push(el);
  return el;
}
for (let i = 0; i < 4; i++) makeAwarenessArrow();

const awarenessTmp = new THREE.Vector3();
const awarenessLocal = new THREE.Vector3();
function positionAwarenessArrow(el, worldPos, kind, recent, distance) {
  awarenessTmp.copy(worldPos).add(new THREE.Vector3(0, 1.1, 0));
  awarenessLocal.copy(awarenessTmp).applyMatrix4(camera.matrixWorldInverse);
  const behind = awarenessLocal.z > 0;
  const projected = awarenessTmp.clone().project(camera);
  let x = projected.x, y = projected.y;
  if (behind) { x = -x; y = -y; }
  const onScreen = !behind && Math.abs(x) < .78 && Math.abs(y) < .68;
  if (onScreen && !(recent && kind === 'enemy' && Math.abs(x) > .52)) return false;

  const angle = Math.atan2(-y, x || .0001);
  const rx = Math.min(innerWidth * .39, 520);
  const ry = Math.min(innerHeight * .34, 310);
  const px = innerWidth * .5 + Math.cos(angle) * rx;
  const py = innerHeight * .5 - Math.sin(angle) * ry;
  const rotation = angle * 180 / Math.PI + 90;
  const distanceFade = kind === 'objective' ? .48 : THREE.MathUtils.clamp(1 - distance / 42, .22, .62);
  el.className = `awareness-arrow visible ${kind}${recent ? ' recent' : ''}`;
  el.style.left = `${px}px`;
  el.style.top = `${py}px`;
  el.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
  el.style.setProperty('--arrow-opacity', String(recent ? Math.max(.58, distanceFade) : distanceFade));
  return true;
}

function updateAwarenessIndicators(now) {
  awarenessArrowPool.forEach(el => el.className = 'awareness-arrow');
  if (!awarenessLayerEl || !controlSessionActive() || storyDialogueBlocking || upgradeChoosing) return;
  camera.updateMatrixWorld(true);

  let slot = 0;
  const objectiveMarker = gameMode === 'story'
    ? (storyMarker?.visible ? storyMarker : null)
    : (arenaObjectiveMarker?.visible ? arenaObjectiveMarker : null);
  if (objectiveMarker && slot < awarenessArrowPool.length) {
    const d = camera.position.distanceTo(objectiveMarker.position);
    if (positionAwarenessArrow(awarenessArrowPool[slot], objectiveMarker.position, 'objective', false, d)) slot++;
  }

  // Awareness is deliberately incomplete: only nearby off-screen threats or enemies
  // that recently fired reveal themselves. Hunting quiet enemies remains part of play.
  const threats = enemies
    .filter(e => e.alive && !e.dying && e.activeInRound && e.group.visible)
    .map(e => ({ e, d: camera.position.distanceTo(e.group.position), recent: now - e.lastFiredAt < 2800 }))
    .filter(t => t.recent || t.d < 19)
    .sort((a,b) => Number(b.recent)-Number(a.recent) || a.d-b.d)
    .slice(0, 3);
  for (const threat of threats) {
    if (slot >= awarenessArrowPool.length) break;
    if (positionAwarenessArrow(awarenessArrowPool[slot], threat.e.group.position, 'enemy', threat.recent, threat.d)) slot++;
  }
}

function resetRunToBoot() {
  triggerHeld = false;
  rightMouseDown = false;
  rightMouseBecameAim = false;
  isAiming = false;
  isReloading = false;
  weaponRig.visible = true;
  document.body.classList.remove('aiming', 'scoped');
  scopeOverlayEl.classList.remove('visible');
  bossHudEl.classList.remove('visible');
  roundBannerEl.classList.remove('visible');
  combatMessageEl.classList.remove('visible');

  enemies.forEach(deactivateEnemy);
  clearDynamicStructures();
  clearArenaObjectiveVisuals();
  arenaObjective = null;
  activeArtist = null;
  upgradeChoosing = false;
  upgradeChoices = [];
  upgradeScreenEl?.classList.remove('visible');
  inkTotal = 0;
  resetUpgradeState();
  storyBridgeBuilt = false;
  if (storyBridgeBarrier) { storyBridgeBarrier.visible = true; restoreColliderForMesh(storyBridgeBarrier); }
  storyNotes.forEach(n => n.read = false);
  nearbyStoryNote = null;
  explosiveBarrels.forEach(b => { b.userData.hp = 42; b.userData.exploded = false; b.visible = true; restoreColliderForMesh(b); });
  breakableWalls.forEach(w => { w.userData.hp = 125; w.visible = true; restoreColliderForMesh(w); });
  eraserCovers.forEach(e => { e.erased = false; e.cover.visible = true; restoreColliderForMesh(e.cover); });
  storyState = 'boot';
  storyStage = 0;
  storyNextAt = 0;
  storyKills = 0;
  storyKillsRequired = 0;
  activeStoryEncounterId = 0;
  storyCompletionAt = 0;
  storyInputLocked = false;
  storyDialogueBlocking = false;
  storyDialogueQueue = [];
  storyDialogueIndex = 0;
  storyDialogueOnComplete = null;
  storyWakeStartedAt = 0;
  storyWakeOpening = false;
  storySetpieceStage = 0;
  storyChoiceResolved = false;
  storyFlags = { trustedMara:false, ignoredMara:false, relayTouched:false, answeredUnknown:false };
  storyCheckpoint.copy(selectedStoryChapter === 2 ? STORY_TWO_SPAWN : (selectedStoryChapter === 1 ? STORY_ONE_SPAWN : STORY_SPAWN));
  storyDefenseEndsAt = 0;
  storyDefenseWave = 0;
  storyRunAmbushSpawned = false;
  storyWakeOverlayEl.classList.remove('visible', 'opening');
  storyDialogueScreenEl.classList.remove('visible');
  document.body.classList.remove('story-dialogue-open');
  controls.pointerSpeed = Number(sensitivitySetting?.value || .78);
  storyHudEl.classList.remove('visible');
  if (storyMarker) storyMarker.visible = false;

  pageNumber = 1;
  currentRoundIndex = 0;
  roundState = 'boot';
  roundSpawned = 0;
  roundKills = 0;
  totalKills = 0;
  nextRoundAt = 0;
  roundWarmupUntil = 0;
  roundBannerHideAt = 0;

  if (gameMode === 'story') camera.position.copy(selectedStoryChapter === 2 ? STORY_TWO_SPAWN : (selectedStoryChapter === 1 ? STORY_ONE_SPAWN : STORY_SPAWN));
  else camera.position.set(0, STAND_EYE_HEIGHT, 16);
  camera.fov = userBaseFov;
  camera.updateProjectionMatrix();
  velocity.set(0, 0, 0);
  verticalOffset = 0;
  currentEyeHeight = STAND_EYE_HEIGHT;
  crouching = false;
  sliding = false;
  slideTimer = 0;
  slideSpeed = 0;
  dashTimer = 0;
  dashReadyAt = 0;
  isSprinting = false;
  stamina = 100;
  playerHealth = playerMaxHealth;
  playerInvulnerableUntil = 0;

  unlockedWeapons.clear();
  unlockedWeapons.add('knife');
  unlockedWeapons.add('carbine');
  unlockedWeapons.add('pistol');
  Object.entries(WEAPON_PROFILES).forEach(([id, w]) => {
    weaponStates[id].ammo = w.magSize;
    weaponStates[id].reserve = w.startReserve;
  });
  currentWeaponId = 'carbine';
  ammoCurrent = weaponStates.carbine.ammo;
  ammoReserve = weaponStates.carbine.reserve;
  reloadAmmoCommitted = false;
  seatedMagazine.visible = true;
  spareMagazine.visible = false;
  chargingHandle.position.z = CHARGE_BASE_Z;
  applyWeaponVisualProfile();

  pickups.forEach(p => {
    p.active = true;
    p.group.visible = true;
    p.respawnAt = 0;
  });

  updateAmmoHud();
  updateHealthHud();
  updateInkHud();
  updateRoundHud();
  staminaFill.style.transform = 'scaleX(1)';
  staminaValue.textContent = '100';
  movementNoteEl.textContent = '';
  movementNoteEl.classList.remove('active', 'aiming');
  document.body.classList.toggle('story-mode', gameMode === 'story');
}


function refillBetweenRounds() {
  playerHealth = Math.min(playerMaxHealth, playerHealth + 28);
  playerInvulnerableUntil = performance.now() + 1500;
  updateHealthHud();
  refillUnlockedWeaponAmmo(.28);
}

function startRound(roundNumber) {
  currentRoundIndex = THREE.MathUtils.clamp(roundNumber - 1, 0, ROUND_DEFINITIONS.length - 1);
  const def = ROUND_DEFINITIONS[currentRoundIndex];
  roundState = 'warmup';
  roundSpawned = 0;
  roundKills = 0;
  enemies.forEach(deactivateEnemy);
  clearArenaObjectiveVisuals();
  arenaObjective = null;

  if (currentRoundIndex === 0 && pageNumber === 1) {
    playerHealth = playerMaxHealth;
    playerInvulnerableUntil = performance.now() + 2200;
  } else {
    refillBetweenRounds();
  }

  if (def.unlock) unlockWeapon(def.unlock, true);
  redrawArenaForRound(currentRoundIndex, 0);
  beginArenaObjective();
  updateRoundHud();
  roundWarmupUntil = performance.now() + (currentRoundIndex === 4 ? 1900 : 1350);
  showRoundBanner(`PAGE ${pageNumber}`, `ROUND ${currentRoundIndex + 1} // ${def.title}`, `${arenaObjective.label} // ${arenaObjective.text}`, currentRoundIndex === 4 ? 2600 : 2200);
  playRoundStinger('round');
}

function finishCurrentRound(now) {
  if (roundState !== 'active') return;
  roundState = 'reward';
  triggerHeld = false;
  isAiming = false;
  rightMouseDown = false;
  enemies.forEach(deactivateEnemy);
  clearArenaObjectiveVisuals();
  playRoundStinger('complete');
  const lastRound = currentRoundIndex === ROUND_DEFINITIONS.length - 1;
  if (lastRound) showRoundBanner(`PAGE ${pageNumber}`, 'PAGE COMPLETE', `${totalKills} TOTAL TARGETS ERASED // REDRAW YOURSELF`, 2400);
  else showRoundBanner(`ROUND ${currentRoundIndex + 1} COMPLETE`, '+ INK // UPGRADE AVAILABLE', 'CHOOSE WHAT TO DRAW BEFORE THE NEXT ROUND', 2200);
  setTimeout(() => {
    if (gameMode === 'arena' && roundState === 'reward') openUpgradeDraft();
  }, 650);
}

function updateRoundProgression(now) {
  if (roundBannerEl.classList.contains('visible') && now >= roundBannerHideAt) roundBannerEl.classList.remove('visible');
  if (gameMode !== 'arena') return;
  if (!controlSessionActive() && !upgradeChoosing) return;

  if (roundState === 'warmup' && now >= roundWarmupUntil) {
    roundState = 'active';
    playerInvulnerableUntil = Math.max(playerInvulnerableUntil, now + 650);
    spawnNextEnemies(now);
  } else if (roundState === 'active') {
    spawnNextEnemies(now);
  } else if (roundState === 'intermission' && now >= nextRoundAt) {
    if (currentRoundIndex >= ROUND_DEFINITIONS.length - 1) {
      pageNumber += 1;
      startRound(1);
    } else {
      startRound(currentRoundIndex + 2);
    }
  }
}

function showStoryDialogue(speaker, text, objective) {
  // Small in-world HUD now carries only short radio echoes/objective context.
  storySpeakerEl.textContent = speaker;
  storyDialogueTextEl.textContent = text;
  if (objective) storyObjectiveTextEl.textContent = objective;
  storyHudEl.classList.add('visible');
  updateRoundHud();
}

function setStoryMarker(position, visible = true) {
  if (!storyMarker) return;
  storyMarker.position.copy(position);
  storyMarker.visible = visible;
}

function renderStoryDialoguePage() {
  const line = storyDialogueQueue[storyDialogueIndex];
  if (!line) return;
  storyScreenKickerEl.textContent = line.kicker || 'RADIO LINK // OPEN';
  storyScreenSpeakerEl.textContent = line.speaker || 'MARA';
  storyScreenTextEl.textContent = line.text || '';
  storyDialogueProgressEl.textContent = `${storyDialogueIndex + 1} / ${storyDialogueQueue.length}`;
  storyChoiceListEl.innerHTML = '';
  const hasChoices = !!line.choices?.length;
  storyDialogueScreenEl.querySelector('.story-dialogue-sheet')?.classList.toggle('has-choices', hasChoices);
  if (storyDialogueContinueEl) storyDialogueContinueEl.textContent = hasChoices ? 'PRESS 1 / 2 TO CHOOSE' : 'SPACE / ENTER // CONTINUE';
  if (hasChoices) {
    line.choices.forEach((choice,i)=>{
      const div=document.createElement('div');
      div.className='story-choice';
      div.innerHTML=`<b>${i+1}</b>${choice.label}`;
      storyChoiceListEl.appendChild(div);
    });
  }
}

function showStoryDialogueSequence(lines, onComplete = null) {
  if (!lines?.length) {
    onComplete?.();
    return;
  }
  triggerHeld = false;
  rightMouseDown = false;
  isAiming = false;
  storyDialogueQueue = lines;
  storyDialogueIndex = 0;
  storyDialogueOnComplete = onComplete;
  storyDialogueBlocking = true;
  storyInputLocked = true;
  controls.pointerSpeed = 0;
  storyDialogueScreenEl.classList.add('visible');
  document.body.classList.add('story-dialogue-open');
  renderStoryDialoguePage();
}

function chooseStoryDialogueChoice(index) {
  if (!storyDialogueBlocking) return;
  const line=storyDialogueQueue[storyDialogueIndex];
  const choice=line?.choices?.[index];
  if(!choice) return;
  choice.onChoose?.();
  storyChoiceResolved=true;
  storyDialogueIndex += 1;
  if (storyDialogueIndex < storyDialogueQueue.length) {
    renderStoryDialoguePage();
    playTone(420,520,.045,.009,'triangle');
    return;
  }
  finishStoryDialogueSequence();
}

function finishStoryDialogueSequence() {
  const done = storyDialogueOnComplete;
  storyDialogueBlocking = false;
  storyInputLocked = false;
  storyDialogueQueue = [];
  storyDialogueIndex = 0;
  storyDialogueOnComplete = null;
  storyChoiceListEl.innerHTML='';
  storyDialogueScreenEl.classList.remove('visible');
  document.body.classList.remove('story-dialogue-open');
  controls.pointerSpeed = Number(sensitivitySetting?.value || .78);
  done?.();
}

function advanceStoryDialogue() {
  if (!storyDialogueBlocking) return;
  const line=storyDialogueQueue[storyDialogueIndex];
  if(line?.choices?.length) return;
  storyDialogueIndex += 1;
  if (storyDialogueIndex < storyDialogueQueue.length) {
    renderStoryDialoguePage();
    playTone(420, 520, .045, .009, 'triangle');
    return;
  }
  finishStoryDialogueSequence();
}


storyChoiceListEl?.addEventListener('pointerup', (event) => {
  const choiceEl = event.target.closest('.story-choice');
  if (!choiceEl || !storyDialogueBlocking) return;
  const choices = [...storyChoiceListEl.children];
  const index = choices.indexOf(choiceEl);
  if (index >= 0) chooseStoryDialogueChoice(index);
});
storyDialogueContinueEl?.addEventListener('pointerup', (event) => {
  event.preventDefault();
  if (storyDialogueBlocking) advanceStoryDialogue();
});

function storySpawnIsSafe(point, radius = .62) {
  if (!point || point.length < 2) return false;
  const [x,z]=point;
  const cx=selectedStoryChapter===2?STORY_TWO_X:(selectedStoryChapter===1?STORY_ONE_X:STORY_X);
  const cz=selectedStoryChapter===2?STORY_TWO_Z:(selectedStoryChapter===1?STORY_ONE_Z:STORY_Z);
  const sx=selectedStoryChapter===2?STORY_TWO_SIZE_X:(selectedStoryChapter===1?STORY_ONE_SIZE_X:STORY_SIZE_X);
  const sz=selectedStoryChapter===2?STORY_TWO_SIZE_Z:(selectedStoryChapter===1?STORY_ONE_SIZE_Z:STORY_SIZE_Z);
  const hx=sx/2-1.4, hz=sz/2-1.4;
  if(x<cx-hx||x>cx+hx||z<cz-hz||z>cz+hz) return false;
  return enemyCanMoveAt(x,z,radius);
}

function findSafeStorySpawn(preferred, occupied = []) {
  // Start with the authored position, then search nearby rings. This prevents a
  // contact from being placed inside a building if the story map changes later.
  const candidates = [preferred];
  const radii = [1.8, 3.2, 4.8, 6.4];
  for (const r of radii) {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      candidates.push([preferred[0] + Math.cos(a) * r, preferred[1] + Math.sin(a) * r]);
    }
  }

  // Hand-authored fallback positions in the open central street.
  const storyCx = selectedStoryChapter === 2 ? STORY_TWO_X : (selectedStoryChapter === 1 ? STORY_ONE_X : STORY_X);
  candidates.push(
    [storyCx - 4.5, -13.8], [storyCx + 3.8, -14.4],
    [storyCx - 1.8, -19.6], [storyCx + 3.0, -21.0],
    [storyCx - 5.8, -17.0], [storyCx + 5.0, -16.0]
  );

  return candidates.find(candidate => {
    if (!storySpawnIsSafe(candidate)) return false;
    if (occupied.some(other => Math.hypot(candidate[0] - other[0], candidate[1] - other[1]) < 2.4)) return false;
    // Don't place an enemy directly on top of the player during a scripted ambush.
    if (Math.hypot(camera.position.x - candidate[0], camera.position.z - candidate[1]) < 4.0) return false;
    return true;
  }) || [(selectedStoryChapter === 2 ? STORY_TWO_X : (selectedStoryChapter === 1 ? STORY_ONE_X : STORY_X)), -18 - occupied.length * 2.5];
}

function activeStoryContactCount() {
  return enemies.filter(enemy =>
    enemy.storyEncounterId === activeStoryEncounterId &&
    enemy.activeInRound &&
    (enemy.alive || enemy.dying)
  ).length;
}

function spawnStoryContacts(types = ['rifleman', 'rifleman'], points = null) {
  enemies.forEach(deactivateEnemy);
  const available = enemies.filter(e => !e.activeInRound && !e.alive && !e.dying);
  const defaults = [
    [STORY_X - 5.5, -15.2], [STORY_X + 5.0, -17.0],
    [STORY_X - 2.8, -18.7], [STORY_X + 6.0, -14.2]
  ];
  const requested = points || defaults;
  const occupied = [];
  activeStoryEncounterId = ++storyEncounterSerial;

  types.forEach((type, i) => {
    const enemy = available[i];
    if (!enemy) return;
    const preferred = requested[i] || defaults[i % defaults.length];
    const safeSpawn = findSafeStorySpawn(preferred, occupied);
    occupied.push(safeSpawn);
    configureEnemy(enemy, type, safeSpawn);
    enemy.storyEncounterId = activeStoryEncounterId;
    // Give the newly placed contacts a small delay before their first shot so
    // every model has time to visibly enter the encounter.
    enemy.nextShotAt = Math.max(enemy.nextShotAt, performance.now() + 700 + i * 120);
  });

  storyKills = 0;
  storyKillsRequired = types.length;
  roundState = 'active';
  playerInvulnerableUntil = Math.max(playerInvulnerableUntil, performance.now() + 950);
  updateRoundHud();
}

function addStoryContacts(types = ['corrector'], points = []) {
  const liveCount = enemies.filter(e => e.activeInRound && (e.alive || e.dying)).length;
  const room = Math.max(0, 3 - liveCount);
  if (room <= 0) return 0;
  const available = enemies.filter(e => !e.activeInRound && !e.alive && !e.dying);
  const occupied = enemies.filter(e => e.activeInRound).map(e => [e.group.position.x, e.group.position.z]);
  let added = 0;
  types.slice(0, room).forEach((type, i) => {
    const enemy = available[added];
    if (!enemy) return;
    const preferred = points[i] || [camera.position.x + (i%2?6:-6), camera.position.z - 8 - i*2];
    const safeSpawn = findSafeStorySpawn(preferred, occupied);
    occupied.push(safeSpawn);
    configureEnemy(enemy, type, safeSpawn);
    enemy.storyEncounterId = activeStoryEncounterId;
    enemy.nextShotAt = Math.max(enemy.nextShotAt, performance.now() + 850 + i * 120);
    added++;
  });
  storyKillsRequired += added;
  updateRoundHud();
  return added;
}

function startStoryChapterZero() {
  enemies.forEach(deactivateEnemy);
  clearDynamicStructures();
  bossHudEl.classList.remove('visible');
  roundBannerEl.classList.remove('visible');
  storyState = 'waking';
  storyStage = 0;
  storyKills = 0;
  storyKillsRequired = 0;
  storyCompletionAt = 0;
  roundState = 'story';
  storyCheckpoint.copy(STORY_SPAWN);
  storyWakeOverlayEl.querySelector('.wake-note span').textContent='CHAPTER ZERO';
  storyWakeOverlayEl.querySelector('.wake-note b').textContent='MARGIN DISTRICT';
  storyWakeOverlayEl.querySelector('.wake-note small').textContent='SIGNAL RECOVERING...';
  camera.position.copy(STORY_SPAWN);
  verticalOffset = 0;
  currentEyeHeight = STAND_EYE_HEIGHT;
  velocity.set(0, 0, 0);
  playerHealth = playerMaxHealth;
  stamina = 100;
  playerInvulnerableUntil = performance.now() + 4200;
  setStoryMarker(STORY_SIGNAL, false);
  storyHudEl.classList.add('visible');
  storyObjectiveTextEl.textContent = 'WAKE UP';
  storyWakeStartedAt = performance.now();
  storyWakeOpening = false;
  storyInputLocked = true;
  controls.pointerSpeed = 0;
  storyWakeOverlayEl.classList.remove('opening');
  storyWakeOverlayEl.classList.add('visible');
  updateHealthHud();
  updateRoundHud();
}

function updateStoryChapterZero(now, dt) {
  if (gameMode !== 'story' || !controlSessionActive() || storyState === 'boot') return;

  if (storyMarker?.visible) {
    storyMarker.rotation.y += dt * .72;
    const pulse = 1 + Math.sin(now * .004) * .06;
    storyMarker.scale.set(pulse, 1, pulse);
  }

  if (storyState === 'waking') {
    const elapsed = now - storyWakeStartedAt;
    if (!storyWakeOpening && elapsed > 520) {
      storyWakeOpening = true;
      storyWakeOverlayEl.classList.add('opening');
      playNoiseBurst(.012, .42, 1350);
    }
    if (elapsed > 2850) {
      storyState = 'introDialogue';
      storyWakeOverlayEl.classList.remove('visible', 'opening');
      showStoryDialogueSequence([
        { kicker: 'CHAPTER ZERO // SIGNAL RECOVERED', speaker: 'MARA', text: 'There you are. Do not stand up too quickly. The district has been redrawing itself all night.' },
        { speaker: 'YOU', text: 'Where am I?' },
        { speaker: 'MARA', text: 'The Margin District. It used to be empty space between pages. Something has started filling it in.' },
        { speaker: 'MARA', text: 'I marked a signal down the street. Reach it. And if anything drawn there starts moving, assume it is hostile.' }
      ], () => {
        storyState = 'reachSignal';
        storyObjectiveTextEl.textContent = 'REACH THE SIGNAL MARK';
        setStoryMarker(STORY_SIGNAL, true);
        showStoryDialogue('MARA // RADIO', 'Signal mark is ahead.', 'REACH THE SIGNAL MARK');
      });
    }
    return;
  }

  if (storyDialogueBlocking) return;

  if (storyState === 'reachSignal') {
    const dist = Math.hypot(camera.position.x - STORY_SIGNAL.x, camera.position.z - STORY_SIGNAL.z);
    if (dist < 2.25) {
      setStoryMarker(STORY_SIGNAL, false);
      setStoryCheckpoint(new THREE.Vector3(STORY_X, STAND_EYE_HEIGHT, -1.5), 'SIGNAL MARK');
      storyState = 'signalDialogue';
      showStoryDialogueSequence([
        { kicker: 'SIGNAL MARK // ACTIVE', speaker: 'MARA', text: 'Stop. Two figures ahead.' },
        { speaker: 'MARA', text: 'They look human from here, but the ink is wrong. They are copies. Cross them out before they close the street.' }
      ], () => {
        storyState = 'combatOne';
        showStoryDialogue('MARA // RADIO', 'Two contacts. Keep moving.', 'ERASE THE TWO CONTACTS');
        spawnStoryContacts(['rifleman', 'rifleman']);
        playRoundStinger('round');
      });
    }
  } else if (storyState === 'combatOne') {
    if (storyKills >= storyKillsRequired && activeStoryContactCount() === 0) {
      storyState = 'relay';
      roundState = 'story';
      setStoryCheckpoint(new THREE.Vector3(STORY_X, STAND_EYE_HEIGHT, -6), 'CONTACTS CLEARED');
      setStoryMarker(STORY_RELAY, true);
      playerHealth = Math.min(playerMaxHealth, playerHealth + 25);
      updateHealthHud();
      showStoryDialogueSequence([
        { kicker: 'CONTACTS // ERASED', speaker: 'MARA', text: 'Good. They broke apart when you hit them. Like the page could not decide what shape they were supposed to keep.' },
        { speaker: 'MARA', text: 'There is an old relay on your right. I need you to wake it up. It might tell us who is drawing these things.' }
      ], () => {
        storyObjectiveTextEl.textContent = 'REACH THE RELAY';
      });
    }
  } else if (storyState === 'relay') {
    const dist = Math.hypot(camera.position.x - STORY_RELAY.x, camera.position.z - STORY_RELAY.z);
    if (dist < 2.1) {
      setStoryMarker(STORY_RELAY, false);
      setStoryCheckpoint(new THREE.Vector3(STORY_RELAY.x - 1.8, STAND_EYE_HEIGHT, STORY_RELAY.z + 1.8), 'RELAY');
      storyState = 'relayDialogue';
      showStoryDialogueSequence([
        { kicker: 'RELAY // PARTIAL SIGNAL', speaker: 'MARA', text: 'I have it. There is another signal underneath mine.' },
        { speaker: 'UNKNOWN', text: '...return the borrowed line...' },
        { speaker: 'YOU', text: 'Mara. That was not you.' },
        { speaker: 'MARA', text: 'No. And you have company. Three contacts. One of them is moving fast.' }
      ], () => {
        storyState = 'combatTwo';
        showStoryDialogue('MARA // RADIO', 'Second wave incoming.', 'SURVIVE THE AMBUSH');
        spawnStoryContacts(['rusher', 'rifleman', 'rifleman'], [
          [STORY_X + 1.0, -17.5],
          [STORY_X - 7.5, -15.0],
          // Kept in the open central street; the old +8/-18.5 point sat inside a building.
          [STORY_X + 3.5, -21.0]
        ]);
        playRoundStinger('round');
      });
    }
  } else if (storyState === 'combatTwo') {
    if (storyKills >= storyKillsRequired && activeStoryContactCount() === 0) {
      storyState = 'extract';
      roundState = 'story';
      setStoryMarker(STORY_EXTRACTION, true);
      playerHealth = Math.min(playerMaxHealth, playerHealth + 30);
      updateHealthHud();
      showStoryDialogueSequence([
        { kicker: 'RELAY // FAILING', speaker: 'MARA', text: 'The relay is burning itself out. I copied what I could.' },
        { speaker: 'MARA', text: 'Get to the exit mark. Now. The street geometry is changing behind you.' }
      ], () => {
        storyObjectiveTextEl.textContent = 'REACH EXTRACTION';
      });
    }
  } else if (storyState === 'extract') {
    const dist = Math.hypot(camera.position.x - STORY_EXTRACTION.x, camera.position.z - STORY_EXTRACTION.z);
    if (dist < 2.35) {
      setStoryMarker(STORY_EXTRACTION, false);
      storyState = 'endingDialogue';
      roundState = 'story';
      playRoundStinger('complete');
      showStoryDialogueSequence([
        { kicker: 'CHAPTER ZERO // EXIT MARK', speaker: 'YOU', text: 'Tell me you know what that voice was.' },
        { speaker: 'MARA', text: 'I know what it called you.' },
        { speaker: 'MARA', text: 'Borrowed line.' },
        { kicker: 'CHAPTER ZERO // COMPLETE', speaker: 'MARA', text: 'This was only the margin. Whatever is on the next page already knows you are here.' }
      ], () => {
        saveStoryProgress(1);
        storyState = 'complete';
        storyCompletionAt = performance.now() + 2200;
        storyObjectiveTextEl.textContent = 'CHAPTER ZERO COMPLETE';
        showRoundBanner('STORY MODE', 'CHAPTER ZERO COMPLETE', 'THE MARGIN // PROLOGUE END', 2200);
        updateRoundHud();
      });
    }
  } else if (storyState === 'complete' && storyCompletionAt && now >= storyCompletionAt) {
    storyCompletionAt = 0;
    continueIntoStoryChapter(1);
  }
}

function continueIntoStoryChapter(nextChapter) {
  selectedStoryChapter = nextChapter;
  resetRunToBoot();
  gameStarted = true;
  document.body.classList.remove('front-menu');
  document.body.classList.add('story-mode');
  startStoryMode();
}

function setStoryCheckpoint(position, note = 'CHECKPOINT') {
  storyCheckpoint.copy(position);
  showCombatMessage(`${note} // SAVED`, 650);
  try { localStorage.setItem(`inkbreak_checkpoint_${selectedStoryChapter}`, JSON.stringify([position.x, position.y, position.z])); } catch {}
}

function startStoryChapterOne() {
  enemies.forEach(deactivateEnemy);
  clearDynamicStructures();
  bossHudEl.classList.remove('visible');
  roundBannerEl.classList.remove('visible');
  storyState='waking'; storyStage=0; storyKills=0; storyKillsRequired=0; storyCompletionAt=0; roundState='story'; storySetpieceStage=0; storyBridgeBuilt=false;
  camera.position.copy(STORY_ONE_SPAWN); storyCheckpoint.copy(STORY_ONE_SPAWN);
  verticalOffset=0; currentEyeHeight=STAND_EYE_HEIGHT; velocity.set(0,0,0); playerHealth=playerMaxHealth; stamina=100;
  playerInvulnerableUntil=performance.now()+4200; setStoryMarker(STORY_ONE_FIRST_MARK,false); storyHudEl.classList.add('visible'); storyObjectiveTextEl.textContent='WAKE UP';
  storyWakeStartedAt=performance.now(); storyWakeOpening=false; storyInputLocked=true; controls.pointerSpeed=0;
  storyWakeOverlayEl.querySelector('.wake-note span').textContent='CHAPTER ONE';
  storyWakeOverlayEl.querySelector('.wake-note b').textContent='WRONG PAGE';
  storyWakeOverlayEl.querySelector('.wake-note small').textContent='PAGE BOUNDARY FAILED...';
  storyWakeOverlayEl.classList.remove('opening'); storyWakeOverlayEl.classList.add('visible');
  updateHealthHud(); updateRoundHud();
}

function updateStoryChapterOne(now,dt) {
  if(gameMode!=='story'||selectedStoryChapter!==1||!controlSessionActive()||storyState==='boot') return;
  if(storyMarker?.visible){storyMarker.rotation.y+=dt*.72;const pulse=1+Math.sin(now*.004)*.06;storyMarker.scale.set(pulse,1,pulse);}

  if(storyState==='waking'){
    const elapsed=now-storyWakeStartedAt;
    if(!storyWakeOpening&&elapsed>520){storyWakeOpening=true;storyWakeOverlayEl.classList.add('opening');playNoiseBurst(.012,.42,1350);}
    if(elapsed>2800){
      storyState='introDialogue'; storyWakeOverlayEl.classList.remove('visible','opening');
      showStoryDialogueSequence([
        {kicker:'CHAPTER ONE // WRONG PAGE',speaker:'MARA',text:'You made it across. I was not sure the exit mark would still lead anywhere.'},
        {speaker:'YOU',text:'This place looks unfinished.'},
        {speaker:'MARA',text:'Because it is. Roads stop. Buildings forget their roofs. Stay on the blue lines and do not touch anything white.'},
        {speaker:'UNKNOWN',text:'...borrowed line... return before correction...'}
      ],()=>{storyState='wrongPageWalk';storyObjectiveTextEl.textContent='FOLLOW THE UNFINISHED STREET';setStoryMarker(STORY_ONE_FIRST_MARK,true);showStoryDialogue('MARA // RADIO','Keep moving. I am losing the edge of your signal.','FOLLOW THE UNFINISHED STREET');});
    }
    return;
  }
  if(storyDialogueBlocking) return;

  if(storyState==='wrongPageWalk'){
    if(Math.hypot(camera.position.x-STORY_ONE_FIRST_MARK.x,camera.position.z-STORY_ONE_FIRST_MARK.z)<2.2){
      setStoryMarker(STORY_ONE_FIRST_MARK,false); storyState='firstChoice'; setStoryCheckpoint(new THREE.Vector3(STORY_ONE_X-4,STAND_EYE_HEIGHT,12),'STREET MARK');
      showStoryDialogueSequence([
        {kicker:'RADIO LINK // UNSTABLE',speaker:'MARA',text:'There is a relay shortcut ahead. Do not activate it. I think the signal underneath mine is using them to map you.',choices:[
          {label:'LISTEN TO MARA // take the long way',onChoose:()=>{storyFlags.trustedMara=true;}},
          {label:'ACTIVATE IT ANYWAY // learn what is calling you',onChoose:()=>{storyFlags.ignoredMara=true;storyFlags.relayTouched=true;}}
        ]},
        {speaker:'YOU',text:'Either way, I need a path across that gap.'}
      ],()=>{storyState='bridgeApproach';storyObjectiveTextEl.textContent='REACH THE BROKEN CROSSING';setStoryMarker(STORY_ONE_BRIDGE_SWITCH,true);});
    }
  } else if(storyState==='bridgeApproach'){
    const d=Math.hypot(camera.position.x-STORY_ONE_BRIDGE_SWITCH.x,camera.position.z-STORY_ONE_BRIDGE_SWITCH.z);
    if(d<2.1){
      setStoryMarker(STORY_ONE_BRIDGE_SWITCH,false); buildStoryBridge(); storySetpieceStage=1;
      // White correction walls draw behind the player to create a real chase beat.
      dynamicDrawStartedAt=performance.now();
      for(let i=0;i<4;i++) dynamicBox({x:STORY_ONE_X+(i-1.5)*3.0,y:1.6,z:4.8,w:2.7,h:3.2,d:.5,shade:false});
      showStoryDialogueSequence([
        {kicker:'PAGE EVENT // REDRAW',speaker:'MARA',text:storyFlags.ignoredMara?'You touched it. The signal just found us. Run.':'The page is drawing a bridge by itself. I did not ask it to do that.'},
        {speaker:'UNKNOWN',text:storyFlags.ignoredMara?'You are easier to see now.':'The line remembers the hand.'},
        {speaker:'MARA',text:'Across the bridge. Move before the correction catches up.'}
      ],()=>{storyState='bridgeFight';storyObjectiveTextEl.textContent='CROSS THE BRIDGE // ERASE CORRECTORS';spawnStoryContacts(['corrector','corrector','sniper'],[[STORY_ONE_X-3,-10],[STORY_ONE_X+5,-12],[STORY_ONE_X,-18]]);playRoundStinger('round');});
    }
  } else if(storyState==='bridgeFight'){
    if(storyKills>=storyKillsRequired&&activeStoryContactCount()===0){
      roundState='story'; storyState='correction'; setStoryCheckpoint(new THREE.Vector3(STORY_ONE_X,STAND_EYE_HEIGHT,-10),'BRIDGE');
      showStoryDialogueSequence([
        {kicker:'CONTACTS // ERASED',speaker:'MARA',text:'Those were different. Cleaner outlines. Deliberate.'},
        {speaker:'YOU',text:'They were trying to push me back.'},
        {speaker:'MARA',text:'Correctors. That is what the old notes called them. They erase things that do not belong.'},
        {speaker:'YOU',text:'And I do not belong.'},
        {speaker:'UNKNOWN',text:'Ask her where she is broadcasting from.',choices:[
          {label:'IGNORE IT // stay with Mara',onChoose:()=>{storyFlags.trustedMara=true;}},
          {label:'ANSWER // ask where Mara really is',onChoose:()=>{storyFlags.answeredUnknown=true;}}
        ]}
      ],()=>{storyObjectiveTextEl.textContent='ENTER THE CORRECTION ZONE';setStoryMarker(STORY_ONE_CORRECTION,true);roundState='story';});
    }
  } else if(storyState==='correction'){
    const d=Math.hypot(camera.position.x-STORY_ONE_CORRECTION.x,camera.position.z-STORY_ONE_CORRECTION.z);
    if(roundState==='story'&&d<2.2){
      setStoryMarker(STORY_ONE_CORRECTION,false); spawnStoryContacts(['heavy','corrector','corrector'],[[STORY_ONE_X-6,-20],[STORY_ONE_X+5,-21],[STORY_ONE_X+1,-24]]); roundState='active'; storyKills=0;
      showRoundBanner('CHAPTER ONE','CORRECTION IN PROGRESS','SURVIVE // THE PAGE WANTS YOU GONE',2100);
    } else if(roundState==='active'&&storyKills>=storyKillsRequired&&activeStoryContactCount()===0){
      roundState='story'; storyState='finalRun'; setStoryMarker(STORY_ONE_EXIT,true); playerHealth=Math.min(playerMaxHealth,playerHealth+35);updateHealthHud();
      showStoryDialogueSequence([
        {kicker:'CORRECTION // FAILED',speaker:'UNKNOWN',text:'You break clean lines into pieces.'},
        {speaker:'MARA',text:'Do not answer it. Exit mark is ahead.'},
        {speaker:'UNKNOWN',text:'Mara is not where she says she is.'}
      ],()=>{storyObjectiveTextEl.textContent='REACH THE EXIT MARK';});
    }
  } else if(storyState==='finalRun'){
    if(Math.hypot(camera.position.x-STORY_ONE_EXIT.x,camera.position.z-STORY_ONE_EXIT.z)<2.25){
      setStoryMarker(STORY_ONE_EXIT,false); storyState='endingDialogue'; playRoundStinger('complete');
      showStoryDialogueSequence([
        {kicker:'CHAPTER ONE // EXIT MARK',speaker:'YOU',text:'It said you are not where you say you are.'},
        {speaker:'MARA',text:storyFlags.answeredUnknown?'I heard you ask. I cannot tell you where I am yet. Not over a line it can hear.':(storyFlags.trustedMara?'Then keep trusting the voice that got you this far. I will explain when I can.':'You chose to listen to it once. Be careful what that makes possible.')},
        {speaker:'MARA',text:'The next page has a name scratched into every wall: CORRECTIONS.'},
        {speaker:'UNKNOWN',text:'You called the Artist a monster. The page called it repair.'},
        {kicker:'CHAPTER ONE // COMPLETE',speaker:'UNKNOWN',text:'See you in the draft.'}
      ],()=>{saveStoryProgress(2);storyState='complete';storyCompletionAt=performance.now()+2400;storyObjectiveTextEl.textContent='CHAPTER ONE COMPLETE';showRoundBanner('STORY MODE','CHAPTER ONE COMPLETE','WRONG PAGE // END',2300);updateRoundHud();});
    }
  } else if(storyState==='complete'&&storyCompletionAt&&now>=storyCompletionAt){
    storyCompletionAt=0;
    continueIntoStoryChapter(2);
  }
}

function startStoryChapterTwo() {
  enemies.forEach(deactivateEnemy);
  clearDynamicStructures();
  bossHudEl.classList.remove('visible');
  roundBannerEl.classList.remove('visible');
  storyState='waking';
  storyStage=0; storyKills=0; storyKillsRequired=0; storyCompletionAt=0; roundState='story';
  storyDefenseEndsAt=0; storyDefenseWave=0; storyRunAmbushSpawned=false;
  camera.position.copy(STORY_TWO_SPAWN); storyCheckpoint.copy(STORY_TWO_SPAWN);
  verticalOffset=0; currentEyeHeight=STAND_EYE_HEIGHT; velocity.set(0,0,0);
  playerHealth=playerMaxHealth; stamina=100; playerInvulnerableUntil=performance.now()+4200;
  setStoryMarker(STORY_TWO_GATE,false); storyHudEl.classList.add('visible'); storyObjectiveTextEl.textContent='WAKE UP';
  storyWakeStartedAt=performance.now(); storyWakeOpening=false; storyInputLocked=true; controls.pointerSpeed=0;
  storyWakeOverlayEl.querySelector('.wake-note span').textContent='CHAPTER TWO';
  storyWakeOverlayEl.querySelector('.wake-note b').textContent='CORRECTIONS';
  storyWakeOverlayEl.querySelector('.wake-note small').textContent='ARCHIVE INDEX // UNAUTHORIZED...';
  storyWakeOverlayEl.classList.remove('opening'); storyWakeOverlayEl.classList.add('visible');
  updateHealthHud(); updateRoundHud();
}

function updateStoryChapterTwo(now,dt) {
  if(gameMode!=='story'||selectedStoryChapter!==2||!controlSessionActive()||storyState==='boot') return;
  if(storyMarker?.visible){storyMarker.rotation.y+=dt*.72;const pulse=1+Math.sin(now*.004)*.06;storyMarker.scale.set(pulse,1,pulse);}

  if(storyState==='waking'){
    const elapsed=now-storyWakeStartedAt;
    if(!storyWakeOpening&&elapsed>500){storyWakeOpening=true;storyWakeOverlayEl.classList.add('opening');playNoiseBurst(.014,.46,1280);}
    if(elapsed>3000){
      storyState='introDialogue'; storyWakeOverlayEl.classList.remove('visible','opening');
      showStoryDialogueSequence([
        {kicker:'CHAPTER TWO // CORRECTIONS',speaker:'MARA',text:'That name on the walls was not a warning. It is a place. You are standing in the intake yard of the Correction Archive.'},
        {speaker:'YOU',text:'An archive for what?'},
        {speaker:'MARA',text:'For deciding what belongs on a page. Drafts get stored. Copies get erased. Borrowed lines... apparently get hunted.'},
        {speaker:'UNKNOWN',text:'Ask her how she knows the filing system.'},
        {speaker:'MARA',text:'There is an intake gate ahead. Move slowly. This place was built to notice mistakes.'}
      ],()=>{storyState='archiveApproach';storyObjectiveTextEl.textContent='REACH THE ARCHIVE INTAKE';setStoryMarker(STORY_TWO_GATE,true);showStoryDialogue('MARA // RADIO','Intake gate ahead.','REACH THE ARCHIVE INTAKE');});
    }
    return;
  }
  if(storyDialogueBlocking) return;

  if(storyState==='archiveApproach'){
    if(Math.hypot(camera.position.x-STORY_TWO_GATE.x,camera.position.z-STORY_TWO_GATE.z)<2.4){
      setStoryMarker(STORY_TWO_GATE,false); setStoryCheckpoint(new THREE.Vector3(STORY_TWO_GATE.x,STAND_EYE_HEIGHT,STORY_TWO_GATE.z),'ARCHIVE INTAKE');
      showStoryDialogueSequence([
        {kicker:'ARCHIVE // INTAKE',speaker:'MARA',text:'Three outlines just woke up inside the yard. Correctors. They are spreading instead of charging you.'},
        {speaker:'MARA',text:'Watch the sides. They are trying to classify you before they erase you.'}
      ],()=>{storyState='archivePatrol';storyObjectiveTextEl.textContent='CLEAR THE INTAKE PATROL';spawnStoryContacts(['corrector','flanker','corrector'],[[STORY_TWO_X-6,17],[STORY_TWO_X+6,15],[STORY_TWO_X,11]]);playRoundStinger('round');});
    }
  } else if(storyState==='archivePatrol'){
    if(storyKills>=storyKillsRequired&&activeStoryContactCount()===0){
      roundState='story'; storyState='archiveTerminal'; setStoryCheckpoint(new THREE.Vector3(STORY_TWO_X,STAND_EYE_HEIGHT,14),'INTAKE CLEARED');
      setStoryMarker(STORY_TWO_ARCHIVE,true);
      showStoryDialogueSequence([
        {kicker:'INTAKE // QUIET',speaker:'YOU',text:'They were not guarding the gate. They were waiting for me.'},
        {speaker:'MARA',text:'Then we stop letting the Archive ask the questions. There is a terminal ahead. Read its index.'}
      ],()=>{storyObjectiveTextEl.textContent='REACH THE ARCHIVE TERMINAL';});
    }
  } else if(storyState==='archiveTerminal'){
    if(Math.hypot(camera.position.x-STORY_TWO_ARCHIVE.x,camera.position.z-STORY_TWO_ARCHIVE.z)<2.15){
      setStoryMarker(STORY_TWO_ARCHIVE,false);
      showStoryDialogueSequence([
        {kicker:'ARCHIVE TERMINAL // CLASSIFICATION',speaker:'SYSTEM',text:'UNAUTHORIZED LINE DETECTED. CATEGORY: BORROWED. ORIGIN: REDACTED. OWNER: UNRESOLVED.'},
        {speaker:'YOU',text:'Owner?'},
        {speaker:'UNKNOWN',text:'Every line came from a hand.'},
        {speaker:'MARA',text:'There is another entry. My name.'},
        {kicker:'ARCHIVE TERMINAL // MARA',speaker:'SYSTEM',text:'VOICEPRINT MARA // SIX SIMULTANEOUS PAGES // SOURCE BODY: NOT FOUND.',choices:[
          {label:'ASK MARA DIRECTLY // what are you?',onChoose:()=>{storyFlags.answeredUnknown=true;}},
          {label:'KEEP READING // do not give the signal a reaction',onChoose:()=>{storyFlags.trustedMara=true;}}
        ]},
        {speaker:'MARA',text:'I know what that looks like. I also know I have kept you alive. Both things can be true.'},
        {speaker:'MARA',text:'The Archive is powering an ink press below us. Shut it down and the correction network loses this district.'}
      ],()=>{storyState='defenseApproach';storyObjectiveTextEl.textContent='REACH THE INK PRESS';setStoryMarker(STORY_TWO_PRESS,true);});
    }
  } else if(storyState==='defenseApproach'){
    if(Math.hypot(camera.position.x-STORY_TWO_PRESS.x,camera.position.z-STORY_TWO_PRESS.z)<2.3){
      setStoryMarker(STORY_TWO_PRESS,false); setStoryCheckpoint(new THREE.Vector3(STORY_TWO_X,STAND_EYE_HEIGHT,0),'INK PRESS');
      storyState='defense'; storyDefenseEndsAt=now+52000; storyDefenseWave=0;
      spawnStoryContacts(['corrector','rusher'],[[STORY_TWO_X-8,-7],[STORY_TWO_X+8,-8]]);
      storyKillsRequired=2; roundState='active';
      showRoundBanner('CHAPTER TWO','INK PRESS // 52 SECONDS','HOLD THE ROOM // THE ARCHIVE IS REDRAWING',2300);
      showCombatMessage('PRESS SHUTDOWN // HOLD',900);
    }
  } else if(storyState==='defense'){
    const remaining=storyDefenseEndsAt-now;
    const elapsed=52000-Math.max(0,remaining);
    const waveTarget=elapsed>39000?4:elapsed>27000?3:elapsed>15000?2:elapsed>7000?1:0;
    if(waveTarget>storyDefenseWave){
      storyDefenseWave=waveTarget;
      if(storyDefenseWave===1) addStoryContacts(['corrector'],[[STORY_TWO_X-7,-11]]);
      else if(storyDefenseWave===2) addStoryContacts(['flanker','corrector'],[[STORY_TWO_X+8,-12],[STORY_TWO_X-6,-14]]);
      else if(storyDefenseWave===3) addStoryContacts(['heavy'],[[STORY_TWO_X+7,-15]]);
      else addStoryContacts(['rusher','corrector'],[[STORY_TWO_X-5,-16],[STORY_TWO_X+5,-17]]);
      showCombatMessage(`CORRECTION WAVE ${storyDefenseWave+1} // DRAWN IN`,600);
    }
    updateRoundHud();
    if(remaining<=0){
      storyDefenseEndsAt=0;
      if(activeStoryContactCount()===0){
        roundState='story'; storyState='corridorRun'; playerHealth=Math.min(playerMaxHealth,playerHealth+30); updateHealthHud();
        setStoryMarker(STORY_TWO_SAFE,true);
        showStoryDialogueSequence([
          {kicker:'INK PRESS // OFFLINE',speaker:'MARA',text:'Press is dead. The whole archive just lost its clean edges.'},
          {speaker:'UNKNOWN',text:'And now it will correct by hand.'},
          {speaker:'MARA',text:'Safe room at the far end. Run. Do not stop for every contact.'}
        ],()=>{storyObjectiveTextEl.textContent='RUN THE CORRECTION CORRIDOR';});
      } else {
        storyObjectiveTextEl.textContent='FINISH THE REMAINING CORRECTORS';
      }
    }
    if(storyDefenseEndsAt===0&&activeStoryContactCount()===0&&storyState==='defense'){
      roundState='story';storyState='corridorRun';setStoryMarker(STORY_TWO_SAFE,true);storyObjectiveTextEl.textContent='RUN THE CORRECTION CORRIDOR';
    }
  } else if(storyState==='corridorRun'){
    // The archive redraws behind the player. These slabs are intentionally behind the route, not cheap blockers in front.
    if(!storyRunAmbushSpawned && camera.position.z < -12){
      storyRunAmbushSpawned=true; dynamicDrawStartedAt=now;
      for(let i=0;i<3;i++) dynamicBox({x:STORY_TWO_X+(i-1)*4.2,y:1.7,z:-9-i*2.6,w:3.6,h:3.4,d:.48,shade:false});
      spawnStoryContacts(['flanker','corrector'],[[STORY_TWO_X+7,-20],[STORY_TWO_X-7,-22]]);
      storyState='corridorRun'; roundState='active'; storyObjectiveTextEl.textContent='REACH THE SAFE ROOM // CONTACTS OPTIONAL';
      showCombatMessage('THE ARCHIVE IS CLOSING BEHIND YOU',850);
    }
    if(Math.hypot(camera.position.x-STORY_TWO_SAFE.x,camera.position.z-STORY_TWO_SAFE.z)<2.4){
      enemies.forEach(e=>{if(e.storyEncounterId===activeStoryEncounterId) deactivateEnemy(e);});
      roundState='story'; setStoryMarker(STORY_TWO_SAFE,false); setStoryCheckpoint(new THREE.Vector3(STORY_TWO_SAFE.x,STAND_EYE_HEIGHT,STORY_TWO_SAFE.z),'SAFE ROOM');
      storyState='proofreader';
      showStoryDialogueSequence([
        {kicker:'SAFE ROOM // ARCHIVE HEART',speaker:'YOU',text:'Door is sealed.'},
        {speaker:'MARA',text:'Not sealed. Waiting.'},
        {speaker:'SYSTEM',text:'BORROWED LINE CONFIRMED. MANUAL REVIEW AUTHORIZED.'},
        {speaker:'UNKNOWN',text:'Proofreader.'},
        {speaker:'MARA',text:'One contact. Big one. Break it before it finishes the review.'}
      ],()=>{storyObjectiveTextEl.textContent='ERASE THE PROOFREADER';spawnStoryContacts(['proofreader'],[[STORY_TWO_X,-31]]);roundState='active';showRoundBanner('CHAPTER TWO','PROOFREADER','MANUAL CORRECTION // DENIED',2200);});
    }
  } else if(storyState==='proofreader'){
    if(storyKills>=storyKillsRequired&&activeStoryContactCount()===0){
      roundState='story'; setStoryMarker(STORY_TWO_EXIT,true); storyState='endingDialogue';
      showStoryDialogueSequence([
        {kicker:'PROOFREADER // BROKEN',speaker:'SYSTEM',text:'MANUAL REVIEW FAILED. LINE STATUS: UNRESOLVED.'},
        {speaker:'MARA',text:'There is your answer. The Archive cannot classify you because you were not copied from this page.'},
        {speaker:'YOU',text:'And you? Six pages. No body.'},
        {speaker:'MARA',text:storyFlags.answeredUnknown?'I am still Mara. I just do not know whether the first Mara is the one speaking anymore.':'I was hoping you would wait longer to ask that.'},
        {speaker:'UNKNOWN',text:'She is a note that learned to answer back.'},
        {speaker:'MARA',text:'Maybe. But notes can still point toward exits. Yours is ahead.'}
      ],()=>{storyObjectiveTextEl.textContent='LEAVE THE CORRECTION ARCHIVE';});
    }
  } else if(storyState==='endingDialogue'){
    if(Math.hypot(camera.position.x-STORY_TWO_EXIT.x,camera.position.z-STORY_TWO_EXIT.z)<2.35){
      setStoryMarker(STORY_TWO_EXIT,false); playRoundStinger('complete');
      showStoryDialogueSequence([
        {kicker:'CHAPTER TWO // EXIT',speaker:'MARA',text:'The next page is not an archive. It is a workshop.'},
        {speaker:'YOU',text:'The Artist.'},
        {speaker:'MARA',text:'Maybe. The repair logs were right about one thing: every time something erased the world, it drew pieces back.'},
        {speaker:'UNKNOWN',text:'You have been shooting the repair crew.'},
        {kicker:'CHAPTER TWO // COMPLETE',speaker:'MARA',text:'Then we find out what broke the page in the first place.'}
      ],()=>{saveStoryProgress(3);storyState='complete';storyCompletionAt=performance.now()+2600;storyObjectiveTextEl.textContent='CHAPTER TWO COMPLETE';showRoundBanner('STORY MODE','CHAPTER TWO COMPLETE','CORRECTIONS // END',2400);updateRoundHud();});
    }
  } else if(storyState==='complete'&&storyCompletionAt&&now>=storyCompletionAt){
    storyCompletionAt=0;gameStarted=false;document.body.classList.add('front-menu');document.body.classList.remove('story-mode');leaveControlSessionForOverlay();showMenuPanel('main',false);
  }
}

function startStoryMode() {
  if(selectedStoryChapter===2) startStoryChapterTwo();
  else if(selectedStoryChapter===1) startStoryChapterOne();
  else startStoryChapterZero();
}

function updateStoryMode(now,dt) {
  if(selectedStoryChapter===2) updateStoryChapterTwo(now,dt);
  else if(selectedStoryChapter===1) updateStoryChapterOne(now,dt);
  else updateStoryChapterZero(now,dt);
}

function combatIsActive() {
  const storyCombatStates = ['combatOne','combatTwo','bridgeFight','correction','archivePatrol','defense','corridorRun','proofreader'];
  return controlSessionActive() && ((gameMode === 'arena' && roundState === 'active') || (gameMode === 'story' && storyCombatStates.includes(storyState) && roundState === 'active'));
}

function getEnemySquadContext() {
  const active=enemies.filter(e=>e.alive&&!e.dying&&e.activeInRound);
  return {
    heavy:active.find(e=>e.type==='heavy'||e.type==='guardian'||e.type==='artist'||e.type==='proofreader')||null,
    sniper:active.find(e=>e.type==='sniper')||null,
    rusher:active.find(e=>e.type==='rusher')||null,
    flankers:active.filter(e=>e.type==='flanker')
  };
}

function updateEnemies(now, dt) {
  const squad = getEnemySquadContext();
  enemies.forEach(enemy => {
    if (enemy.dying) {
      const t = THREE.MathUtils.clamp((now - enemy.deathStart) / enemy.deathDuration, 0, 1);
      enemy.visual.rotation.z = enemy.deathDir * (.18 + t * .72);
      enemy.visual.rotation.x = t * .16;
      enemy.visual.position.y = -t * .82;
      const base = enemy.config.scale;
      enemy.visual.scale.set(base[0] * (1 + t * .08), Math.max(.04, base[1] * (1 - t * .92)), base[2] * (1 + t * .05));

      enemy.parts.forEach((part, i) => {
        const disappearAt = .10 + (i / Math.max(1, enemy.parts.length - 1)) * .24;
        if (t > disappearAt) part.visible = false;
      });

      if (t >= 1) {
        enemy.dying = false;
        enemy.activeInRound = false;
        enemy.group.visible = false;
        enemy.availableAt = now + 250;
      }
      return;
    }

    if (!enemy.alive || !enemy.activeInRound) return;

    enemy.knockbackOffset.addScaledVector(enemy.knockbackVelocity, dt);
    enemy.knockbackVelocity.multiplyScalar(Math.exp(-10 * dt));
    enemy.knockbackOffset.multiplyScalar(Math.exp(-3.8 * dt));
    enemy.flinch = THREE.MathUtils.damp(enemy.flinch, 0, 11, dt);
    enemy.headFlinch = THREE.MathUtils.damp(enemy.headFlinch, 0, 14, dt);

    const target = camera.position.clone();
    const toPlayer = target.clone().sub(enemy.navPosition);
    toPlayer.y = 0;
    const dist = toPlayer.length();
    const cfg = enemy.config;

    if (combatIsActive()) {
      if (cfg.behavior === 'rusher') {
        const pressureBoost = squad.sniper ? 1.18 : 1;
        if (dist > 1.45) moveEnemyToward(enemy, target, dt, cfg.speed * pressureBoost);
      } else if (cfg.behavior === 'flanker') {
        camera.getWorldDirection(forward);
        forward.y = 0; forward.normalize();
        right.crossVectors(forward, camera.up).normalize();
        const side = squad.flankers.length > 1 ? (enemy.index % 2 ? 1 : -1) : enemy.flankSide;
        const anchor = squad.heavy ? squad.heavy.navPosition.clone().lerp(target,.55) : target.clone();
        const flankTarget = anchor.addScaledVector(right, side * 8.5).addScaledVector(forward, -4.5);
        if (enemy.navPosition.distanceTo(flankTarget) > 2.2) moveEnemyToward(enemy, flankTarget, dt, cfg.speed);
      } else if (cfg.behavior === 'corrector') {
        camera.getWorldDirection(forward); forward.y = 0; forward.normalize();
        right.crossVectors(forward, camera.up).normalize();
        const correctionSide = enemy.index % 2 ? 1 : -1;
        const correctionTarget = target.clone().addScaledVector(right, correctionSide * 5.5).addScaledVector(forward, -7.0);
        if (dist > 8.5 || !enemyHasLineOfSight(enemy,target)) moveEnemyToward(enemy, correctionTarget, dt, cfg.speed);
      } else if (cfg.behavior === 'artist') {
        const phase = enemy.bossPhase || 1;
        if (phase === 1) {
          if (dist > 20) moveEnemyToward(enemy, target, dt, 1.15);
          else {
            const orbit = target.clone();
            orbit.x += Math.sin(now * .0007) * 13;
            orbit.z += Math.cos(now * .0007) * 13;
            moveEnemyToward(enemy, orbit, dt, 1.25);
          }
        } else if (phase === 2) {
          if (dist > 8) moveEnemyToward(enemy, target, dt, 2.0);
        } else {
          camera.getWorldDirection(forward); forward.y = 0; forward.normalize();
          right.crossVectors(forward, camera.up).normalize();
          const flankTarget = target.clone().addScaledVector(right, Math.sin(now * .0014) * 10).addScaledVector(forward, -5);
          moveEnemyToward(enemy, flankTarget, dt, 2.45);
        }
      } else if (cfg.behavior === 'heavy' || cfg.behavior === 'guardian') {
        const holdRange = cfg.behavior === 'guardian' ? 12 : (squad.rusher ? 17 : 13.5);
        if (dist > holdRange) moveEnemyToward(enemy, target, dt, cfg.speed);
      } else if (cfg.behavior === 'rifleman') {
        const swayTarget = squad.heavy && squad.heavy !== enemy ? squad.heavy.navPosition.clone() : enemy.origin.clone();
        swayTarget.x += Math.sin(now * .00058 + enemy.phase) * 1.7 + (enemy.index % 2 ? 2.1 : -2.1);
        swayTarget.z += Math.cos(now * .00043 + enemy.phase) * .55 + 1.6;
        if (enemyCanMoveAt(swayTarget.x,swayTarget.z)) enemy.navPosition.lerp(swayTarget, Math.min(1, dt * 1.65));
      }
    }

    enemy.group.position.copy(enemy.navPosition).add(enemy.knockbackOffset);
    enemy.group.position.y = Math.sin(now * .003 + enemy.phase) * .018;
    enemy.group.rotation.y = Math.atan2(camera.position.x - enemy.group.position.x, camera.position.z - enemy.group.position.z);

    enemy.visual.position.z = -.11 * enemy.flinch;
    enemy.visual.position.y = .025 * enemy.flinch;
    enemy.visual.rotation.x = -.13 * enemy.flinch;
    enemy.visual.rotation.z = enemy.flinchDir * .09 * enemy.flinch;

    if (enemy.headMesh) {
      const baseRot = enemy.headMesh.userData.baseRotation;
      enemy.headMesh.rotation.set(
        baseRot.x - .32 * enemy.headFlinch,
        baseRot.y + enemy.flinchDir * .18 * enemy.headFlinch,
        baseRot.z + enemy.flinchDir * .42 * enemy.headFlinch
      );
      enemy.headMesh.position.y = enemy.headMesh.userData.basePosition.y + .07 * enemy.headFlinch;
    }

    if (cfg.behavior === 'sniper') updateSniperTelegraph(enemy, now, target);

    if (combatIsActive() && now >= enemy.nextShotAt) {
      enemyShoot(enemy);
      if (enemy.type === 'artist') {
        const phase = enemy.bossPhase || 1;
        const min = phase === 1 ? 1300 : phase === 2 ? 900 : 620;
        const max = phase === 1 ? 1650 : phase === 2 ? 1200 : 820;
        enemy.nextShotAt = now + min + Math.random() * (max - min);
      } else {
        enemy.nextShotAt = now + cfg.shotMin + Math.random() * (cfg.shotMax - cfg.shotMin);
      }
    }
  });
}

function createPickup(type, x, z) {
  const group = new THREE.Group();
  const geom = new THREE.BoxGeometry(type === 'ammo' ? .72 : .62, .36, .72);
  const mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ color: type === 'ammo' ? 0xeee8d8 : 0xfffdf5 }));
  addSketchOutlines(mesh, geom, true);
  group.add(mesh);

  const ringG = new THREE.RingGeometry(.48, .53, 20);
  const ring = new THREE.Mesh(ringG, new THREE.MeshBasicMaterial({ color: INK, side: THREE.DoubleSide, transparent: true, opacity: .35 }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -.17;
  group.add(ring);
  group.position.set(x, .45, z);
  scene.add(group);
  pickups.push({ type, group, active: true, respawnAt: 0, phase: Math.random() * 10 });
}

createPickup('ammo', -8, 6);
createPickup('ammo', 18, -15);
createPickup('ammo', -22, -18);
createPickup('health', 8, -5);
createPickup('health', -18, 18);
createPickup('health', 24, 24);

function updatePickups(now) {
  pickups.forEach(p => {
    if (!p.active) {
      if (now >= p.respawnAt) { p.active = true; p.group.visible = true; }
      return;
    }
    p.group.rotation.y = now * .001 + p.phase;
    p.group.position.y = .48 + Math.sin(now * .003 + p.phase) * .1;
    const dx = camera.position.x - p.group.position.x;
    const dz = camera.position.z - p.group.position.z;
    if (dx*dx + dz*dz < 1.6) {
      if (p.type === 'health' && playerHealth < playerMaxHealth) {
        playerHealth = Math.min(playerMaxHealth, playerHealth + 35);
        updateHealthHud();
        showCombatMessage('+ HEALTH // 35');
        playPickupSound('health');
      } else if (p.type === 'ammo' && addAmmoToCurrentWeapon(24)) {
        showCombatMessage('+ AMMO // CURRENT WEAPON');
        playPickupSound('ammo');
      } else return;
      p.active = false;
      p.group.visible = false;
      p.respawnAt = now + 10000;
    }
  });
}


const muzzleFlash = new THREE.Group();
weaponRig.add(muzzleFlash);
muzzleFlash.position.set(0, .02, -1.31);
muzzleFlash.visible = false;
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * Math.PI * 2;
  const reach = .11 + (i % 3) * .045;
  const pts = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(Math.cos(a) * reach, Math.sin(a) * reach, -.05 - (i % 2) * .03)
  ];
  muzzleFlash.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color: INK_DARK, transparent: true, opacity: .9 })
  ));
}
let muzzleHideAt = 0;
function flashMuzzle() {
  muzzleFlash.rotation.z = Math.random() * Math.PI;
  muzzleFlash.scale.setScalar(.85 + Math.random() * .35);
  muzzleFlash.visible = true;
  muzzleHideAt = performance.now() + 48;
}

// Tiny paper casings help sell the automatic fire without requiring particle textures.
const shellCasings = [];
function ejectCasing() {
  const g = new THREE.BoxGeometry(.035, .025, .09);
  const casing = new THREE.Mesh(g, gunShade);
  addSketchOutlines(casing, g, false);
  casing.position.set(.20, .07, -.02);
  casing.rotation.set(Math.random(), Math.random(), Math.random());
  weaponRig.add(casing);
  shellCasings.push({
    mesh: casing,
    velocity: new THREE.Vector3(.9 + Math.random() * .35, .45 + Math.random() * .25, .12 + Math.random() * .25),
    spin: new THREE.Vector3(8 + Math.random() * 5, 6 + Math.random() * 4, 7 + Math.random() * 6),
    life: .65
  });
}

function updateShellCasings(dt) {
  for (let i = shellCasings.length - 1; i >= 0; i--) {
    const c = shellCasings[i];
    c.life -= dt;
    c.velocity.y -= 1.8 * dt;
    c.mesh.position.addScaledVector(c.velocity, dt);
    c.mesh.rotation.x += c.spin.x * dt;
    c.mesh.rotation.y += c.spin.y * dt;
    c.mesh.rotation.z += c.spin.z * dt;
    if (c.life <= 0) {
      weaponRig.remove(c.mesh);
      c.mesh.geometry.dispose();
      shellCasings.splice(i, 1);
    }
  }
}

// ---------- Movement ----------
const PLAYER_RADIUS = 0.38;
const STAND_EYE_HEIGHT = 1.72;
const CROUCH_EYE_HEIGHT = 1.06;
const EYE_HEIGHT = STAND_EYE_HEIGHT;
const STAND_COLLIDER_HEIGHT = 1.82;
const CROUCH_COLLIDER_HEIGHT = 1.16;
const WALK_SPEED = 5.0;
const CROUCH_SPEED = 3.1;
const SPRINT_SPEED = 8.1;
const GROUND_ACCEL = 32;
const AIR_ACCEL = 8;
const FRICTION = 12;
const JUMP_SPEED = 7.1;
const GRAVITY = 20;
const STEP_HEIGHT = .62;
const SURFACE_EPSILON = .012;
const SLIDE_START_SPEED = 10.3;
const SLIDE_DURATION = .82;
const SLIDE_DECEL = 6.0;
const SLIDE_STAMINA_COST = 7;
const DASH_SPEED = 17.0;
const DASH_DURATION = .16;
const DASH_COOLDOWN = .88;
const DASH_STAMINA_COST = 18;

const velocity = new THREE.Vector3();
const wish = new THREE.Vector3();
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const slideDirection = new THREE.Vector3();
const dashDirection = new THREE.Vector3();
let grounded = true;
let stamina = 100;
let bobPhase = 0;
let verticalOffset = 0;
let currentEyeHeight = STAND_EYE_HEIGHT;
let crouching = false;
let sliding = false;
let slideTimer = 0;
let slideSpeed = 0;
let dashTimer = 0;
let dashReadyAt = 0;
let isSprinting = false;
let impactFovKick = 0;
let rightMouseDown = false;
let rightMouseDownAt = 0;
let isAiming = false;
let rightMouseBecameAim = false;
const AIM_HOLD_MS = 155;
let lastTime = performance.now();
let nextFootstepAt = 0;

// ---------- Weapons, ammo progression, reload, and player combat state ----------
const WEAPON_PROFILES = {
  knife: {
    slot: 0, name: 'INK KNIFE', short: 'KNIFE', unlockRound: 1, melee: true,
    magSize: 0, reserveMax: 0, startReserve: 0, fireInterval: .46, reloadTime: 0,
    bodyDamage: 76, headDamage: 118, pellets: 1, spread: 0, meleeRange: 2.15,
    recoil: .28, pitch: .018, muzzleZ: -.72, visualScale: [1, 1, 1], viewOffset: [.12, -.08, .10], handPos: [-.08, -.20, -.38], adsPos: [.10, -.36, -.60], adsFov: 64
  },
  carbine: {
    slot: 1, name: 'SKETCH CARBINE', short: 'CARBINE', unlockRound: 1,
    magSize: 12, reserveMax: 84, startReserve: 48, fireInterval: .11, reloadTime: 1.85,
    bodyDamage: 38, headDamage: 82, pellets: 1, spread: 0,
    recoil: .62, pitch: .030, muzzleZ: -1.31, visualScale: [1, 1, 1], viewOffset: [0, 0, 0], handPos: [-.13, -.17, -.58], adsPos: [.16, -.48, -.82], adsFov: 58
  },
  pistol: {
    slot: 2, name: 'PENCIL PISTOL', short: 'PISTOL', unlockRound: 1,
    magSize: 9, reserveMax: 63, startReserve: 36, fireInterval: .24, reloadTime: 1.45,
    bodyDamage: 46, headDamage: 105, pellets: 1, spread: .0015,
    recoil: .48, pitch: .042, muzzleZ: -.72, visualScale: [1, 1, 1], viewOffset: [.13, -.02, .13], handPos: [-.04, -.20, -.24], adsPos: [.10, -.39, -.62], adsFov: 56,
    magScale: [.58, .72, .58], magPos: [0, -.22, .10]
  },
  shotgun: {
    slot: 3, name: 'CROSS-OUT SHOTGUN', short: 'SHOTGUN', unlockRound: 2,
    magSize: 6, reserveMax: 36, startReserve: 24, fireInterval: .58, reloadTime: 2.05,
    bodyDamage: 14, headDamage: 21, pellets: 8, spread: .030,
    recoil: 1.05, pitch: .070, muzzleZ: -1.58, visualScale: [1, 1, 1], viewOffset: [.01, -.015, .01], handPos: [-.13, -.17, -.76], adsPos: [.18, -.52, -.98], adsFov: 60,
    magScale: [.78,.82,.74], magPos: [0,-.25,-.02]
  },
  smg: {
    slot: 4, name: 'SCRIBBLE SMG', short: 'SMG', unlockRound: 3,
    magSize: 24, reserveMax: 144, startReserve: 72, fireInterval: .072, reloadTime: 1.62,
    bodyDamage: 22, headDamage: 47, pellets: 1, spread: .005,
    recoil: .38, pitch: .020, muzzleZ: -.98, visualScale: [1, 1, 1], viewOffset: [.075, -.025, .075], handPos: [-.10, -.18, -.48], adsPos: [.13, -.47, -.72], adsFov: 57,
    magScale: [.72,1.06,.72], magPos: [0,-.26,-.12]
  },
  rifle: {
    slot: 5, name: 'RULER RIFLE', short: 'RULER', unlockRound: 4,
    magSize: 5, reserveMax: 35, startReserve: 20, fireInterval: .52, reloadTime: 2.15,
    bodyDamage: 76, headDamage: 180, pellets: 1, spread: 0,
    recoil: .92, pitch: .065, muzzleZ: -1.72, visualScale: [1, 1, 1], viewOffset: [0, 0, .045], handPos: [-.14, -.17, -.79], adsPos: [0, -.22, -.70], adsFov: 29, scoped: true,
    magScale: [.76,.84,.76], magPos: [0,-.25,-.08]
  },
  marker: {
    slot: 6, name: 'MARKER HEAVY', short: 'MARKER', unlockRound: 5,
    magSize: 8, reserveMax: 48, startReserve: 28, fireInterval: .34, reloadTime: 2.35,
    bodyDamage: 58, headDamage: 112, pellets: 1, spread: .004,
    recoil: 1.12, pitch: .075, muzzleZ: -1.46, visualScale: [1, 1, 1], viewOffset: [0, -.035, .035], handPos: [-.16, -.20, -.64], adsPos: [.20, -.60, -.98], adsFov: 61,
    magScale: [1.05,1.08,1.0], magPos: [0,-.25,-.08]
  }
};

const weaponStates = {};
Object.entries(WEAPON_PROFILES).forEach(([id, w]) => {
  weaponStates[id] = { ammo: w.magSize, reserve: w.startReserve };
});

const unlockedWeapons = new Set(['knife', 'carbine', 'pistol']);
let currentWeaponId = 'carbine';
let ammoCurrent = weaponStates.carbine.ammo;
let ammoReserve = weaponStates.carbine.reserve;
let isReloading = false;
let lastShotAt = -9999;
let playerHealth = 100;
const activeWeaponBasePos = WEAPON_BASE_POS.clone();
const activeWeaponBaseRot = new THREE.Euler().copy(WEAPON_BASE_ROT);
const activeLeftHandBase = LEFT_HAND_BASE.clone();
const weaponVariantGroup = new THREE.Group();
weaponRig.add(weaponVariantGroup);

function clearWeaponVariantVisual() {
  while (weaponVariantGroup.children.length) {
    const child = weaponVariantGroup.children.pop();
    child.traverse?.(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material && obj.material !== gunPaper && obj.material !== gunShade) obj.material.dispose?.();
    });
  }
}

function buildWeaponVariantVisual(id) {
  clearWeaponVariantVisual();

  if (id === 'knife') {
    // A chunky notebook-combat knife: blocky handle, guard and a tapered-looking blade.
    boxPart(weaponVariantGroup, .16, .18, .42, .05, -.12, -.18, -.08, 0, -.08, gunShade);
    boxPart(weaponVariantGroup, .34, .055, .12, .03, -.02, -.38, 0, 0, -.03, gunPaper);
    boxPart(weaponVariantGroup, .105, .045, .58, .03, .015, -.67, 0, 0, .02, gunPaper);
    boxPart(weaponVariantGroup, .035, .052, .26, .075, .012, -1.03, 0, .05, .02, gunPaper);
    const knifeHandMat = handPaper.clone();
    boxPart(weaponVariantGroup, .22, .22, .22, .09, -.24, .00, -.10, 0, -.10, knifeHandMat);
    boxPart(weaponVariantGroup, .18, .18, .52, .17, -.37, .30, .08, -.04, -.08, knifeHandMat);
    // Ink groove down the blade.
    const groove = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(.02,.045,-.45), new THREE.Vector3(.02,.045,-.96)
    ]);
    weaponVariantGroup.add(new THREE.Line(groove, new THREE.LineBasicMaterial({ color: INK_DARK, transparent: true, opacity: .55 })));
  } else if (id === 'pistol') {
    // Entire pistol silhouette, not a shrunken rifle.
    boxPart(weaponVariantGroup, .29, .15, .62, 0, .04, -.28, 0, 0, 0, gunPaper);      // slide
    boxPart(weaponVariantGroup, .25, .11, .46, 0, -.085, -.22, 0, 0, 0, gunShade);    // frame
    boxPart(weaponVariantGroup, .19, .39, .20, .015, -.32, -.02, -.24, 0, 0, gunShade); // grip
    boxPart(weaponVariantGroup, .16, .025, .18, 0, -.205, -.27, 0, 0, 0, gunPaper);   // trigger guard base
    cylinderPart(weaponVariantGroup, .027, .22, 0, .04, -.69, Math.PI/2, 0, 0, gunShade);
    boxPart(weaponVariantGroup, .065, .065, .04, 0, .145, -.48, 0, 0, 0, gunShade);   // front sight
    boxPart(weaponVariantGroup, .11, .055, .04, 0, .145, -.04, 0, 0, 0, gunShade);   // rear sight
  } else if (id === 'shotgun') {
    boxPart(weaponVariantGroup, .34, .20, .56, 0, -.02, -.10, 0, 0, 0, gunShade);     // receiver
    boxPart(weaponVariantGroup, .28, .18, .55, 0, -.02, .43, 0, 0, 0, gunPaper);      // stock
    cylinderPart(weaponVariantGroup, .037, 1.05, 0, .035, -.90, Math.PI/2, 0, 0, gunPaper); // barrel
    cylinderPart(weaponVariantGroup, .032, .92, 0, -.075, -.85, Math.PI/2, 0, 0, gunShade); // tube
    boxPart(weaponVariantGroup, .38, .15, .46, 0, -.12, -.64, 0, 0, 0, gunPaper);     // pump
    boxPart(weaponVariantGroup, .16, .34, .15, .03, -.32, .08, -.25, 0, 0, gunShade);
  } else if (id === 'smg') {
    boxPart(weaponVariantGroup, .38, .24, .58, 0, -.01, -.16, 0, 0, 0, gunShade);     // compact receiver
    boxPart(weaponVariantGroup, .31, .18, .30, 0, .00, -.56, 0, 0, 0, gunPaper);      // short front
    cylinderPart(weaponVariantGroup, .032, .26, 0, .01, -.81, Math.PI/2, 0, 0, gunShade);
    boxPart(weaponVariantGroup, .14, .38, .15, -.02, -.35, -.24, -.10, 0, 0, gunShade); // straight mag
    boxPart(weaponVariantGroup, .14, .30, .13, .00, -.30, -.55, -.04, 0, 0, gunPaper); // foregrip
    boxPart(weaponVariantGroup, .27, .12, .28, 0, .00, .35, 0, 0, 0, gunPaper);       // compact stock
  } else if (id === 'rifle') {
    boxPart(weaponVariantGroup, .31, .18, .75, 0, -.01, -.22, 0, 0, 0, gunShade);
    boxPart(weaponVariantGroup, .25, .14, .70, 0, .00, -.86, 0, 0, 0, gunPaper);
    cylinderPart(weaponVariantGroup, .027, .82, 0, .01, -1.55, Math.PI/2, 0, 0, gunShade);
    boxPart(weaponVariantGroup, .26, .18, .52, 0, -.01, .44, 0, 0, 0, gunPaper);
    boxPart(weaponVariantGroup, .035, .035, 1.28, .18, .08, -.55, 0, 0, 0, gunShade);  // ruler rail
    cylinderPart(weaponVariantGroup, .095, .38, 0, .23, -.29, Math.PI/2, 0, 0, gunPaper); // scope tube
    cylinderPart(weaponVariantGroup, .12, .055, 0, .23, -.50, Math.PI/2, 0, 0, gunShade);
    boxPart(weaponVariantGroup, .16, .34, .15, .03, -.33, .12, -.24, 0, 0, gunShade);
  } else if (id === 'marker') {
    cylinderPart(weaponVariantGroup, .15, .86, 0, .00, -.55, Math.PI / 2, 0, 0, gunPaper); // huge marker body
    cylinderPart(weaponVariantGroup, .10, .55, 0, .00, -1.22, Math.PI / 2, 0, 0, gunShade);
    cylinderPart(weaponVariantGroup, .14, .18, 0, .00, -1.56, Math.PI / 2, 0, 0, gunPaper);
    boxPart(weaponVariantGroup, .43, .25, .38, 0, -.04, .02, 0, 0, 0, gunShade);
    boxPart(weaponVariantGroup, .21, .38, .18, .03, -.36, .12, -.23, 0, 0, gunShade);
    cylinderPart(weaponVariantGroup, .18, .22, 0, -.25, -.13, Math.PI/2, 0, 0, gunPaper); // drum-ish mag
  }
}

function currentWeapon() {
  return WEAPON_PROFILES[currentWeaponId];
}

function syncCurrentWeaponAmmo() {
  weaponStates[currentWeaponId].ammo = ammoCurrent;
  weaponStates[currentWeaponId].reserve = ammoReserve;
}

function updateWeaponRack() {
  weaponSlotEls.forEach(el => {
    const id = el.dataset.weapon;
    el.classList.toggle('locked', !unlockedWeapons.has(id));
    el.classList.toggle('active', id === currentWeaponId);
  });
}

function applyWeaponVisualProfile() {
  const w = currentWeapon();
  const isCarbine = currentWeaponId === 'carbine';
  const isKnife = !!w.melee;

  gunBody.visible = isCarbine;
  chargingHandle.visible = !isKnife && currentWeaponId !== 'pistol' && currentWeaponId !== 'shotgun' && currentWeaponId !== 'marker';
  rightHand.visible = !isKnife;
  leftHand.visible = !isKnife && currentWeaponId !== 'pistol';

  const magScale = w.magScale || [1,1,1];
  const magPos = w.magPos || [MAG_SEATED_POS.x, MAG_SEATED_POS.y, MAG_SEATED_POS.z];
  seatedMagazine.scale.set(...magScale);
  spareMagazine.scale.copy(seatedMagazine.scale);
  seatedMagazine.position.set(...magPos);
  seatedMagazine.visible = !isKnife;
  spareMagazine.visible = false;

  activeWeaponBasePos.copy(WEAPON_BASE_POS).add(new THREE.Vector3(...w.viewOffset));
  activeWeaponBaseRot.copy(WEAPON_BASE_ROT);
  activeLeftHandBase.set(...w.handPos);
  leftHand.position.copy(activeLeftHandBase);
  rightHand.position.set(0,0,0);
  if (currentWeaponId === 'pistol') rightHand.position.set(.02,-.02,.02);
  muzzleFlash.position.z = w.muzzleZ;
  muzzleFlash.visible = false;
  buildWeaponVariantVisual(currentWeaponId);
  weaponRig.position.copy(activeWeaponBasePos);
  weaponRig.rotation.copy(activeWeaponBaseRot);
  updateWeaponRack();
}

function updateAmmoHud() {
  const w = currentWeapon();
  ammoLabelEl.textContent = w.name;
  weaponNameEl.textContent = w.name;
  if (w.melee) {
    ammoCurrentEl.textContent = '∞';
    ammoReserveEl.textContent = '—';
    reloadNote.textContent = 'MELEE // READY';
  } else {
    ammoCurrentEl.textContent = String(ammoCurrent).padStart(2, '0');
    ammoReserveEl.textContent = String(ammoReserve).padStart(2, '0');
    reloadNote.textContent = isReloading ? 'MAG SWAP...' : (ammoCurrent ? `SLOT ${w.slot} // READY` : 'EMPTY · TAP RMB');
  }
  reloadNote.classList.toggle('reloading', isReloading);
}

function unlockWeapon(id, announce = false) {
  if (!WEAPON_PROFILES[id] || unlockedWeapons.has(id)) return false;
  unlockedWeapons.add(id);
  updateWeaponRack();
  if (announce) {
    const w = WEAPON_PROFILES[id];
    showCombatMessage(`NEW DRAWING // ${w.name} // KEY ${w.slot}`, 1800);
  }
  return true;
}

function switchWeaponBySlot(slot) {
  if (!controlSessionActive()) return;
  const entry = Object.entries(WEAPON_PROFILES).find(([, w]) => w.slot === slot);
  if (!entry) return;
  const [id, profile] = entry;
  if (!unlockedWeapons.has(id)) {
    showCombatMessage(`${profile.name} // LOCKED UNTIL ROUND ${profile.unlockRound}`, 950);
    return;
  }
  if (id === currentWeaponId || playerHealth <= 0) return;

  syncCurrentWeaponAmmo();
  cancelReload();
  triggerHeld = false;
  mobileAimActive = false;
  isAiming = false;
  currentWeaponId = id;
  ammoCurrent = weaponStates[id].ammo;
  ammoReserve = weaponStates[id].reserve;
  lastShotAt = -9999;
  applyWeaponVisualProfile();
  updateAmmoHud();
  showCombatMessage(`DRAWN // ${profile.name}`, 650);
}

function addAmmoToCurrentWeapon(amount) {
  const w = currentWeapon();
  if (w.melee) return false;
  if (ammoReserve >= w.reserveMax) return false;
  ammoReserve = Math.min(w.reserveMax, ammoReserve + amount);
  syncCurrentWeaponAmmo();
  updateAmmoHud();
  return true;
}

function refillUnlockedWeaponAmmo(fraction = .25) {
  syncCurrentWeaponAmmo();
  unlockedWeapons.forEach(id => {
    const w = WEAPON_PROFILES[id];
    if (w.melee) return;
    const state = weaponStates[id];
    state.reserve = Math.min(w.reserveMax, state.reserve + Math.max(w.magSize, Math.round(w.reserveMax * fraction)));
  });
  ammoCurrent = weaponStates[currentWeaponId].ammo;
  ammoReserve = weaponStates[currentWeaponId].reserve;
  updateAmmoHud();
}

function updateHealthHud() {
  healthFill.style.transform = `scaleX(${THREE.MathUtils.clamp(Math.max(0, playerHealth) / Math.max(1, playerMaxHealth),0,1)})`;
  healthValue.textContent = `${Math.max(0, Math.round(playerHealth))}${playerMaxHealth > 100 ? `/${playerMaxHealth}` : ''}`;
}

function startReload() {
  const w = currentWeapon();
  if (w.melee) return;
  if (!controlSessionActive() || isReloading || ammoCurrent === w.magSize || ammoReserve <= 0 || playerHealth <= 0) return;
  isReloading = true;
  weaponRig.visible = true;
  isAiming = false;
  rightMouseBecameAim = false;
  reloadStartAt = performance.now();
  playReloadSound('start');
  reloadAmmoCommitted = false;
  triggerHeld = false;
  seatedMagazine.visible = true;
  seatedMagazine.position.copy(getCurrentMagSeat());
  seatedMagazine.rotation.set(0, 0, 0);
  spareMagazine.visible = false;
  chargingHandle.position.z = CHARGE_BASE_Z;
  updateAmmoHud();
}

function commitReloadAmmo() {
  if (reloadAmmoCommitted) return;
  const w = currentWeapon();
  const needed = w.magSize - ammoCurrent;
  const transfer = Math.min(needed, ammoReserve);
  ammoCurrent += transfer;
  ammoReserve -= transfer;
  syncCurrentWeaponAmmo();
  reloadAmmoCommitted = true;
  playReloadSound('seat');
  updateAmmoHud();
}

function finishReload() {
  if (!isReloading) return;
  if (!reloadAmmoCommitted) commitReloadAmmo();
  isReloading = false;
  weaponRig.visible = true;
  spareMagazine.visible = false;
  seatedMagazine.visible = true;
  seatedMagazine.position.copy(getCurrentMagSeat());
  seatedMagazine.rotation.set(0, 0, 0);
  leftHand.position.copy(activeLeftHandBase);
  leftHand.rotation.set(0, 0, 0);
  chargingHandle.position.z = CHARGE_BASE_Z;
  playReloadSound('charge');
  syncCurrentWeaponAmmo();
  updateAmmoHud();
}

function cancelReload() {
  isReloading = false;
  weaponRig.visible = true;
  reloadAmmoCommitted = false;
  spareMagazine.visible = false;
  seatedMagazine.visible = !currentWeapon().melee;
  seatedMagazine.position.copy(getCurrentMagSeat());
  seatedMagazine.rotation.set(0, 0, 0);
  leftHand.position.copy(activeLeftHandBase);
  leftHand.rotation.set(0, 0, 0);
  chargingHandle.position.z = CHARGE_BASE_Z;
  updateAmmoHud();
}

function smooth01(t) {
  t = THREE.MathUtils.clamp(t, 0, 1);
  return t * t * (3 - 2 * t);
}

function segment01(t, a, b) {
  return smooth01((t - a) / (b - a));
}

function lerpVec(a, b, t, out) {
  return out.copy(a).lerp(b, t);
}

const reloadVec = new THREE.Vector3();
const reloadWeaponOffset = new THREE.Vector3();
const MAG_DROP_POS = new THREE.Vector3(-.08, -.78, .04);
const SPARE_START_POS = new THREE.Vector3(-.48, -.79, .22);
const MAG_GRAB_POS = new THREE.Vector3(-.12, -.42, -.04);
const OLD_MAG_LOW_POS = new THREE.Vector3(-.22, -.71, .04);
const CHARGE_HAND_POS = new THREE.Vector3(.19, .08, .16);

function updateReloadAnimation(now) {
  if (!isReloading) return false;

  const t = THREE.MathUtils.clamp((now - reloadStartAt) / (currentWeapon().reloadTime * upgradeState.reloadMul * 1000), 0, 1);
  const poseIn = segment01(t, 0.00, 0.14);
  const poseOut = segment01(t, 0.84, 1.00);
  const pose = poseIn * (1 - poseOut);
  reloadWeaponOffset.set(-.12 * pose, -.07 * pose, .08 * pose);

  weaponRig.position.copy(activeWeaponBasePos).add(reloadWeaponOffset);
  weaponRig.rotation.set(
    activeWeaponBaseRot.x - .12 * pose,
    activeWeaponBaseRot.y + .17 * pose,
    activeWeaponBaseRot.z - .46 * pose
  );

  if (t < .20) {
    lerpVec(activeLeftHandBase, MAG_GRAB_POS, segment01(t, .04, .20), leftHand.position);
    leftHand.rotation.z = -.18 * segment01(t, .08, .20);
  } else if (t < .36) {
    const p = segment01(t, .20, .36);
    lerpVec(MAG_GRAB_POS, OLD_MAG_LOW_POS, p, leftHand.position);
    lerpVec(getCurrentMagSeat(), MAG_DROP_POS, p, seatedMagazine.position);
    seatedMagazine.rotation.z = .22 * p;
    seatedMagazine.rotation.x = -.10 * p;
  } else if (t < .46) {
    seatedMagazine.visible = false;
    spareMagazine.visible = true;
    spareMagazine.position.copy(SPARE_START_POS);
    spareMagazine.rotation.set(-.13, .06, .18);
    lerpVec(OLD_MAG_LOW_POS, SPARE_START_POS.clone().add(new THREE.Vector3(.02, -.02, .02)), segment01(t, .36, .46), leftHand.position);
  } else if (t < .66) {
    const p = segment01(t, .46, .66);
    spareMagazine.visible = true;
    lerpVec(SPARE_START_POS, getCurrentMagSeat(), p, spareMagazine.position);
    spareMagazine.rotation.set(-.13 * (1-p), .06 * (1-p), .18 * (1-p));
    reloadVec.copy(spareMagazine.position).add(new THREE.Vector3(-.01, -.07, .02));
    leftHand.position.copy(reloadVec);
    leftHand.rotation.z = THREE.MathUtils.lerp(-.12, .04, p);
  } else if (t < .72) {
    if (!reloadAmmoCommitted) {
      commitReloadAmmo();
      spareMagazine.visible = false;
      seatedMagazine.visible = true;
      seatedMagazine.position.copy(getCurrentMagSeat());
      seatedMagazine.rotation.set(0, 0, 0);
    }
    const p = segment01(t, .66, .72);
    lerpVec(MAG_GRAB_POS, CHARGE_HAND_POS, p, leftHand.position);
    leftHand.rotation.z = THREE.MathUtils.lerp(.04, -.12, p);
  } else if (t < .86) {
    const back = t < .79 ? segment01(t, .72, .79) : 1 - segment01(t, .79, .86);
    chargingHandle.position.z = CHARGE_BASE_Z + .17 * back;
    leftHand.position.copy(CHARGE_HAND_POS);
    leftHand.position.z += .17 * back;
    leftHand.rotation.set(-.18, .08, -.08);
  } else {
    const p = segment01(t, .86, 1.00);
    lerpVec(CHARGE_HAND_POS, activeLeftHandBase, p, leftHand.position);
    leftHand.rotation.x = THREE.MathUtils.lerp(-.18, 0, p);
    leftHand.rotation.y = THREE.MathUtils.lerp(.08, 0, p);
    leftHand.rotation.z = THREE.MathUtils.lerp(-.08, 0, p);
  }

  if (t >= 1) finishReload();
  return true;
}

function updateWeaponAnimation(now, dt) {
  weaponSwayX = THREE.MathUtils.damp(weaponSwayX, 0, 8, dt);
  weaponSwayY = THREE.MathUtils.damp(weaponSwayY, 0, 8, dt);
  recoilKick = THREE.MathUtils.damp(recoilKick, 0, 18, dt);
  recoilPitch = THREE.MathUtils.damp(recoilPitch, 0, 16, dt);
  recoilYaw = THREE.MathUtils.damp(recoilYaw, 0, 15, dt);
  recoilRoll = THREE.MathUtils.damp(recoilRoll, 0, 14, dt);

  if (updateReloadAnimation(now)) return;

  const breathe = Math.sin(now * .0017) * .006;
  const aimAmount = isAiming ? 1 : 0;
  const w = currentWeapon();
  const ads = w.adsPos || [0, -.20, -.62];
  const normalX = activeWeaponBasePos.x - weaponSwayX * 1.15 + recoilYaw * .04;
  const normalY = activeWeaponBasePos.y + weaponSwayY * .75 + breathe - recoilKick * .018;
  const normalZ = activeWeaponBasePos.z + recoilKick * .075;

  // Scoped rifles use the HUD optic as the sight picture. Lower the 3D rifle during
  // the transition, then hide it at full scope so the barrel/optic housing can never
  // sit over the reticle. Standard ADS weapons stay visible but use per-gun offsets.
  const fullyScoped = isAiming && w.scoped && aimAmount > .98;
  weaponRig.visible = !fullyScoped;

  weaponRig.position.set(
    THREE.MathUtils.lerp(normalX, ads[0], aimAmount),
    THREE.MathUtils.lerp(normalY, ads[1], aimAmount),
    THREE.MathUtils.lerp(normalZ, ads[2] + recoilKick * .035, aimAmount)
  );
  weaponRig.rotation.set(
    THREE.MathUtils.lerp(activeWeaponBaseRot.x - weaponSwayY * .7 + recoilPitch, recoilPitch * .42, aimAmount),
    THREE.MathUtils.lerp(activeWeaponBaseRot.y - weaponSwayX * .8 + recoilYaw, recoilYaw * .22, aimAmount),
    THREE.MathUtils.lerp(activeWeaponBaseRot.z + recoilRoll, recoilRoll * .25, aimAmount)
  );
}


function showCombatMessage(text, duration = 650) {
  combatMessageEl.textContent = text;
  combatMessageEl.classList.add('visible');
  clearTimeout(showCombatMessage.timer);
  showCombatMessage.timer = setTimeout(() => combatMessageEl.classList.remove('visible'), duration);
}

function flashHitmarker(kill = false, headshot = false) {
  hitmarkerEl.classList.toggle('kill', kill);
  hitmarkerEl.classList.toggle('headshot', headshot);
  hitmarkerEl.classList.add('active');
  clearTimeout(flashHitmarker.timer);
  flashHitmarker.timer = setTimeout(() => hitmarkerEl.classList.remove('active', 'kill', 'headshot'), headshot ? 125 : 95);
}

function damagePlayer(amount) {
  const now = performance.now();
  if (playerHealth <= 0 || now < playerInvulnerableUntil) return;
  amount *= upgradeState.damageTakenMul;
  playerHealth = Math.max(0, playerHealth - amount);
  updateHealthHud();
  damageVignetteEl.classList.add('active');
  clearTimeout(damagePlayer.timer);
  damagePlayer.timer = setTimeout(() => damageVignetteEl.classList.remove('active'), 140);
  if (playerHealth <= 0) {
    triggerHeld = false;
    showCombatMessage('INKED OUT // RESPAWNING', 1100);
    setTimeout(respawnPlayer, 950);
  }
}

function respawnPlayer() {
  if (gameMode === 'story') {
    camera.position.copy(storyCheckpoint);
    camera.position.y = EYE_HEIGHT;
  } else {
    camera.position.set(0, EYE_HEIGHT, 16);
  }
  verticalOffset = 0;
  currentEyeHeight = STAND_EYE_HEIGHT;
  velocity.set(0, 0, 0);
  crouching = false;
  sliding = false;
  slideTimer = 0;
  dashTimer = 0;
  isAiming = false;
  rightMouseDown = false;
  playerHealth = playerMaxHealth;
  playerInvulnerableUntil = performance.now() + 2200;
  const w = currentWeapon();
  if (!w.melee) {
    ammoCurrent = w.magSize;
    ammoReserve = Math.max(ammoReserve, w.magSize * 2);
    syncCurrentWeaponAmmo();
  }
  cancelReload();
  updateHealthHud();
  updateAmmoHud();
  showCombatMessage('REDRAWN // 2s SPAWN SHIELD', 1200);
}

applyWeaponVisualProfile();
updateAmmoHud();
updateHealthHud();
updateRoundHud();

function wantsCrouchInput() {
  return !!(keys.ControlLeft || keys.ControlRight || keys.KeyC || mobileCrouchHeld);
}

function currentColliderHeight() {
  return (crouching || sliding) ? CROUCH_COLLIDER_HEIGHT : STAND_COLLIDER_HEIGHT;
}

// The sniper nest stairs use a dedicated walkable surface instead of stacked AABB
// colliders. This prevents the player capsule from colliding with the next riser
// before it has finished stepping onto the current one. The visible boxes remain.
function sniperStairSurfaceHeight(x, z) {
  if (gameMode !== 'arena') return null;
  const towerX = -29;
  const outerZ = 20.45;
  const innerZ = 13.05;
  if (Math.abs(x - towerX) > 1.48 || z > outerZ || z < innerZ) return null;
  const t = THREE.MathUtils.clamp((outerZ - z) / (outerZ - innerZ), 0, 1);
  const stepIndex = Math.min(8, Math.floor(t * 9));
  return .45 * (stepIndex + 1) + SURFACE_EPSILON;
}

function specialWalkableSurfaceHeight(x, z) {
  return sniperStairSurfaceHeight(x, z);
}

function overlapsBoxXZ(x, z, box, radius = PLAYER_RADIUS) {
  return (
    x + radius > box.min.x &&
    x - radius < box.max.x &&
    z + radius > box.min.z &&
    z - radius < box.max.z
  );
}

function canOccupyAt(x, z, height = currentColliderHeight(), feetY = verticalOffset) {
  const headY = feetY + height;
  for (const box of colliders) {
    if (!overlapsBoxXZ(x, z, box)) continue;
    const verticalOverlap = headY > box.min.y + .002 && feetY < box.max.y - .002;
    if (verticalOverlap) return false;
  }
  return true;
}

function findStepHeightAt(x, z, feetY, height = currentColliderHeight()) {
  const candidates = [];
  for (const box of colliders) {
    if (!overlapsBoxXZ(x, z, box)) continue;
    const rise = box.max.y - feetY;
    if (rise > .025 && rise <= STEP_HEIGHT + .015) candidates.push(box.max.y + SURFACE_EPSILON);
  }
  candidates.sort((a, b) => a - b);
  for (const candidate of candidates) {
    if (canOccupyAt(x, z, height, candidate)) return candidate;
  }
  return null;
}

function findLandingSurface(x, z, previousFeetY, nextFeetY, height = currentColliderHeight()) {
  let best = null;
  const special = specialWalkableSurfaceHeight(x, z);
  if (special !== null && special <= previousFeetY + .62 && special >= nextFeetY - .08) best = special;
  for (const box of colliders) {
    if (!overlapsBoxXZ(x, z, box, PLAYER_RADIUS * .84)) continue;
    const top = box.max.y;
    if (top <= previousFeetY + .055 && top >= nextFeetY - .065) {
      const candidate = top + SURFACE_EPSILON;
      if (canOccupyAt(x, z, height, candidate) && (best === null || candidate > best)) best = candidate;
    }
  }
  return best;
}

function findCeilingHeight(x, z, previousFeetY, nextFeetY, height = currentColliderHeight()) {
  const previousHead = previousFeetY + height;
  const nextHead = nextFeetY + height;
  let ceiling = null;
  for (const box of colliders) {
    if (!overlapsBoxXZ(x, z, box, PLAYER_RADIUS * .82)) continue;
    if (box.min.y >= previousHead - .02 && box.min.y <= nextHead + .02) {
      if (ceiling === null || box.min.y < ceiling) ceiling = box.min.y;
    }
  }
  return ceiling;
}

function tryStartSlide() {
  if (!controlSessionActive() || !grounded || sliding || dashTimer > 0) return;
  const speed = Math.hypot(velocity.x, velocity.z);
  const sprintIntent = ((keys.ShiftLeft || keys.ShiftRight) && keys.KeyW) || (mobileSprintHeld && mobileMoveY > .28);
  if (!sprintIntent && speed < 6.15) return;
  if (stamina < SLIDE_STAMINA_COST) return;

  slideDirection.set(velocity.x, 0, velocity.z);
  if (slideDirection.lengthSq() < .1) {
    camera.getWorldDirection(slideDirection);
    slideDirection.y = 0;
  }
  slideDirection.normalize();
  slideSpeed = Math.max(SLIDE_START_SPEED, speed * 1.08);
  slideTimer = SLIDE_DURATION;
  sliding = true;
  crouching = true;
  isAiming = false;
  playMovementSound('slide');
  stamina = Math.max(0, stamina - SLIDE_STAMINA_COST);
  movementNoteEl.classList.add('active');
}

function tryDash() {
  if (!controlSessionActive() || playerHealth <= 0 || isReloading) return;
  const now = performance.now();
  if (now < dashReadyAt || stamina < DASH_STAMINA_COST) return;

  camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();
  right.crossVectors(forward, camera.up).normalize();

  const ix = THREE.MathUtils.clamp((keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0) + mobileMoveX, -1, 1);
  const iz = THREE.MathUtils.clamp((keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0) + mobileMoveY, -1, 1);
  dashDirection.set(0, 0, 0);
  dashDirection.addScaledVector(forward, iz || (ix === 0 ? 1 : 0));
  dashDirection.addScaledVector(right, ix);
  if (dashDirection.lengthSq() < .01) dashDirection.copy(forward);
  dashDirection.normalize();

  dashTimer = DASH_DURATION;
  isAiming = false;
  playMovementSound('dash');
  dashReadyAt = now + DASH_COOLDOWN * upgradeState.dashCooldownMul * 1000;
  stamina = Math.max(0, stamina - DASH_STAMINA_COST);
  sliding = false;
  crouching = false;
  velocity.x = dashDirection.x * DASH_SPEED;
  velocity.z = dashDirection.z * DASH_SPEED;
  impactFovKick = Math.max(impactFovKick, 3.5);
  if (upgradeState.dashDamage) {
    damageEnemiesInRadius(camera.position.clone(), 2.35, 54, null, false);
    nextDashTrailTick = now + 45;
  }
  movementNoteEl.classList.add('active');
}

function tryJump() {
  if (!controlSessionActive() || !grounded || dashTimer > 0) return;
  const wasSliding = sliding;
  sliding = false;
  crouching = false;
  velocity.y = JUMP_SPEED;
  if (wasSliding) {
    velocity.x *= 1.04;
    velocity.z *= 1.04;
  }
  grounded = false;
}

function collidesAt(x, z, height = currentColliderHeight()) {
  return !canOccupyAt(x, z, height);
}

function updateMovement(dt) {
  if (!controlSessionActive()) {
    velocity.x *= Math.max(0, 1 - FRICTION * dt);
    velocity.z *= Math.max(0, 1 - FRICTION * dt);
    return;
  }

  const now = performance.now();
  const ix = THREE.MathUtils.clamp((keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0) + mobileMoveX, -1, 1);
  const iz = THREE.MathUtils.clamp((keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0) + mobileMoveY, -1, 1);
  const moving = ix !== 0 || iz !== 0;
  const crouchHeld = wantsCrouchInput();

  camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();
  right.crossVectors(forward, camera.up).normalize();

  const inputMagnitude = IS_TOUCH_DEVICE ? Math.min(1, Math.hypot(ix, iz)) : 1;
  wish.set(0, 0, 0);
  wish.addScaledVector(forward, iz);
  wish.addScaledVector(right, ix);
  if (wish.lengthSq() > 0) wish.normalize();

  if (!sliding && dashTimer <= 0) {
    if (crouchHeld) crouching = true;
    else if (crouching && canOccupyAt(camera.position.x, camera.position.z, STAND_COLLIDER_HEIGHT)) crouching = false;
  }

  const wantsSprint = keys.ShiftLeft || keys.ShiftRight || mobileSprintHeld;
  isSprinting = wantsSprint && iz > 0 && moving && stamina > 1 && grounded && !crouching && !sliding && dashTimer <= 0 && !isAiming;

  if (dashTimer > 0) {
    dashTimer = Math.max(0, dashTimer - dt);
    const dashPower = DASH_SPEED * (.88 + .12 * (dashTimer / DASH_DURATION));
    velocity.x = dashDirection.x * dashPower;
    velocity.z = dashDirection.z * dashPower;
    if (upgradeState.dashDamage && now >= nextDashTrailTick) {
      nextDashTrailTick = now + 58;
      damageEnemiesInRadius(camera.position.clone(), 1.65, 20, null, false);
      spawnInkBurst(camera.position.clone().add(new THREE.Vector3(0,-.8,0)), 3, .15);
    }
  } else if (sliding) {
    slideTimer = Math.max(0, slideTimer - dt);
    const slideFriction = pointInInkPuddle(camera.position.x,camera.position.z) ? .55 : 1;
    slideSpeed = Math.max(0, slideSpeed - SLIDE_DECEL * slideFriction * dt);

    if (moving) {
      const steered = slideDirection.clone().multiplyScalar(.92).addScaledVector(wish, .08).normalize();
      slideDirection.lerp(steered, Math.min(1, dt * 5));
    }

    velocity.x = slideDirection.x * slideSpeed;
    velocity.z = slideDirection.z * slideSpeed;

    if (slideTimer <= 0 || slideSpeed < 4.25) {
      sliding = false;
      crouching = crouchHeld;
    }
  } else {
    const puddleBoost = pointInInkPuddle(camera.position.x,camera.position.z) ? 1.12 : 1;
    const crossoutBoost = now < crossoutSpeedUntil ? 1.18 : 1;
    const maxSpeed = (crouching ? CROUCH_SPEED : (isSprinting ? SPRINT_SPEED : WALK_SPEED)) * upgradeState.moveMul * puddleBoost * crossoutBoost * inputMagnitude;
    const accel = grounded ? GROUND_ACCEL : AIR_ACCEL;
    const targetX = wish.x * maxSpeed;
    const targetZ = wish.z * maxSpeed;

    if (moving) {
      velocity.x = THREE.MathUtils.damp(velocity.x, targetX, accel, dt);
      velocity.z = THREE.MathUtils.damp(velocity.z, targetZ, accel, dt);
    } else if (grounded) {
      velocity.x = THREE.MathUtils.damp(velocity.x, 0, FRICTION, dt);
      velocity.z = THREE.MathUtils.damp(velocity.z, 0, FRICTION, dt);
    }
  }

  if (isSprinting) stamina = Math.max(0, stamina - 26 * upgradeState.sprintDrainMul * dt);
  else if (dashTimer <= 0 && !sliding) stamina = Math.min(100, stamina + (moving ? 14 : 22) * dt);

  velocity.y -= GRAVITY * dt;

  const colliderHeight = currentColliderHeight();
  const nextX = camera.position.x + velocity.x * dt;
  if (!collidesAt(nextX, camera.position.z, colliderHeight)) {
    camera.position.x = nextX;
  } else {
    const stepY = grounded && dashTimer <= 0 ? findStepHeightAt(nextX, camera.position.z, verticalOffset, colliderHeight) : null;
    if (stepY !== null) {
      verticalOffset = stepY;
      camera.position.x = nextX;
      grounded = true;
    } else {
      velocity.x = 0;
      if (sliding) slideSpeed *= .48;
      if (dashTimer > 0) dashTimer = 0;
    }
  }

  const nextZ = camera.position.z + velocity.z * dt;
  if (!collidesAt(camera.position.x, nextZ, colliderHeight)) {
    camera.position.z = nextZ;
  } else {
    const stepY = grounded && dashTimer <= 0 ? findStepHeightAt(camera.position.x, nextZ, verticalOffset, colliderHeight) : null;
    if (stepY !== null) {
      verticalOffset = stepY;
      camera.position.z = nextZ;
      grounded = true;
    } else {
      velocity.z = 0;
      if (sliding) slideSpeed *= .48;
      if (dashTimer > 0) dashTimer = 0;
    }
  }

  const stairSurface = specialWalkableSurfaceHeight(camera.position.x, camera.position.z);
  if (grounded && stairSurface !== null && stairSurface >= verticalOffset - .08 && stairSurface <= verticalOffset + STEP_HEIGHT + .08) {
    verticalOffset = stairSurface;
    velocity.y = Math.min(0, velocity.y);
  }

  const previousFeetY = verticalOffset;
  let nextFeetY = previousFeetY + velocity.y * dt;
  if (velocity.y > 0) {
    const ceiling = findCeilingHeight(camera.position.x, camera.position.z, previousFeetY, nextFeetY, colliderHeight);
    if (ceiling !== null) {
      nextFeetY = Math.max(0, ceiling - colliderHeight - SURFACE_EPSILON);
      velocity.y = 0;
    }
    verticalOffset = nextFeetY;
    grounded = false;
  } else {
    const landing = findLandingSurface(camera.position.x, camera.position.z, previousFeetY, nextFeetY, colliderHeight);
    if (landing !== null) {
      verticalOffset = landing;
      velocity.y = 0;
      grounded = true;
    } else if (nextFeetY <= 0) {
      verticalOffset = 0;
      velocity.y = 0;
      grounded = true;
    } else {
      verticalOffset = nextFeetY;
      grounded = false;
    }
  }

  const desiredEyeHeight = (crouching || sliding) ? CROUCH_EYE_HEIGHT : STAND_EYE_HEIGHT;
  currentEyeHeight = THREE.MathUtils.damp(currentEyeHeight, desiredEyeHeight, sliding ? 18 : 13, dt);

  const horizontalSpeed = Math.hypot(velocity.x, velocity.z);
  let bobY = 0;
  let bobX = 0;
  if (grounded && moving && horizontalSpeed > .35 && !sliding && dashTimer <= 0) {
    bobPhase += dt * (isSprinting ? 14 : (crouching ? 7.5 : 9.5));
    bobY = Math.sin(bobPhase * 2) * (isSprinting ? .045 : (crouching ? .012 : .025));
    bobX = Math.cos(bobPhase) * (isSprinting ? .025 : (crouching ? .008 : .013));
    if (now >= nextFootstepAt) {
      playFootstepSound(isSprinting, crouching);
      nextFootstepAt = now + (isSprinting ? 250 : (crouching ? 520 : 365));
    }
  }

  camera.position.y = THREE.MathUtils.damp(camera.position.y, currentEyeHeight + verticalOffset + bobY, 18, dt);

  const slideLean = sliding ? .065 : 0;
  const dashLean = dashTimer > 0 ? .085 : 0;
  viewModel.position.x = THREE.MathUtils.damp(viewModel.position.x, bobX * .55 + dashDirection.x * dashLean * .15, 10, dt);
  viewModel.position.y = THREE.MathUtils.damp(viewModel.position.y, -Math.abs(bobY) * .8 - (sliding ? .075 : (crouching ? .035 : 0)), 10, dt);
  viewModel.rotation.z = THREE.MathUtils.damp(viewModel.rotation.z, -bobX * .28 - slideLean - dashLean * dashDirection.x, 10, dt);
  viewModel.rotation.x = THREE.MathUtils.damp(viewModel.rotation.x, -velocity.y * .006 + (sliding ? .025 : 0), 8, dt);

  impactFovKick = THREE.MathUtils.damp(impactFovKick, 0, 10, dt);
  const w = currentWeapon();
  const movementFov = dashTimer > 0 ? userBaseFov + 6 : (sliding ? userBaseFov + 3 : (isSprinting ? userBaseFov + 2 : userBaseFov));
  const baseFov = isAiming ? (w.adsFov || 58) : movementFov;
  const targetFov = baseFov + (isAiming ? impactFovKick * .28 : impactFovKick);
  if (Math.abs(camera.fov - targetFov) > .01) {
    camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 12, dt);
    camera.updateProjectionMatrix();
  }

  if (isAiming) movementNoteEl.textContent = currentWeaponId === 'rifle' ? 'RULER OPTIC // SCOPED' : 'ADS // STEADY';
  else if (dashTimer > 0) movementNoteEl.textContent = 'DASHING';
  else if (sliding) movementNoteEl.textContent = 'SLIDING';
  else if (crouching) movementNoteEl.textContent = 'CROUCHED';
  else movementNoteEl.textContent = '';
  movementNoteEl.classList.toggle('active', sliding || crouching || dashTimer > 0 || isAiming);
  movementNoteEl.classList.toggle('aiming', isAiming);

  staminaFill.style.transform = `scaleX(${stamina / 100})`;
  staminaValue.textContent = Math.round(stamina);
  coordsEl.textContent = `X ${camera.position.x.toFixed(1)} // Z ${camera.position.z.toFixed(1)}`;
}


function updateAimState(now) {
  const canAim = controlSessionActive() && playerHealth > 0 && !isReloading && !sliding && dashTimer <= 0 && roundState !== 'boot' && !currentWeapon().melee && !storyInputLocked;

  if (IS_TOUCH_DEVICE) {
    // Mobile gets a dedicated AIM toggle and a separate RELOAD button. Trying to
    // distinguish tap-vs-hold on the same thumb control made the first touch build
    // unreliable and needlessly hostile to actual humans.
    if (!canAim) mobileAimActive = false;
    isAiming = mobileAimActive && canAim;
  } else {
    if (rightMouseDown && canAim && now - rightMouseDownAt >= AIM_HOLD_MS) {
      if (!isAiming) {
        isAiming = true;
        rightMouseBecameAim = true;
      }
    } else if (!rightMouseDown || !canAim) {
      isAiming = false;
    }
  }

  mobileAimBtn?.classList.toggle('pressed', IS_TOUCH_DEVICE && isAiming);
  document.body.classList.toggle('aiming', isAiming);
  const scoped = isAiming && currentWeaponId === 'rifle';
  document.body.classList.toggle('scoped', scoped);
  scopeOverlayEl.classList.toggle('visible', scoped);
}


// ---------- Mobile touch controls ----------
// Mobile input is intentionally routed through ONE touch system. The previous
// implementation let FIRE, the action cluster and the look surface compete for
// pointer capture. That could leave a stale pointer owner after fullscreen /
// orientation transitions and make controls appear "dead" until the browser
// eventually cancelled that pointer. Each thumb now has one job:
//   left stick -> movement, blank gameplay screen -> look, buttons -> actions.
function mobileHaptic(ms = 8) {
  try { navigator.vibrate?.(ms); } catch {}
}

function updateJoystickFromPoint(clientX, clientY) {
  if (!mobileJoystickEl || !mobileJoystickKnobEl) return;
  const rect = mobileJoystickEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const maxRadius = Math.max(22, Math.min(rect.width, rect.height) * .34);
  let dx = clientX - cx;
  let dy = clientY - cy;
  const dist = Math.hypot(dx, dy);
  const dirX = dist > .001 ? dx / dist : 0;
  const dirY = dist > .001 ? dy / dist : 0;
  const visualDist = Math.min(dist, maxRadius);
  const rawMagnitude = THREE.MathUtils.clamp(dist / maxRadius, 0, 1);
  const DEADZONE = .10;
  const magnitude = rawMagnitude <= DEADZONE ? 0 : (rawMagnitude - DEADZONE) / (1 - DEADZONE);

  mobileMoveX = dirX * magnitude;
  mobileMoveY = -dirY * magnitude;
  mobileSprintHeld = magnitude > .92 && mobileMoveY > .74 && Math.abs(mobileMoveX) < .82;
  mobileJoystickKnobEl.style.transform = `translate(calc(-50% + ${dirX * visualDist}px), calc(-50% + ${dirY * visualDist}px))`;
  mobileJoystickEl.classList.toggle('sprinting', mobileSprintHeld);
}

function resetMobileJoystick() {
  mobileJoystickPointer = null;
  mobileMoveX = 0;
  mobileMoveY = 0;
  mobileSprintHeld = false;
  mobileJoystickKnobEl?.style.setProperty('transform', 'translate(-50%, -50%)');
  mobileJoystickEl?.classList.remove('sprinting', 'active');
}

function beginMobileLook(pointerId, clientX, clientY) {
  if (!mobileSessionActive || storyInputLocked || mobileLookPointer !== null) return false;
  mobileLookPointer = pointerId;
  document.body.classList.add('mobile-look-used');
  mobileLookLastX = clientX;
  mobileLookLastY = clientY;
  return true;
}

const mobileLookEuler = new THREE.Euler(0, 0, 0, 'YXZ');
function applyMobileLookDelta(dx, dy) {
  if (!mobileSessionActive || storyInputLocked || storyDialogueBlocking || upgradeChoosing) return;
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;

  const sensitivity = Number(sensitivitySetting?.value || .78);
  const scale = .00305 * (sensitivity / .78);

  // Work from the camera quaternion exactly like PointerLockControls does.
  // This avoids camera.rotation and PointerLockControls maintaining competing
  // Euler state on mobile.
  mobileLookEuler.setFromQuaternion(camera.quaternion);
  mobileLookEuler.y -= dx * scale;
  mobileLookEuler.x -= dy * scale;
  mobileLookEuler.x = THREE.MathUtils.clamp(
    mobileLookEuler.x,
    -Math.PI / 2 + .15,
    Math.PI / 2 - .15
  );
  camera.quaternion.setFromEuler(mobileLookEuler);

  weaponSwayX = THREE.MathUtils.clamp(weaponSwayX + dx * .00015, -.022, .022);
  weaponSwayY = THREE.MathUtils.clamp(weaponSwayY + dy * .00013, -.018, .018);
}

function moveMobileLook(pointerId, clientX, clientY) {
  if (pointerId !== mobileLookPointer || !mobileSessionActive || storyInputLocked) return;
  const dx = clientX - mobileLookLastX;
  const dy = clientY - mobileLookLastY;
  mobileLookLastX = clientX;
  mobileLookLastY = clientY;
  // Ignore enormous discontinuities created by orientation/fullscreen viewport jumps.
  if (Math.abs(dx) > innerWidth * .45 || Math.abs(dy) > innerHeight * .45) return;
  applyMobileLookDelta(dx, dy);
}

function endMobileLook(pointerId) {
  if (pointerId !== mobileLookPointer) return;
  mobileLookPointer = null;
}

function updateMobileLook() {
  // Look rotation is applied directly from touchmove/pointermove.
}

function mobileGameplayInputAllowed() {
  return IS_TOUCH_DEVICE && mobileSessionActive && !storyInputLocked && !storyDialogueBlocking && !upgradeChoosing;
}

function handleMobileCrouchAction() {
  const horizontalSpeed = Math.hypot(velocity.x, velocity.z);
  const wantsSlide = mobileSprintHeld || horizontalSpeed > 5.8;
  if (wantsSlide && grounded && !sliding) {
    mobileCrouchLatched = false;
    mobileCrouchHeld = true;
    tryStartSlide();
    setTimeout(() => {
      if (!mobileCrouchLatched) mobileCrouchHeld = false;
    }, 130);
    return;
  }
  mobileCrouchLatched = !mobileCrouchLatched;
  mobileCrouchHeld = mobileCrouchLatched;
  mobileCrouchBtn?.classList.toggle('latched', mobileCrouchLatched);
}

function cycleMobileWeapon() {
  const available = Object.entries(WEAPON_PROFILES)
    .filter(([id]) => unlockedWeapons.has(id))
    .sort((a,b) => a[1].slot - b[1].slot);
  if (!available.length) return;
  const currentIndex = available.findIndex(([id]) => id === currentWeaponId);
  const next = available[(currentIndex + 1 + available.length) % available.length];
  if (next) switchWeaponBySlot(next[1].slot);
}

function flashMobileButton(button, latched = false) {
  if (!button) return;
  button.classList.add('pressed');
  clearTimeout(button.__inkbreakPressTimer);
  if (!latched) button.__inkbreakPressTimer = setTimeout(() => button.classList.remove('pressed'), 90);
}

if (IS_TOUCH_DEVICE) {
  const menuFootnote = document.querySelector('#main-menu-panel .footnote');
  if (menuFootnote) menuFootnote.textContent = 'ARENA: LIVING PAGE · STORY: THE BORROWED LINE · MOBILE TOUCH BUILD';
  const sensitivityLabel = sensitivitySetting?.closest('.setting-row')?.querySelector('b');
  if (sensitivityLabel) sensitivityLabel.textContent = 'LOOK SENSITIVITY';
  const controlNote = document.querySelector('#controls-menu-panel .menu-note');
  if (controlNote) controlNote.textContent = 'Mobile: left stick moves. Drag anywhere on the unobstructed game screen to look. FIRE shoots. AIM toggles ADS. RELOAD, JUMP, CROUCH/SLIDE, DASH and WEAPON are separate buttons.';
  const controlCells = [...document.querySelectorAll('#controls-menu-panel .instruction-grid > div')];
  const touchHelp = [
    ['LEFT STICK','move · full up = sprint'], ['GAME SCREEN','drag to look'], ['FIRE','hold to shoot'],
    ['AIM','toggle ADS'], ['RELOAD','reload weapon'], ['CROUCH','tap crouch · at speed slide'],
    ['DASH','directional burst'], ['JUMP','jump · slide jump'], ['WEAPON','cycle unlocked guns']
  ];
  controlCells.forEach((cell, i) => {
    if (touchHelp[i]) cell.innerHTML = `<b>${touchHelp[i][0]}</b><span>${touchHelp[i][1]}</span>`;
  });
  const scopeNote = document.querySelector('.scope-note');
  const adsNote = document.querySelector('.ads-note');
  if (scopeNote) scopeNote.textContent = 'RULER OPTIC // TAP AIM';
  if (adsNote) adsNote.textContent = 'FOCUS SIGHT // TAP AIM';

  /*
   * MOBILE INPUT V5
   * ----------------
   * One central touch router owns the entire mobile game. We deliberately use
   * native Touch Events here because they are stable across iOS Safari, Android
   * Chrome and installed PWAs and, unlike the previous Pointer Capture setup,
   * cannot strand ownership on a hidden element after an orientation/UI change.
   *
   * Every active finger is assigned ONE role on touchstart and keeps that role
   * until touchend/touchcancel: joystick, look, fire, or action.
   */
  const mobileTouches = new Map();
  let joystickTouchId = null;
  let lookTouchId = null;
  let fireTouchId = null;

  renderer.domElement.style.touchAction = 'none';
  renderer.domElement.style.webkitUserSelect = 'none';

  function pointInsideElement(x, y, el, pad = 0) {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad;
  }

  const mobileActionButtons = [
    mobileFireBtn, mobileAimBtn, mobileReloadBtn, mobileJumpBtn,
    mobileCrouchBtn, mobileDashBtn, mobileWeaponBtn, mobileUseBtn
  ].filter(Boolean);

  function actionButtonAt(x, y) {
    // Primary combat buttons get priority where transformed visual circles overlap.
    const priority = [mobileFireBtn, mobileAimBtn, mobileJumpBtn, mobileCrouchBtn, mobileDashBtn, mobileReloadBtn, mobileWeaponBtn, mobileUseBtn];
    return priority.find(btn => btn && getComputedStyle(btn).display !== 'none' && pointInsideElement(x, y, btn, 2)) || null;
  }

  function isBlockingOverlayAt(x, y) {
    const overlays = [menu, orientationGateEl, storyDialogueScreenEl, upgradeScreenEl];
    return overlays.some(el => {
      if (!el) return false;
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0 || !el.classList.contains('visible') && el !== orientationGateEl) return false;
      return pointInsideElement(x, y, el);
    });
  }

  function setJoystickTouch(touch) {
    if (joystickTouchId !== null) return false;
    joystickTouchId = touch.identifier;
    mobileJoystickPointer = touch.identifier;
    mobileTouches.set(touch.identifier, { role: 'joystick' });
    mobileJoystickEl?.classList.add('active');
    updateJoystickFromPoint(touch.clientX, touch.clientY);
    mobileHaptic(4);
    return true;
  }

  function setLookTouch(touch) {
    if (lookTouchId !== null || !mobileGameplayInputAllowed()) return false;
    lookTouchId = touch.identifier;
    mobileTouches.set(touch.identifier, {
      role: 'look',
      x: touch.clientX,
      y: touch.clientY
    });
    beginMobileLook(touch.identifier, touch.clientX, touch.clientY);
    return true;
  }

  function setFireTouch(touch) {
    if (fireTouchId !== null || !mobileGameplayInputAllowed()) return false;
    fireTouchId = touch.identifier;
    mobileTouches.set(touch.identifier, { role: 'fire' });
    triggerHeld = true;
    triggerHoldStartedAt = performance.now();
    mobileFireBtn?.classList.add('pressed');
    fireTestShot();
    mobileHaptic(5);
    return true;
  }

  function runActionButton(button) {
    if (!button || !mobileSessionActive) return false;

    if (button === mobilePauseBtn) {
      pauseMobileGame();
      return true;
    }

    if (!mobileGameplayInputAllowed()) return false;

    if (button === mobileAimBtn) {
      if (currentWeapon().melee || isReloading || sliding || dashTimer > 0) return true;
      mobileAimActive = !mobileAimActive;
      isAiming = mobileAimActive;
      mobileAimBtn.classList.toggle('latched', mobileAimActive);
    } else if (button === mobileReloadBtn) {
      mobileAimActive = false;
      isAiming = false;
      mobileAimBtn?.classList.remove('latched');
      startReload();
    } else if (button === mobileJumpBtn) {
      tryJump();
    } else if (button === mobileCrouchBtn) {
      handleMobileCrouchAction();
    } else if (button === mobileDashBtn) {
      tryDash();
    } else if (button === mobileWeaponBtn) {
      cycleMobileWeapon();
    } else if (button === mobileUseBtn) {
      tryReadNearbyStoryNote?.();
    } else {
      return false;
    }

    if (button !== mobileCrouchBtn && button !== mobileAimBtn) flashMobileButton(button);
    mobileHaptic(5);
    return true;
  }


  function startTouch(touch) {
    if (!mobileSessionActive) return false;
    const x = touch.clientX;
    const y = touch.clientY;

    // Coordinate-based hit testing deliberately ignores DOM stacking. A HUD
    // element can sit visually above the canvas without ever stealing gameplay
    // input again.
    if (pointInsideElement(x, y, mobilePauseBtn, 4)) {
      mobileTouches.set(touch.identifier, { role: 'action' });
      return runActionButton(mobilePauseBtn);
    }

    if (!mobileGameplayInputAllowed()) return false;

    // Give the stick a small forgiving halo so the first thumb press works even
    // when it lands just outside the drawn circle.
    if (pointInsideElement(x, y, mobileJoystickEl, 14)) return setJoystickTouch(touch);

    const action = actionButtonAt(x, y);
    if (action === mobileFireBtn) return setFireTouch(touch);
    if (action) {
      mobileTouches.set(touch.identifier, { role: 'action' });
      return runActionButton(action);
    }

    // Everything else on the live game viewport is camera look. No canvas hit
    // test and no invisible look layer are involved.
    if (!isBlockingOverlayAt(x, y)) return setLookTouch(touch);
    return false;
  }

  function moveTouch(touch) {
    const state = mobileTouches.get(touch.identifier);
    if (!state || !mobileSessionActive) return false;

    if (state.role === 'joystick') {
      updateJoystickFromPoint(touch.clientX, touch.clientY);
      return true;
    }

    if (state.role === 'look') {
      const dx = touch.clientX - state.x;
      const dy = touch.clientY - state.y;
      state.x = touch.clientX;
      state.y = touch.clientY;
      mobileLookLastX = touch.clientX;
      mobileLookLastY = touch.clientY;
      if (Math.abs(dx) <= innerWidth * .45 && Math.abs(dy) <= innerHeight * .45) {
        applyMobileLookDelta(dx, dy);
      }
      return true;
    }

    return state.role === 'fire' || state.role === 'action';
  }

  function endTouch(touch) {
    const state = mobileTouches.get(touch.identifier);
    if (!state) return false;

    if (state.role === 'joystick' && touch.identifier === joystickTouchId) {
      joystickTouchId = null;
      resetMobileJoystick();
    } else if (state.role === 'look' && touch.identifier === lookTouchId) {
      lookTouchId = null;
      endMobileLook(touch.identifier);
    } else if (state.role === 'fire' && touch.identifier === fireTouchId) {
      fireTouchId = null;
      triggerHeld = false;
      triggerHoldStartedAt = 0;
      mobileFireBtn?.classList.remove('pressed');
    }

    mobileTouches.delete(touch.identifier);
    return true;
  }

  // Capture phase is intentional. HUD/container stacking can no longer stop the
  // game from seeing a touch first. We only prevent default browser gestures for
  // touches that belong to a running game.
  document.addEventListener('touchstart', (event) => {
    if (!mobileSessionActive) return;
    let handled = false;
    for (let i = 0; i < event.changedTouches.length; i++) {
      handled = startTouch(event.changedTouches.item(i)) || handled;
    }
    if (handled) event.preventDefault();
  }, { passive: false, capture: true });

  document.addEventListener('touchmove', (event) => {
    if (!mobileSessionActive) return;
    let handled = false;
    for (let i = 0; i < event.changedTouches.length; i++) {
      handled = moveTouch(event.changedTouches.item(i)) || handled;
    }
    if (handled) event.preventDefault();
  }, { passive: false, capture: true });

  const finishTouches = (event) => {
    let handled = false;
    for (let i = 0; i < event.changedTouches.length; i++) {
      handled = endTouch(event.changedTouches.item(i)) || handled;
    }
    if (handled) event.preventDefault();
  };
  document.addEventListener('touchend', finishTouches, { passive: false, capture: true });
  document.addEventListener('touchcancel', finishTouches, { passive: false, capture: true });

  // Pointer fallback for touch-capable desktop emulators/WebViews that expose a
  // coarse pointer but do not dispatch Touch Events. It is disabled on normal
  // phones to guarantee there is never a duplicate input path.
  const needsPointerFallback = !('ontouchstart' in window) && navigator.maxTouchPoints === 0;
  if (needsPointerFallback) {
    let fallbackRole = null;
    let fallbackLastX = 0;
    let fallbackLastY = 0;
    document.addEventListener('pointerdown', (event) => {
      if (!mobileSessionActive) return;
      const fake = { identifier: event.pointerId, clientX: event.clientX, clientY: event.clientY, target: event.target };
      if (startTouch(fake)) {
        fallbackRole = mobileTouches.get(event.pointerId)?.role || null;
        fallbackLastX = event.clientX;
        fallbackLastY = event.clientY;
        event.preventDefault();
      }
    }, { passive: false, capture: true });
    document.addEventListener('pointermove', (event) => {
      if (!mobileSessionActive || !fallbackRole) return;
      const fake = { identifier: event.pointerId, clientX: event.clientX, clientY: event.clientY, target: event.target };
      if (moveTouch(fake)) event.preventDefault();
      fallbackLastX = event.clientX;
      fallbackLastY = event.clientY;
    }, { passive: false, capture: true });
    const endFallback = (event) => {
      const fake = { identifier: event.pointerId, clientX: event.clientX, clientY: event.clientY, target: event.target };
      if (endTouch(fake)) event.preventDefault();
      fallbackRole = null;
    };
    document.addEventListener('pointerup', endFallback, { passive: false, capture: true });
    document.addEventListener('pointercancel', endFallback, { passive: false, capture: true });
  }

  mobileLandscapeBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    requestMobileLandscape();
  });

  function hardResetMobileTouches() {
    mobileTouches.clear();
    joystickTouchId = null;
    lookTouchId = null;
    fireTouchId = null;
    resetMobileJoystick();
    mobileLookPointer = null;
    triggerHeld = false;
    triggerHoldStartedAt = 0;
    mobileFireBtn?.classList.remove('pressed');
  }

  window.addEventListener('orientationchange', () => {
    hardResetMobileTouches();
    // Do NOT call clearMobileInputs here: that function also changes latched
    // crouch/ADS state and previously made orientation transitions look like dead
    // controls. Only active finger ownership is reset.
    setTimeout(() => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    }, 100);
  });

  window.addEventListener('blur', hardResetMobileTouches);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && mobileSessionActive) pauseMobileGame();
  });

  // Diagnostic hook for real-device testing from Safari/Chrome remote devtools.
  window.__INKBREAK_MOBILE_INPUT__ = () => ({
    active: mobileSessionActive,
    joystickTouchId,
    lookTouchId,
    fireTouchId,
    touchCount: mobileTouches.size,
    moveX: mobileMoveX,
    moveY: mobileMoveY,
    aiming: mobileAimActive,
    triggerHeld,
    storyInputLocked,
    storyDialogueBlocking,
    upgradeChoosing
  });
}

// ---------- Ink "test fire" feedback ----------
const raycaster = new THREE.Raycaster();
const hitDots = [];

let triggerHeld = false;

window.addEventListener('mousedown', (e) => {
  if (!controls.isLocked || IS_TOUCH_DEVICE || storyInputLocked) return;

  if (e.button === 0) {
    if (!triggerHeld) triggerHoldStartedAt = performance.now();
    triggerHeld = true;
    fireTestShot();
    return;
  }

  if (e.button === 2) {
    e.preventDefault();
    rightMouseDown = true;
    rightMouseDownAt = performance.now();
    rightMouseBecameAim = false;
  }
});

window.addEventListener('mouseup', (e) => {
  if (e.button === 0) { triggerHeld = false; triggerHoldStartedAt = 0; }
  if (e.button === 2) {
    const heldFor = performance.now() - rightMouseDownAt;
    rightMouseDown = false;
    if (!rightMouseBecameAim && heldFor < AIM_HOLD_MS + 45) startReload();
    isAiming = false;
  }
});

window.addEventListener('blur', () => { triggerHeld = false; rightMouseDown = false; isAiming = false; });
controls.addEventListener('unlock', () => { triggerHeld = false; rightMouseDown = false; isAiming = false; });

window.addEventListener('contextmenu', (e) => {
  if (controls.isLocked) e.preventDefault();
});

function performKnifeAttack(now, w) {
  lastShotAt = now;
  playGunSound('knife');
  recoilKick = Math.min(1.1, recoilKick + .38);
  recoilPitch -= .045;
  recoilYaw += (Math.random() < .5 ? -1 : 1) * .42;
  recoilRoll += .58;

  const liveEnemyMeshes = enemyHitMeshes.filter(mesh => {
    const enemy = mesh.userData.enemy;
    return enemy && enemy.alive && !enemy.dying && enemy.activeInRound && mesh.visible && enemy.group.visible;
  });
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const hits = raycaster.intersectObjects(liveEnemyMeshes, false)
    .filter(hit => hit.object.visible && hit.distance <= w.meleeRange);

  if (!hits.length) {
    showCombatMessage('KNIFE // AIR', 220);
    return;
  }

  const hit = hits[0];
  const enemy = hit.object.userData.enemy;
  const part = hit.object.userData.hitPart || 'body';
  const canCrossout = enemy.hp / Math.max(1, enemy.maxHp) <= .25 && enemy.type !== 'artist';
  if (canCrossout) {
    enemy.crossoutExecution = true;
    crossoutSpeedUntil = now + 1800;
    playerHealth = Math.min(playerMaxHealth, playerHealth + 10 + upgradeState.knifeHeal);
    stamina = Math.min(100, stamina + 20);
    refillUnlockedWeaponAmmo(.05);
    awardInk(15 + (upgradeState.knifeHeal > 0 ? 20 : 0), 'CROSSOUT');
    updateHealthHud();
    showCombatMessage('CROSSOUT // HEALTH + AMMO + SPEED', 760);
    spawnInkBurst(hit.point, 24, .72);
    damageEnemy(enemy, enemy.hp + 5, part, hit.point, raycaster.ray.direction);
    return;
  }
  const damage = (part === 'head' ? w.headDamage * upgradeState.headshotMul : w.bodyDamage) * upgradeState.damageMul;
  damageEnemy(enemy, damage, part, hit.point, raycaster.ray.direction);
  spawnInkBurst(hit.point, part === 'head' ? 12 : 8, .42);
}

function fireTestShot() {
  const now = performance.now();
  const w = currentWeapon();
  let interval = w.fireInterval / upgradeState.fireRateMul;
  if (currentWeaponId === 'smg' && upgradeState.smgRamp && triggerHeld && triggerHoldStartedAt) {
    const held = Math.min(2, (now - triggerHoldStartedAt) / 1000);
    interval /= (1 + held * .34);
  }
  if (isReloading || playerHealth <= 0 || (gameMode === 'arena' && roundState === 'boot') || storyInputLocked || now - lastShotAt < interval * 1000) return;
  if (w.melee) {
    performKnifeAttack(now, w);
    return;
  }
  if (ammoCurrent <= 0) {
    lastShotAt = now;
    recoilRoll += 0.012;
    recoilKick = Math.min(.3, recoilKick + .08);
    showCombatMessage('CLICK // EMPTY');
    return;
  }

  const wasLastRound = ammoCurrent === 1;
  lastShotAt = now;
  ammoCurrent -= 1;
  syncCurrentWeaponAmmo();
  updateAmmoHud();
  flashMuzzle();
  playGunSound(currentWeaponId);

  recoilKick = Math.min(1.35, recoilKick + w.recoil);
  recoilPitch = Math.max(-.14, recoilPitch - (w.pitch + Math.random() * w.pitch * .45));
  recoilYaw += (Math.random() - .5) * (.014 + w.recoil * .012);
  recoilRoll += (Math.random() - .5) * (.012 + w.recoil * .008);
  ejectCasing();

  const liveEnemyMeshes = enemyHitMeshes.filter(mesh => {
    const enemy = mesh.userData.enemy;
    return enemy && enemy.alive && !enemy.dying && enemy.activeInRound && mesh.visible && enemy.group.visible;
  });
  const targets = [...liveEnemyMeshes, ...sketchMeshes];

  const lowHealthBoost = upgradeState.lowHealthDamage && playerHealth / Math.max(1,playerMaxHealth) < .35 ? 1.30 : 1;
  const lastWordBoost = upgradeState.lastWord && wasLastRound ? 4 : 1;
  const baseRunMul = upgradeState.damageMul * lowHealthBoost * lastWordBoost;
  let hitAnyEnemy = false;
  const pellets = Math.max(1, w.pellets);
  for (let pellet = 0; pellet < pellets; pellet++) {
    const effectiveSpread = (isAiming ? w.spread * .22 : w.spread) * upgradeState.spreadMul;
    const spreadX = (Math.random() - .5) * effectiveSpread;
    const spreadY = (Math.random() - .5) * effectiveSpread;
    raycaster.setFromCamera(new THREE.Vector2(spreadX, spreadY), camera);
    const hits = raycaster.intersectObjects(targets, false).filter(hit => hit.object.visible);
    if (!hits.length) continue;

    // Ruler Rifle can punch through one extra hostile line.
    if (currentWeaponId === 'rifle' && upgradeState.riflePenetration) {
      const seen = new Set();
      let damaged = 0;
      for (const hit of hits) {
        const enemy = hit.object.userData.enemy;
        if (!enemy) {
          if (damageEnvironment(hit.object, w.bodyDamage * baseRunMul, hit.point)) break;
          if (damaged === 0) spawnWorldImpact(hit);
          break;
        }
        if (!enemy.alive || seen.has(enemy)) continue;
        seen.add(enemy); damaged++; hitAnyEnemy = true;
        const part = hit.object.userData.hitPart || 'body';
        const damage = (part === 'head' ? w.headDamage * upgradeState.headshotMul : w.bodyDamage) * baseRunMul * (damaged===2?.78:1);
        damageEnemy(enemy, damage, part, hit.point, raycaster.ray.direction);
        if (damaged >= 2) break;
      }
      continue;
    }

    const hit = hits[0];
    const enemy = hit.object.userData.enemy;
    if (enemy && enemy.alive && enemy.activeInRound) {
      hitAnyEnemy = true;
      const part = hit.object.userData.hitPart || 'body';
      const damage = (part === 'head' ? w.headDamage * upgradeState.headshotMul : w.bodyDamage) * baseRunMul;
      damageEnemy(enemy, damage, part, hit.point, raycaster.ray.direction);
      if (currentWeaponId === 'marker' && upgradeState.markerSplash) damageEnemiesInRadius(hit.point, 3.4, damage * .62, enemy, true);
    } else {
      const envHit = damageEnvironment(hit.object, w.bodyDamage * baseRunMul, hit.point);
      if (!envHit && currentWeaponId === 'shotgun' && upgradeState.shotgunRicochet) {
        const normal = hit.face?.normal?.clone().transformDirection(hit.object.matrixWorld);
        if (normal) {
          const reflected = raycaster.ray.direction.clone().reflect(normal).normalize();
          enemyRaycaster.set(hit.point.clone().addScaledVector(normal,.04), reflected);
          enemyRaycaster.far = 12;
          const bounceHits = enemyRaycaster.intersectObjects(liveEnemyMeshes,false).filter(h=>h.object.visible);
          if (bounceHits.length) {
            const bh=bounceHits[0], be=bh.object.userData.enemy;
            if(be?.alive){const bp=bh.object.userData.hitPart||'body';const bd=(bp==='head'?w.headDamage*upgradeState.headshotMul:w.bodyDamage)*baseRunMul*.55;damageEnemy(be,bd,bp,bh.point,reflected);hitAnyEnemy=true;}
          }
        }
      }
      if (!envHit && (pellets === 1 || pellet < 3)) spawnWorldImpact(hit);
      if (currentWeaponId === 'marker' && upgradeState.markerSplash) damageEnemiesInRadius(hit.point, 3.2, w.bodyDamage * baseRunMul * .45, null, true);
    }
  }

  if (currentWeaponId === 'marker' && !hitAnyEnemy) showCombatMessage('MARKER // HEAVY STROKE', 260);
}

function spawnWorldImpact(hit) {
  const dot = new THREE.Mesh(
    new THREE.CircleGeometry(.055, 9),
    new THREE.MeshBasicMaterial({ color: INK_DARK, transparent: true, opacity: .72, depthWrite: false, side: THREE.DoubleSide })
  );
  const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
  dot.position.copy(hit.point).addScaledVector(normal, .012);
  dot.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  scene.add(dot);
  hitDots.push(dot);
  if (hitDots.length > 70) scene.remove(hitDots.shift());
}

const inkParticles = [];
function spawnInkBurst(point, count = 6, spread = .32) {
  for (let i = 0; i < count; i++) {
    const r = .022 + Math.random() * .05;
    const dot = new THREE.Mesh(
      new THREE.CircleGeometry(r, 7),
      new THREE.MeshBasicMaterial({ color: INK_DARK, transparent: true, opacity: .78, side: THREE.DoubleSide, depthWrite: false })
    );
    dot.position.copy(point).add(new THREE.Vector3((Math.random()-.5)*.10, (Math.random()-.5)*.10, (Math.random()-.5)*.10));
    dot.lookAt(camera.position);
    scene.add(dot);
    inkParticles.push({
      mesh: dot,
      velocity: new THREE.Vector3((Math.random()-.5)*spread*4.2, Math.random()*spread*4.0 + .35, (Math.random()-.5)*spread*4.2),
      life: .42 + Math.random() * .42,
      maxLife: .84
    });
  }
}

function updateInkParticles(dt) {
  for (let i = inkParticles.length - 1; i >= 0; i--) {
    const p = inkParticles[i];
    p.life -= dt;
    p.velocity.y -= 3.8 * dt;
    p.mesh.position.addScaledVector(p.velocity, dt);
    p.mesh.lookAt(camera.position);
    p.mesh.material.opacity = Math.max(0, Math.min(.78, p.life / .35));
    if (p.life <= 0) {
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
      scene.remove(p.mesh);
      inkParticles.splice(i, 1);
    }
  }
}

function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min((now - lastTime) / 1000, 0.04);
  lastTime = now;
  updateAimState(now);
  updateMobileLook(dt);
  updateMovement(dt);
  updateRoundProgression(now);
  updateArenaObjective(now, dt);
  updateStoryMode(now, dt);
  updateDynamicStructures(now);
  updateInteractiveEnvironment(now, dt);
  updateStoryNotes();
  updateAwarenessIndicators(now);
  if (controlSessionActive() && triggerHeld) fireTestShot();
  updateEnemies(now, dt);
  updateDeathChunks(now, dt);
  updateDeathScribbles(now, dt);
  updateInkParticles(dt);
  updatePickups(now);
  updateWeaponAnimation(now, dt);
  updateShellCasings(dt);
  if (muzzleFlash.visible && now >= muzzleHideAt) muzzleFlash.visible = false;

  renderer.render(scene, camera);
}
requestAnimationFrame(animate);

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(devicePixelRatio, IS_TOUCH_DEVICE ? 1.4 : 1.75));
  renderer.setSize(innerWidth, innerHeight);
});
