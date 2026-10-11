import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const PROJECT_STOPS = [
  { id: '07', name: 'TNI 3D TERRAIN', slug: 'tni-3d-tactical-scan-viewer' },
  { id: '06', name: 'SPENDORA', slug: 'spendora-finance-app' },
  { id: '05', name: 'NAIQ DRIVER', slug: 'naiq-shuttle-app' },
  { id: '01', name: 'EVILLAGE', slug: 'evillage-smart-village' },
  { id: '02', name: 'ELKOPRA', slug: 'elkopra-financial-system' },
  { id: '03', name: 'MY KOPKAR', slug: 'kopkar-toyota' },
  { id: '04', name: 'NAIQ USER', slug: 'naiq-shuttle-app' },
];

export function createPortfolio3D(root, { onComplete, onCaseStudy, onOpenDevSecOps } = {}) {
  const stage = root.querySelector('.portfolio-3d-stage');
  const canvasHost = root.querySelector('.portfolio-3d-canvas');
  const loaderEl = root.querySelector('[data-portfolio-loader]');
  const previous = root.querySelector('[data-portfolio-prev]');
  const next = root.querySelector('[data-portfolio-next]');
  const fullscreenBtn = root.querySelector('[data-portfolio-fullscreen]');
  const caseStudyBtn = root.querySelector('[data-portfolio-case-study]');
  const devSecOpsBtn = root.querySelector('[data-portfolio-devsecops]');

  const loader = new GLTFLoader();
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#07111d');

  const camera = new THREE.PerspectiveCamera(48, 1, 0.08, 120);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.72;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  canvasHost.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-label', 'Galeri 3D interaktif');
  stage.tabIndex = 0;

  // Soft fill keeps the gallery readable while preserving detail in bright artwork.
  scene.add(new THREE.HemisphereLight(0xdceaff, 0x221a14, 0.3));
  scene.add(new THREE.AmbientLight(0xffffff, 0.18));
  const galleryFill = new THREE.DirectionalLight(0xffe6c8, 0.2);
  galleryFill.position.set(1.5, 5.8, 3.0);
  galleryFill.castShadow = true;
  galleryFill.shadow.mapSize.set(1024, 1024);
  scene.add(galleryFill);

  const up = new THREE.Vector3(0, 1, 0);
  const keys = new Set();
  const targets = [];
  const TRANSITION_DURATION = 650;
  const NORMAL_SETTLE_DELAY = 280;
  const BOUNDARY_SETTLE_DELAY = 1200;
  const cameraGoal = { position: new THREE.Vector3(), lookAt: new THREE.Vector3(), quaternion: new THREE.Quaternion() };
  const transition = { active: false, startedAt: 0, duration: TRANSITION_DURATION, fromPosition: new THREE.Vector3(), fromQuaternion: new THREE.Quaternion() };
  let selectedIndex = 0;
  let lastWheelAt = 0;
  let yaw = 0;
  let pitch = 0;
  let modelLoaded = false;
  let animationFrame = 0;
  let disposed = false;
  let lastTime = performance.now();
  let isPageScrolling = false;
  let lastScrollY = window.scrollY;
  let wasInViewport = false;
  let arrivedAtTargetTime = 0;

  function resize() {
    if (disposed) return;
    const width = Math.max(1, canvasHost.clientWidth || window.innerWidth);
    const height = Math.max(1, canvasHost.clientHeight || window.innerHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function focusProject(index, animate = true) {
    if (!targets[index]) return;
    selectedIndex = index;
    const target = targets[index];
    const cameraPosition = target.center.clone().addScaledVector(target.normal, 2.9);
    cameraPosition.y += 0.08;
    cameraGoal.position.copy(cameraPosition);
    cameraGoal.lookAt.copy(target.center);

    const lookCam = new THREE.PerspectiveCamera();
    lookCam.position.copy(cameraPosition);
    lookCam.lookAt(target.center);
    cameraGoal.quaternion.copy(lookCam.quaternion);

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
    transition.startedAt = performance.now();
    transition.duration = TRANSITION_DURATION;
    transition.active = true;
    arrivedAtTargetTime = performance.now() + transition.duration;
  }

  function moveSelection(direction) {
    if (targets.length === 0 || isPageScrolling) return;
    const now = performance.now();

    // Bottom boundary (Portfolio 7):
    if (direction > 0 && selectedIndex === targets.length - 1) {
      if (transition.active || now < arrivedAtTargetTime + BOUNDARY_SETTLE_DELAY) {
        return;
      }
      if (typeof onComplete === 'function') {
        isPageScrolling = true;
        onComplete();
        setTimeout(() => { isPageScrolling = false; }, 1000);
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
    return rect.top < vh * 0.65 && rect.bottom > vh * 0.35;
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
        if (targets.length > 0) {
          focusProject(targets.length - 1, false);
          arrivedAtTargetTime = performance.now();
        }
        setTimeout(() => { isPageScrolling = false; }, 850);
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
        focusProject(0, false);
        arrivedAtTargetTime = now;
        lastWheelAt = now + 400;
        setTimeout(() => { isPageScrolling = false; }, 700);
        return;
      }

      // When scrolling up into 3D: land on last project first!
      if (direction < 0) {
        event.preventDefault();
        isPageScrolling = true;
        stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (targets.length > 0) focusProject(targets.length - 1, false);
        arrivedAtTargetTime = now;
        lastWheelAt = now + 400;
        setTimeout(() => { isPageScrolling = false; }, 700);
        return;
      }
    }

    if (!inView) {
      wasInViewport = false;
      return;
    }

    // At the first artwork, let upward wheel input return to the page so the
    // portfolio tabs remain easy to reach. The DevSecOps shortcut is also in-view.
    const direction = event.deltaY > 0 ? 1 : -1;
    if (direction < 0 && selectedIndex === 0) {
      if (transition.active || now < arrivedAtTargetTime + NORMAL_SETTLE_DELAY) {
        event.preventDefault();
        return;
      }
      wasInViewport = false;
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

    // Bottom boundary (Portfolio 7): must stay still ("diam dulu") before exiting down to #organisasi
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

  function onWindowScroll() {
    const currentScrollY = window.scrollY;
    const isScrollingUp = currentScrollY < lastScrollY;
    lastScrollY = currentScrollY;

    if (!modelLoaded || targets.length === 0 || isPageScrolling) return;

    const rect = stage.getBoundingClientRect();
    // When scrolling UP from below into the stage, prepare from the last project
    if (isScrollingUp && rect.bottom > 100 && rect.bottom < window.innerHeight + 200 && rect.top < 0) {
      if (selectedIndex === 0) {
        selectedIndex = targets.length - 1;
        focusProject(selectedIndex, false);
      }
    }
  }

  let touchStartY = 0;
  function onTouchStart(e) {
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
    }
  }

  function onTouchEnd(e) {
    if (e.changedTouches.length === 1) {
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;
      if (Math.abs(diffY) > 35) {
        moveSelection(diffY > 0 ? 1 : -1);
      }
    }
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
    if (document.pointerLockElement !== renderer.domElement && renderer.domElement.requestPointerLock) {
      renderer.domElement.requestPointerLock();
    }
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
      camera.position.lerpVectors(transition.fromPosition, cameraGoal.position, eased);
      camera.quaternion.slerpQuaternions(transition.fromQuaternion, cameraGoal.quaternion, eased);
      if (t >= 1) {
        transition.active = false;
        const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
        yaw = euler.y;
        pitch = euler.x;
        arrivedAtTargetTime = now;
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

  function onModelLoaded(gltf) {
    if (disposed) return;
    const gallery = gltf.scene;
    // Blender's spotlights export at roughly 24,000 cd each. A small cap keeps
    // their pools visible without bleaching the artwork textures in WebGL.
    gallery.traverse((object) => {
      if (object.isLight) object.intensity = Math.min(object.intensity * 0.006, 120);
    });
    // DevSecOps is shown in its dedicated 2D view. Reuse the seventh frame for
    // the web-based TNI project so this gallery stays focused on Web & Mobile.
    const oldDevOpsTitle = gallery.getObjectByName('DEVOPS MONITORING');
    if (oldDevOpsTitle) oldDevOpsTitle.visible = false;
    const tniPrint = gallery.getObjectByName('Portfolio print | 07');
    if (tniPrint?.isMesh) {
      const tniTexture = new THREE.TextureLoader().load('/asset/tni.webp');
      tniTexture.colorSpace = THREE.SRGBColorSpace;
      const materials = Array.isArray(tniPrint.material) ? tniPrint.material : [tniPrint.material];
      materials.forEach((material) => {
        material.map = tniTexture;
        material.color?.set(0xffffff);
        material.needsUpdate = true;
      });
    }
    scene.add(gallery);
    gallery.updateMatrixWorld(true);

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

    if (loaderEl) {
      loaderEl.hidden = true;
    }

    if (targets.length === 0) {
      console.warn('Tidak ada titik karya yang ditemukan di model Blender.');
      return;
    }

    modelLoaded = true;
    focusProject(0, false);
  }

  function onModelError(error) {
    console.error('Could not load the Blender portfolio gallery:', error);
    if (loaderEl) loaderEl.hidden = true;
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvasHost);
  stage.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('wheel', onWheel, { passive: false });
  stage.addEventListener('touchstart', onTouchStart, { passive: true });
  stage.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('scroll', onWindowScroll, { passive: true });
  canvasHost.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  canvasHost.addEventListener('click', onCanvasClick);
  canvasHost.addEventListener('dblclick', toggleFullscreen);

  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
        stage.focus({ preventScroll: true });
      }
    });
  }, { threshold: [0.4] });
  visibilityObserver.observe(stage);

  if (previous) previous.addEventListener('click', onPreviousClick);
  if (next) next.addEventListener('click', onNextClick);
  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
  if (caseStudyBtn) caseStudyBtn.addEventListener('click', onCaseStudyClick);
  if (devSecOpsBtn) devSecOpsBtn.addEventListener('click', onDevSecOpsClick);

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
    stage.removeEventListener('wheel', onWheel);
    window.removeEventListener('wheel', onWheel);
    stage.removeEventListener('touchstart', onTouchStart);
    stage.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('scroll', onWindowScroll);
    canvasHost.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mouseup', onMouseUp);
    canvasHost.removeEventListener('click', onCanvasClick);
    canvasHost.removeEventListener('dblclick', toggleFullscreen);
    if (previous) previous.removeEventListener('click', onPreviousClick);
    if (next) next.removeEventListener('click', onNextClick);
    if (fullscreenBtn) fullscreenBtn.removeEventListener('click', toggleFullscreen);
    if (caseStudyBtn) caseStudyBtn.removeEventListener('click', onCaseStudyClick);
    if (devSecOpsBtn) devSecOpsBtn.removeEventListener('click', onDevSecOpsClick);
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
