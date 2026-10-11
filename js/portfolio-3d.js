import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const PROJECT_STOPS = [
  { id: '08', name: 'WEB 3D LIDAR', slug: 'tni-3d-tactical-scan-viewer' },
  { id: '06', name: 'WEB DEVOPS', slug: 'website-monitoring-platform' },
  { id: '05', name: 'MY KOPKAR', slug: 'kopkar-toyota' },
  { id: '01', name: 'SPENDORA', slug: 'spendora-finance-app' },
  { id: '02', name: 'NAIQ USER', slug: 'naiq-shuttle-app' },
  { id: '03', name: 'EVILLAGE', slug: 'evillage-smart-village' },
  { id: '04', name: 'ELKOPRA', slug: 'elkopra-financial-system' },
  { id: '07', name: 'NAIQ DRIVER', slug: 'naiq-shuttle-app' },
];

export function createPortfolio3D(root, { onComplete, onExit, onCaseStudy, onOpenDevSecOps } = {}) {
  const stage = root.querySelector('.portfolio-3d-stage');
  const canvasHost = root.querySelector('.portfolio-3d-canvas');
  const loaderEl = root.querySelector('[data-portfolio-loader]');
  const previous = root.querySelector('[data-portfolio-prev]');
  const next = root.querySelector('[data-portfolio-next]');
  const fullscreenBtn = root.querySelector('[data-portfolio-fullscreen]');
  const caseStudyBtn = root.querySelector('[data-portfolio-case-study]');
  const devSecOpsBtn = root.querySelector('[data-portfolio-devsecops]');
  const mobileMoveButtons = [...root.querySelectorAll('[data-mobile-move]')];
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;

  const loader = new GLTFLoader();
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#07111d');

  const camera = new THREE.PerspectiveCamera(48, 1, 0.08, 120);
  const renderer = new THREE.WebGLRenderer({ antialias: !isTouchDevice, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isTouchDevice ? 1.35 : 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.66;
  renderer.shadowMap.enabled = !isTouchDevice;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  canvasHost.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-label', 'Galeri 3D interaktif');
  stage.tabIndex = 0;

  // Soft fill keeps the gallery readable while preserving detail in bright artwork.
  scene.add(new THREE.HemisphereLight(0xdceaff, 0x221a14, 0.42));
  scene.add(new THREE.AmbientLight(0xffffff, 0.22));
  const galleryFill = new THREE.DirectionalLight(0xffe6c8, 0.24);
  galleryFill.position.set(1.5, 5.8, 3.0);
  galleryFill.castShadow = !isTouchDevice;
  galleryFill.shadow.mapSize.set(1024, 1024);
  scene.add(galleryFill);

  const up = new THREE.Vector3(0, 1, 0);
  const keys = new Set();
  const targets = [];
  const TRANSITION_DURATION = 650;
  const NORMAL_SETTLE_DELAY = 280;
  const BOUNDARY_SETTLE_DELAY = 1200;
  const cameraGoal = { position: new THREE.Vector3(), lookAt: new THREE.Vector3(), quaternion: new THREE.Quaternion() };
  const transition = {
    active: false, startedAt: 0, duration: TRANSITION_DURATION,
    fromPosition: new THREE.Vector3(), fromQuaternion: new THREE.Quaternion(),
    path: null, finalLookAt: null, lookBackward: false, cameraDelay: 0,
    doorFrom: 0, doorTo: 0, doorStart: 0, doorEnd: 1, onFinish: null,
  };
  const doorPivots = [];
  let doorThreshold = null;
  let exteriorCameraPosition = null;
  let pendingEntryIndex = null;
  let doorProgress = 0;
  let selectedIndex = 0;
  let lastWheelAt = 0;
  let yaw = 0;
  let pitch = 0;
  let modelLoaded = false;
  let animationFrame = 0;
  let disposed = false;
  let lastTime = performance.now();
  let isPageScrolling = false;
  let wasInViewport = false;
  let museumExitActive = false;
  let arrivedAtTargetTime = 0;

  function resize() {
    if (disposed) return;
    const width = Math.max(1, canvasHost.clientWidth || window.innerWidth);
    const height = Math.max(1, canvasHost.clientHeight || window.innerHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function getProjectCameraPose(index) {
    const target = targets[index];
    if (!target) return null;
    const cameraPosition = target.center.clone().addScaledVector(target.normal, 2.9);
    cameraPosition.y += 0.08;
    const lookCam = new THREE.PerspectiveCamera();
    lookCam.position.copy(cameraPosition);
    lookCam.lookAt(target.center);
    return { position: cameraPosition, lookAt: target.center.clone(), quaternion: lookCam.quaternion.clone() };
  }

  function focusProject(index, animate = true) {
    const pose = getProjectCameraPose(index);
    if (!pose) return;
    selectedIndex = index;
    cameraGoal.position.copy(pose.position);
    cameraGoal.lookAt.copy(pose.lookAt);
    cameraGoal.quaternion.copy(pose.quaternion);

    if (!animate || !modelLoaded) {
      camera.position.copy(cameraGoal.position);
      camera.quaternion.copy(cameraGoal.quaternion);
      const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
      yaw = euler.y;
      pitch = euler.x;
      transition.active = false;
      arrivedAtTargetTime = performance.now();
      return;
    }

    transition.fromPosition.copy(camera.position);
    transition.fromQuaternion.copy(camera.quaternion);
    transition.path = null;
    transition.onFinish = null;
    transition.startedAt = performance.now();
    transition.duration = TRANSITION_DURATION;
    transition.active = true;
    arrivedAtTargetTime = performance.now() + transition.duration;
  }

  function setDoorProgress(progress) {
    doorProgress = THREE.MathUtils.clamp(progress, 0, 1);
    doorPivots.forEach(({ pivot, closedAngle }) => {
      pivot.rotation.y = closedAngle * (1 - doorProgress);
    });
  }

  function startCameraRoute({ points, finalLookAt, duration, doorFrom, doorTo, cameraDelay = 0, doorStart = 0, doorEnd = 1, lookBackward = false, onFinish }) {
    if (transition.active || points.length < 2) return;
    transition.path = new THREE.CatmullRomCurve3(points, false, 'centripetal');
    transition.finalLookAt = finalLookAt.clone();
    transition.lookBackward = lookBackward;
    transition.cameraDelay = cameraDelay;
    transition.doorFrom = doorFrom;
    transition.doorTo = doorTo;
    transition.doorStart = doorStart;
    transition.doorEnd = doorEnd;
    transition.onFinish = onFinish;
    transition.startedAt = performance.now();
    transition.duration = duration;
    transition.active = true;
    arrivedAtTargetTime = transition.startedAt + duration;
    const routeStartedAt = transition.startedAt;
    setTimeout(() => {
      if (!transition.active || transition.startedAt !== routeStartedAt || !transition.path) return;
      camera.position.copy(points[points.length - 1]);
      camera.lookAt(finalLookAt);
      setDoorProgress(doorTo);
      transition.active = false;
      transition.path = null;
      const finish = transition.onFinish;
      transition.onFinish = null;
      arrivedAtTargetTime = performance.now();
      isPageScrolling = false;
      finish?.();
    }, duration + 1200);
  }

  function startMuseumEntry(index) {
    if (transition.active || museumExitActive) return;
    if (!modelLoaded || !targets[index]) {
      pendingEntryIndex = index;
      if (modelLoaded) isPageScrolling = false;
      return;
    }
    pendingEntryIndex = null;
    selectedIndex = index;
    wasInViewport = true;
    if (!doorThreshold || !exteriorCameraPosition) {
      setDoorProgress(1);
      focusProject(index, false);
      isPageScrolling = false;
      return;
    }
    const pose = getProjectCameraPose(index);
    const insideDoor = doorThreshold.clone().add(new THREE.Vector3(0, 1.62, -1.9));
    const innerAisle = doorThreshold.clone().add(new THREE.Vector3(0, 1.62, -4.1));
    setDoorProgress(0);
    camera.position.copy(exteriorCameraPosition);
    camera.lookAt(doorThreshold.clone().add(new THREE.Vector3(0, 1.62, -1.4)));
    yaw = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ').y;
    pitch = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ').x;
    startCameraRoute({
      points: [exteriorCameraPosition.clone(), doorThreshold.clone().add(new THREE.Vector3(0, 1.62, 0.8)), insideDoor, innerAisle, pose.position],
      finalLookAt: pose.lookAt,
      duration: 2700,
      doorFrom: 0,
      doorTo: 1,
      cameraDelay: 0.08,
      doorStart: 0,
      doorEnd: 0.18,
      onFinish: () => { isPageScrolling = false; },
    });
  }

  function startMuseumExit(onFinish) {
    if (transition.active) return;
    museumExitActive = true;
    if (!modelLoaded || !doorThreshold) {
      onFinish?.();
      return;
    }
    const insideAisle = doorThreshold.clone().add(new THREE.Vector3(0, 1.62, -4.1));
    const insideDoor = doorThreshold.clone().add(new THREE.Vector3(0, 1.62, -1.4));
    const outsideDoor = doorThreshold.clone().add(new THREE.Vector3(0, 1.62, 1.0));
    const outside = exteriorCameraPosition || doorThreshold.clone().add(new THREE.Vector3(0, 1.62, 3.8));
    startCameraRoute({
      points: [camera.position.clone(), insideAisle, insideDoor, outsideDoor, outside],
      finalLookAt: doorThreshold.clone().add(new THREE.Vector3(0, 1.62, -0.8)),
      duration: 2900,
      doorFrom: 1,
      doorTo: 0,
      doorStart: 0.76,
      doorEnd: 1,
      cameraDelay: 0,
      lookBackward: true,
      onFinish,
    });
  }

  function moveSelection(direction) {
    if (targets.length === 0 || isPageScrolling) return;
    const now = performance.now();

    if (direction < 0 && selectedIndex === 0) {
      if (transition.active || now < arrivedAtTargetTime + BOUNDARY_SETTLE_DELAY) return;
      if (typeof onExit === 'function') {
        isPageScrolling = true;
        startMuseumExit(() => {
          wasInViewport = false;
          onExit();
          setTimeout(() => { isPageScrolling = false; }, 1000);
        });
      }
      return;
    }

    // Bottom boundary at the last artwork:
    if (direction > 0 && selectedIndex === targets.length - 1) {
      if (transition.active || now < arrivedAtTargetTime + BOUNDARY_SETTLE_DELAY) {
        return;
      }
      if (typeof onComplete === 'function') {
        isPageScrolling = true;
        startMuseumExit(() => {
          wasInViewport = false;
          onComplete();
          setTimeout(() => { isPageScrolling = false; }, 1000);
        });
      }
      return;
    }

    // Never interrupt an active transition
    if (transition.active) return;

    // Normal settling delay between artworks
    if (now < arrivedAtTargetTime + NORMAL_SETTLE_DELAY) return;

    const nextIndex = THREE.MathUtils.clamp(selectedIndex + direction, 0, targets.length - 1);
    if (nextIndex !== selectedIndex) focusProject(nextIndex);
  }

  function isStageInViewport() {
    if (!stage || disposed) return false;
    const rect = stage.getBoundingClientRect();
    const vh = window.innerHeight;
    return rect.top < vh && rect.bottom > 0;
  }

  function onWheel(event) {
    // Let the existing case-study overlay handle its own scrolling.
    if (document.querySelector('#case-study-modal.active')) return;
    if (isPageScrolling) {
      event.preventDefault();
      return;
    }
    if (Math.abs(event.deltaY) < 6) return;

    // Check if user is scrolling UP from #organisasi into the 3D gallery
    const orgEl = document.getElementById('organisasi');
    if (orgEl && event.deltaY < 0) {
      const orgRect = orgEl.getBoundingClientRect();
      if (orgRect.top >= -80 && orgRect.top <= window.innerHeight * 0.85) {
        event.preventDefault();
        isPageScrolling = true;
        stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const index = targets.length > 0 ? targets.length - 1 : PROJECT_STOPS.length - 1;
        pendingEntryIndex = index;
        if (targets.length > 0) startMuseumEntry(index);
        else setTimeout(() => { isPageScrolling = false; }, 850);
        return;
      }
    }

    const inView = isStageInViewport();
    const now = performance.now();

    // Handle initial entry into the 3D gallery from page scroll
    if (inView && !wasInViewport) {
      wasInViewport = true;
      const direction = event.deltaY > 0 ? 1 : -1;

      // When scrolling down into 3D: always land on project 1 (index 0) first!
      if (direction > 0) {
        event.preventDefault();
        isPageScrolling = true;
        stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        pendingEntryIndex = 0;
        if (modelLoaded) startMuseumEntry(0);
        lastWheelAt = now + 400;
        if (!modelLoaded) setTimeout(() => { isPageScrolling = false; }, 700);
        return;
      }

      // When scrolling up into 3D: land on last project first!
      if (direction < 0) {
        event.preventDefault();
        isPageScrolling = true;
        stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const index = targets.length > 0 ? targets.length - 1 : PROJECT_STOPS.length - 1;
        pendingEntryIndex = index;
        if (modelLoaded) startMuseumEntry(index);
        lastWheelAt = now + 400;
        if (!modelLoaded) setTimeout(() => { isPageScrolling = false; }, 700);
        return;
      }
    }

    if (!inView) {
      wasInViewport = false;
      return;
    }

    // At the first artwork, upward input returns to normal page scrolling so
    // the visitor can continue to the Experience section above the gallery.
    const direction = event.deltaY > 0 ? 1 : -1;
    if (direction < 0 && selectedIndex === 0) {
      if (transition.active || now < arrivedAtTargetTime + NORMAL_SETTLE_DELAY) {
        event.preventDefault();
        return;
      }
      if (typeof onExit === 'function') {
        event.preventDefault();
        isPageScrolling = true;
        startMuseumExit(() => {
          wasInViewport = false;
          onExit();
          setTimeout(() => { isPageScrolling = false; }, 1000);
        });
      }
      return;
    }

    // Inside the gallery, wheel input focuses one artwork at a time.
    event.preventDefault();

    // Self-correct misalignment: if stage is overshot or displaced (e.g. rect.top > 25), snap to stage top:
    const rect = stage.getBoundingClientRect();
    if (Math.abs(rect.top) > 25 && !isPageScrolling) {
      isPageScrolling = true;
      stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => { isPageScrolling = false; }, 700);
      return;
    }

    // While camera is in flight, absorb all scroll input so intermediate projects are never skipped
    if (transition.active) {
      return;
    }

    // At the last artwork, pause before continuing down to #organisasi.
    if (direction > 0 && selectedIndex === targets.length - 1) {
      if (now < arrivedAtTargetTime + BOUNDARY_SETTLE_DELAY) {
        return;
      }
      moveSelection(1);
      return;
    }

    // Cooldown between artworks to absorb mouse wheel / trackpad momentum
    if (now < arrivedAtTargetTime + NORMAL_SETTLE_DELAY) {
      return;
    }

    if (now - lastWheelAt < 280) return;
    lastWheelAt = now;

    moveSelection(direction);
  }

  const touchGesture = { active: false, startX: 0, startY: 0, lastX: 0, lastY: 0, axis: null };
  function onTouchStart(e) {
    if (e.target.closest?.('button')) return;
    if (e.touches.length !== 1) {
      touchGesture.active = false;
      return;
    }
    const touch = e.touches[0];
    touchGesture.active = true;
    touchGesture.axis = null;
    touchGesture.startX = touchGesture.lastX = touch.clientX;
    touchGesture.startY = touchGesture.lastY = touch.clientY;
  }

  function onTouchMove(e) {
    if (!touchGesture.active || e.touches.length !== 1) return;
    if (transition.active) {
      e.preventDefault();
      return;
    }
    const touch = e.touches[0];
    const dx = touch.clientX - touchGesture.startX;
    const dy = touch.clientY - touchGesture.startY;
    if (!touchGesture.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 8) {
      touchGesture.axis = Math.abs(dx) > Math.abs(dy) ? 'look' : 'project';
    }

    if (touchGesture.axis === 'look') {
      e.preventDefault();
      yaw -= (touch.clientX - touchGesture.lastX) * 0.0042;
      pitch = THREE.MathUtils.clamp(pitch - (touch.clientY - touchGesture.lastY) * 0.0036, -0.78, 0.78);
      camera.rotation.order = 'YXZ';
      camera.rotation.set(pitch, yaw, 0);
    } else if (touchGesture.axis === 'project') {
      const direction = dy < 0 ? 1 : -1;
      // Page boundaries are handled by the animated museum exit route.
      e.preventDefault();
    }

    touchGesture.lastX = touch.clientX;
    touchGesture.lastY = touch.clientY;
  }

  function onTouchEnd(e) {
    if (!touchGesture.active || e.changedTouches.length !== 1) return;
    const touchEnd = e.changedTouches[0];
    const diffY = touchGesture.startY - touchEnd.clientY;
    touchGesture.active = false;
    if (touchGesture.axis === 'project' && Math.abs(diffY) > 42) moveSelection(diffY > 0 ? 1 : -1);
  }

  function onKeyDown(event) {
    if (!isStageInViewport()) return;
    if (document.querySelector('#case-study-modal.active')) return;
    if (event.target.closest?.('button, a, input, textarea, select')) return;

    if (['ArrowRight', 'ArrowDown'].includes(event.code)) {
      event.preventDefault();
      moveSelection(1);
      return;
    }
    if (['ArrowLeft', 'ArrowUp'].includes(event.code)) {
      event.preventDefault();
      moveSelection(-1);
      return;
    }
    if (!['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) return;
    event.preventDefault();
    keys.add(event.code);
  }

  function onKeyUp(event) {
    keys.delete(event.code);
  }

  let isDragging = false;
  let dragLastX = 0;
  let dragLastY = 0;

  function onMouseDown(e) {
    if (e.button !== 0) return;
    isDragging = true;
    dragLastX = e.clientX;
    dragLastY = e.clientY;
  }

  function onMouseUp() {
    isDragging = false;
  }

  function onMouseMove(event) {
    if (transition.active) return;
    if (document.pointerLockElement === renderer.domElement) {
      yaw -= event.movementX * 0.0022;
      pitch = THREE.MathUtils.clamp(pitch - event.movementY * 0.0020, -0.78, 0.78);
      camera.rotation.order = 'YXZ';
      camera.rotation.set(pitch, yaw, 0);
    } else if (isDragging) {
      const deltaX = event.clientX - dragLastX;
      const deltaY = event.clientY - dragLastY;
      dragLastX = event.clientX;
      dragLastY = event.clientY;
      yaw -= deltaX * 0.0022;
      pitch = THREE.MathUtils.clamp(pitch - deltaY * 0.0020, -0.78, 0.78);
      camera.rotation.order = 'YXZ';
      camera.rotation.set(pitch, yaw, 0);
    }
  }

  function onCanvasClick() {
    stage.focus({ preventScroll: true });
    if (isTouchDevice) return;
    if (document.pointerLockElement !== renderer.domElement && renderer.domElement.requestPointerLock) {
      renderer.domElement.requestPointerLock();
    }
  }

  function onMobileMoveStart(event) {
    event.preventDefault();
    event.stopPropagation();
    const code = event.currentTarget.dataset.mobileMove;
    keys.add(code);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function onMobileMoveEnd(event) {
    keys.delete(event.currentTarget.dataset.mobileMove);
  }

  function onNextClick(e) {
    e.stopPropagation();
    moveSelection(1);
  }

  function onPreviousClick(e) {
    e.stopPropagation();
    moveSelection(-1);
  }

  function onCaseStudyClick(event) {
    event.stopPropagation();
    const project = PROJECT_STOPS[selectedIndex];
    if (!project?.slug || transition.active) return;
    if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
    onCaseStudy?.(project.slug);
  }

  function onDevSecOpsClick(event) {
    event.stopPropagation();
    if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
    onOpenDevSecOps?.();
  }

  function toggleFullscreen(e) {
    if (e) e.stopPropagation();
    if (!document.fullscreenElement) {
      if (stage.requestFullscreen) {
        stage.requestFullscreen();
      } else if (stage.webkitRequestFullscreen) {
        stage.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  function onFullscreenChange() {
    const isFs = !!document.fullscreenElement;
    if (fullscreenBtn) {
      const icon = fullscreenBtn.querySelector('i');
      if (icon) {
        icon.className = isFs ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line';
      }
    }
    setTimeout(resize, 100);
  }

  function tick(now) {
    if (disposed) return;
    animationFrame = requestAnimationFrame(tick);
    const delta = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (transition.active) {
      const t = THREE.MathUtils.clamp((now - transition.startedAt) / transition.duration, 0, 1);
      const eased = t * t * (3 - 2 * t);
      if (transition.path) {
        const routeT = THREE.MathUtils.clamp((eased - transition.cameraDelay) / (1 - transition.cameraDelay), 0, 1);
        camera.position.copy(transition.path.getPoint(routeT));
        const tangent = transition.path.getTangent(routeT).normalize();
        if (transition.lookBackward) tangent.negate();
        const lookPoint = camera.position.clone().addScaledVector(tangent, 3.2);
        const finalBlend = THREE.MathUtils.smoothstep(routeT, 0.7, 1);
        lookPoint.lerp(transition.finalLookAt, finalBlend);
        camera.lookAt(lookPoint);

        const doorT = THREE.MathUtils.clamp((t - transition.doorStart) / Math.max(0.001, transition.doorEnd - transition.doorStart), 0, 1);
        const doorEase = doorT * doorT * (3 - 2 * doorT);
        setDoorProgress(THREE.MathUtils.lerp(transition.doorFrom, transition.doorTo, doorEase));
      } else {
        camera.position.lerpVectors(transition.fromPosition, cameraGoal.position, eased);
        camera.quaternion.slerpQuaternions(transition.fromQuaternion, cameraGoal.quaternion, eased);
      }
      if (t >= 1) {
        transition.active = false;
        const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
        yaw = euler.y;
        pitch = euler.x;
        arrivedAtTargetTime = now;
        const onFinish = transition.onFinish;
        transition.path = null;
        transition.onFinish = null;
        if (!onFinish) isPageScrolling = false;
        onFinish?.();
      }
    } else if (keys.size > 0) {
      const direction = new THREE.Vector3();
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      forward.y = 0;
      forward.normalize();
      const right = new THREE.Vector3().crossVectors(forward, up).normalize();
      if (keys.has('KeyW')) direction.add(forward);
      if (keys.has('KeyS')) direction.sub(forward);
      if (keys.has('KeyD')) direction.add(right);
      if (keys.has('KeyA')) direction.sub(right);
      if (direction.lengthSq() > 0) {
        direction.normalize().multiplyScalar(3.1 * delta);
        camera.position.add(direction);
        // Keep the walk inside the gallery walls and at eye level
        camera.position.x = THREE.MathUtils.clamp(camera.position.x, -7.55, 7.55);
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, -6.75, 6.75);
        camera.position.y = THREE.MathUtils.clamp(camera.position.y, 1.45, 4.9);
      }
    }

    renderer.render(scene, camera);
  }

  function findGalleryObject(gallery, nameFragment) {
    let match = null;
    gallery.traverse((object) => {
      if (!match && object.name.includes(nameFragment)) match = object;
    });
    return match;
  }

  function setupMuseumEntrance(gallery) {
    const threshold = findGalleryObject(gallery, 'Stone door threshold');
    if (threshold) {
      threshold.updateWorldMatrix(true, false);
      doorThreshold = threshold.getWorldPosition(new THREE.Vector3());
      exteriorCameraPosition = doorThreshold.clone().add(new THREE.Vector3(0, 1.62, 3.8));
    }

    ['left', 'right'].forEach((side) => {
      const door = findGalleryObject(gallery, `Open walnut door | ${side}`);
      const hinge = findGalleryObject(gallery, `Door hinge | ${side} | 1.35`);
      if (!door || !hinge) return;

      door.updateWorldMatrix(true, false);
      hinge.updateWorldMatrix(true, false);
      const worldPosition = door.getWorldPosition(new THREE.Vector3());
      const worldQuaternion = door.getWorldQuaternion(new THREE.Quaternion());
      const worldScale = door.getWorldScale(new THREE.Vector3());
      const hingePosition = hinge.getWorldPosition(new THREE.Vector3());
      const hingeToDoor = worldPosition.clone().sub(hingePosition);
      const currentAngle = Math.atan2(hingeToDoor.z, hingeToDoor.x);
      const closedDirection = side === 'left' ? 0 : Math.PI;
      let closedAngle = currentAngle - closedDirection;
      while (closedAngle > Math.PI) closedAngle -= Math.PI * 2;
      while (closedAngle < -Math.PI) closedAngle += Math.PI * 2;

      door.parent?.remove(door);
      const pivot = new THREE.Group();
      pivot.name = `Museum door pivot | ${side}`;
      pivot.position.copy(hingePosition);
      scene.add(pivot);
      pivot.add(door);
      door.position.copy(worldPosition).sub(hingePosition);
      door.quaternion.copy(worldQuaternion);
      door.scale.copy(worldScale);
      doorPivots.push({ pivot, closedAngle });
    });

    setDoorProgress(0);
    if (exteriorCameraPosition && doorThreshold) {
      camera.position.copy(exteriorCameraPosition);
      camera.lookAt(doorThreshold.clone().add(new THREE.Vector3(0, 1.62, -1.4)));
      const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
      yaw = euler.y;
      pitch = euler.x;
    }
  }

  function onModelLoaded(gltf) {
    if (disposed) return;
    const gallery = gltf.scene;
    // Keep exported Blender lights restrained, while giving the six ceiling
    // fixtures enough output to visibly wash the gallery floor and artwork.
    gallery.traverse((object) => {
      if (!object.isLight) return;
      if (object.name.includes('Modern ceiling wash')) {
        // The exported spot direction can vary by renderer, so the web viewer
        // adds a broad, explicitly downward beam from each visible fixture.
        object.intensity = 0;
      } else {
        object.intensity = Math.min(object.intensity * 0.0048, 95);
      }
    });
    scene.add(gallery);
    gallery.updateMatrixWorld(true);
    setupMuseumEntrance(gallery);

    gallery.traverse((object) => {
      if (!object.isMesh || !object.name.includes('recessed graphite housing')) return;
      const position = object.getWorldPosition(new THREE.Vector3());
      const lamp = new THREE.SpotLight(0xffe7c7, 38, 10, Math.PI / 2.35, 0.9, 1.5);
      lamp.position.copy(position).add(new THREE.Vector3(0, -0.08, 0));
      lamp.target.position.copy(position).add(new THREE.Vector3(0, -5, 0));
      lamp.castShadow = false;
      lamp.name = `Web ceiling wash | ${object.name}`;
      lamp.target.name = `Web ceiling wash target | ${object.name}`;
      scene.add(lamp, lamp.target);
    });

    PROJECT_STOPS.forEach((project) => {
      const sanitizedName = THREE.PropertyBinding?.sanitizeNodeName
        ? THREE.PropertyBinding.sanitizeNodeName(`Portfolio print | ${project.id}`)
        : `Portfolio_print_|_${project.id}`;

      let print = gallery.getObjectByName(`Portfolio print | ${project.id}`)
        || gallery.getObjectByName(sanitizedName)
        || gallery.getObjectByName(`Portfolio_print_|_${project.id}`);

      if (!print) {
        gallery.traverse((child) => {
          if (!print && child.name && child.name.includes(project.id) && (child.name.includes('Portfolio') || child.name.includes('print'))) {
            print = child;
          }
        });
      }

      if (!print) return;
      const bounds = new THREE.Box3().setFromObject(print);
      const center = bounds.getCenter(new THREE.Vector3());

      // Use the actual geometry vertex normal to properly face each wall
      let normal = new THREE.Vector3(0, 0, 1);
      if (print.geometry?.attributes?.normal) {
        const arr = print.geometry.attributes.normal.array;
        normal.set(arr[0], arr[1], arr[2]);
        const normalMatrix = new THREE.Matrix3().getNormalMatrix(print.matrixWorld);
        normal.applyMatrix3(normalMatrix).normalize();
      } else {
        const normalMatrix = new THREE.Matrix3().getNormalMatrix(print.matrixWorld);
        normal.applyMatrix3(normalMatrix).normalize();
      }

      targets.push({ ...project, center, normal, object: print });
    });

    // glTF may omit Blender spotlights depending on export settings. Add a
    // warm, restrained spot at each actual artwork position so every wall is
    // visibly lit in the web viewer as well as in Blender.
    targets.forEach((target) => {
      const lamp = new THREE.SpotLight(0xffd9a6, 78, 8.5, Math.PI / 5.4, 0.78, 2);
      lamp.position.copy(target.center)
        .addScaledVector(target.normal, 2.25)
        .add(new THREE.Vector3(0, 1.35, 0));
      lamp.target.position.copy(target.center);
      lamp.castShadow = false;
      lamp.name = `Web artwork spotlight | ${target.id}`;
      lamp.target.name = `Web artwork spotlight target | ${target.id}`;
      scene.add(lamp, lamp.target);
    });

    if (loaderEl) {
      loaderEl.hidden = true;
    }

    if (targets.length === 0) {
      console.warn('Tidak ada titik karya yang ditemukan di model Blender.');
      return;
    }

    modelLoaded = true;
    const shouldEnter = pendingEntryIndex !== null || isStageInViewport();
    if (shouldEnter) startMuseumEntry(pendingEntryIndex ?? 0);
  }

  function onModelError(error) {
    console.error('Could not load the Blender portfolio gallery:', error);
    isPageScrolling = false;
    transition.active = false;
    if (loaderEl) loaderEl.hidden = true;
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvasHost);
  // Listen once at the window level. A stage listener here would receive the
  // same bubbling wheel event a second time and could reset the gallery index
  // while the page is leaving the first artwork.
  window.addEventListener('wheel', onWheel, { passive: false });
  stage.addEventListener('touchstart', onTouchStart, { passive: true });
  stage.addEventListener('touchmove', onTouchMove, { passive: false });
  stage.addEventListener('touchend', onTouchEnd, { passive: true });
  stage.addEventListener('touchcancel', onTouchEnd, { passive: true });
  canvasHost.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  canvasHost.addEventListener('click', onCanvasClick);
  canvasHost.addEventListener('dblclick', toggleFullscreen);

  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        wasInViewport = false;
        if (museumExitActive) museumExitActive = false;
        return;
      }

      stage.focus({ preventScroll: true });
      if (wasInViewport || museumExitActive || transition.active) return;

      // Catch trackpad, touch, and programmatic page movement as well as wheel events.
      // The side from which the section enters the viewport determines the first artwork.
      const enteringFromAbove = entry.boundingClientRect.top >= 0;
      const index = enteringFromAbove ? 0 : Math.max(0, targets.length - 1);
      wasInViewport = true;
      isPageScrolling = true;
      pendingEntryIndex = index;
      stage.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (modelLoaded) {
        startMuseumEntry(index);
      } else {
        // Model loading may take longer; onModelLoaded will start the pending route.
        setTimeout(() => {
          if (!modelLoaded && !transition.active) isPageScrolling = false;
        }, 2500);
      }
    });
  }, { threshold: [0, 0.4] });
  visibilityObserver.observe(stage);

  if (previous) previous.addEventListener('click', onPreviousClick);
  if (next) next.addEventListener('click', onNextClick);
  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
  if (caseStudyBtn) caseStudyBtn.addEventListener('click', onCaseStudyClick);
  if (devSecOpsBtn) devSecOpsBtn.addEventListener('click', onDevSecOpsClick);
  mobileMoveButtons.forEach((button) => {
    button.addEventListener('pointerdown', onMobileMoveStart);
    button.addEventListener('pointerup', onMobileMoveEnd);
    button.addEventListener('pointercancel', onMobileMoveEnd);
    button.addEventListener('lostpointercapture', onMobileMoveEnd);
  });

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  function onWindowBlur() { keys.clear(); isDragging = false; }
  function onPointerLockChange() {
    stage.classList.toggle('is-pointer-locked', document.pointerLockElement === renderer.domElement);
  }
  window.addEventListener('blur', onWindowBlur);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('pointerlockchange', onPointerLockChange);
  document.addEventListener('fullscreenchange', onFullscreenChange);

  resize();
  animationFrame = requestAnimationFrame(tick);
  loader.load('/asset/RIFKI_Portfolio_Museum.glb', onModelLoaded, undefined, onModelError);

  return () => {
    disposed = true;
    cancelAnimationFrame(animationFrame);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    window.removeEventListener('wheel', onWheel);
    stage.removeEventListener('touchstart', onTouchStart);
    stage.removeEventListener('touchmove', onTouchMove);
    stage.removeEventListener('touchend', onTouchEnd);
    stage.removeEventListener('touchcancel', onTouchEnd);
    canvasHost.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mouseup', onMouseUp);
    canvasHost.removeEventListener('click', onCanvasClick);
    canvasHost.removeEventListener('dblclick', toggleFullscreen);
    if (previous) previous.removeEventListener('click', onPreviousClick);
    if (next) next.removeEventListener('click', onNextClick);
    if (fullscreenBtn) fullscreenBtn.removeEventListener('click', toggleFullscreen);
    if (caseStudyBtn) caseStudyBtn.removeEventListener('click', onCaseStudyClick);
    if (devSecOpsBtn) devSecOpsBtn.removeEventListener('click', onDevSecOpsClick);
    mobileMoveButtons.forEach((button) => {
      button.removeEventListener('pointerdown', onMobileMoveStart);
      button.removeEventListener('pointerup', onMobileMoveEnd);
      button.removeEventListener('pointercancel', onMobileMoveEnd);
      button.removeEventListener('lostpointercapture', onMobileMoveEnd);
    });
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('blur', onWindowBlur);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('pointerlockchange', onPointerLockChange);
    document.removeEventListener('fullscreenchange', onFullscreenChange);
    if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
    renderer.dispose();
    renderer.domElement.remove();
    scene.traverse((object) => {
      if (!object.isMesh) return;
      object.geometry?.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        for (const value of Object.values(material || {})) {
          if (value?.isTexture) value.dispose();
        }
        material?.dispose();
      });
    });
  };
}
