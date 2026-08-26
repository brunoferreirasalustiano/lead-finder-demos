(() => {
  "use strict";

  const hero = document.querySelector(".hero");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!hero || reducedMotion.matches) return;

  const config = Object.freeze({
    color: [97 / 255, 147 / 255, 21 / 255],
    speed: 1.9,
    scale: 1,
    opacity: 0.5,
    iterations: 35,
    renderScale: 0.45,
    targetFps: 25,
    maxDpr: 1.5,
  });

  const layer = document.createElement("div");
  layer.className = "page-plasma";
  layer.setAttribute("aria-hidden", "true");

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  layer.appendChild(canvas);
  document.body.prepend(layer);

  let gl;
  try {
    gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      stencil: false,
    });
  } catch {
    layer.remove();
    return;
  }

  if (!gl) {
    layer.remove();
    return;
  }

  const vertexSource = `#version 300 es
precision highp float;
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

  const fragmentSource = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uSpeed;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uQuality;
uniform float uStepScale;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;

  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center);

  float i = 0.0;
  float d = 0.0;
  float z = 0.0;
  float T = iTime * uSpeed;
  vec3 O = vec3(0.0);
  vec3 p = vec3(0.0);
  vec3 S = vec3(0.0);
  vec2 r = iResolution.xy;
  vec2 Q = vec2(0.0);

  for (int stepIndex = 0; stepIndex < 60; stepIndex++) {
    i += 1.0;
    p = z * normalize(vec3(C - 0.5 * r, r.y));
    p.z -= 4.0;
    S = p;
    d = p.y - T;

    p.x += 0.4 * (1.0 + p.y) * sin(d + p.x * 0.1) * cos(0.34 * d + p.x * 0.05);
    p.xz *= mat2(cos(p.y + vec4(0.0, 11.0, 33.0, 0.0) - T));
    Q = p.xz;
    d = (abs(sqrt(length(Q * Q)) - 0.25 * (5.0 + S.y)) / 3.0 + 8e-4) * uStepScale;
    z += d;
    o = 1.0 + sin(S.y + p.z * 0.5 + S.z - length(S - p) + vec4(2.0, 1.0, 0.0, 8.0));
    O += o.w / d * o.xyz;

    if (i >= uQuality) break;
  }

  o.xyz = tanh(O / 1e4);
}

bool finite1(float value) {
  return !(isnan(value) || isinf(value));
}

vec3 sanitize(vec3 color) {
  return vec3(
    finite1(color.r) ? color.r : 0.0,
    finite1(color.g) ? color.g : 0.0,
    finite1(color.b) ? color.b : 0.0
  );
}

void main() {
  vec4 outputColor = vec4(0.0);
  mainImage(outputColor, gl_FragCoord.xy);
  vec3 rgb = sanitize(outputColor.rgb);
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 finalColor = intensity * uCustomColor;
  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`;

  let program = null;
  let vertexArray = null;
  let vertexBuffer = null;
  let uniforms = null;
  let resizeFrame = 0;
  let animationFrame = 0;
  let contextLost = false;
  let isVisible = true;
  let tabVisible = document.visibilityState !== "hidden";
  let lastFrameTime = 0;
  let firstFrameRendered = false;
  let pendingPointer = null;
  const startedAt = performance.now();
  const frameInterval = 1000 / config.targetFps;

  const compileShader = (type, source) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("shader-create-failed");

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      throw new Error("shader-compile-failed");
    }

    return shader;
  };

  const releaseResources = () => {
    if (vertexBuffer) gl.deleteBuffer(vertexBuffer);
    if (vertexArray) gl.deleteVertexArray(vertexArray);
    if (program) gl.deleteProgram(program);
    vertexBuffer = null;
    vertexArray = null;
    program = null;
    uniforms = null;
  };

  const createResources = () => {
    releaseResources();

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    const nextProgram = gl.createProgram();

    if (!nextProgram) throw new Error("program-create-failed");

    gl.attachShader(nextProgram, vertexShader);
    gl.attachShader(nextProgram, fragmentShader);
    gl.linkProgram(nextProgram);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(nextProgram, gl.LINK_STATUS)) {
      gl.deleteProgram(nextProgram);
      throw new Error("program-link-failed");
    }

    program = nextProgram;
    vertexArray = gl.createVertexArray();
    vertexBuffer = gl.createBuffer();

    if (!vertexArray || !vertexBuffer) throw new Error("geometry-create-failed");

    gl.bindVertexArray(vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const position = gl.getAttribLocation(program, "position");
    if (position < 0) throw new Error("position-attribute-missing");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    uniforms = {
      resolution: gl.getUniformLocation(program, "iResolution"),
      time: gl.getUniformLocation(program, "iTime"),
      color: gl.getUniformLocation(program, "uCustomColor"),
      speed: gl.getUniformLocation(program, "uSpeed"),
      scale: gl.getUniformLocation(program, "uScale"),
      opacity: gl.getUniformLocation(program, "uOpacity"),
      mouse: gl.getUniformLocation(program, "uMouse"),
      quality: gl.getUniformLocation(program, "uQuality"),
      stepScale: gl.getUniformLocation(program, "uStepScale"),
    };

    gl.useProgram(program);
    gl.uniform3fv(uniforms.color, config.color);
    gl.uniform1f(uniforms.speed, config.speed * 0.4);
    gl.uniform1f(uniforms.scale, config.scale);
    gl.uniform1f(uniforms.opacity, config.opacity);
    gl.uniform1f(uniforms.quality, config.iterations);
    gl.uniform1f(uniforms.stepScale, 60 / config.iterations);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
  };

  const resize = () => {
    if (!program || !uniforms) return;

    const rect = layer.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, config.maxDpr);
    const width = Math.max(1, Math.floor(rect.width * config.renderScale * dpr));
    const height = Math.max(1, Math.floor(rect.height * config.renderScale * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }

    gl.useProgram(program);
    gl.uniform2f(uniforms.resolution, width, height);
    gl.uniform2f(uniforms.mouse, width * 0.5, height * 0.5);
  };

  const scheduleResize = () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      resize();
    });
  };

  const updatePointer = () => {
    if (!pendingPointer || !uniforms) return;

    const rect = layer.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = ((pendingPointer.x - rect.left) / rect.width) * canvas.width;
    const y = (1 - (pendingPointer.y - rect.top) / rect.height) * canvas.height;
    gl.uniform2f(uniforms.mouse, x, y);
    pendingPointer = null;
  };

  const render = (time) => {
    animationFrame = 0;
    if (contextLost || !isVisible || !tabVisible || !program || !uniforms) return;

    animationFrame = requestAnimationFrame(render);
    if (time - lastFrameTime < frameInterval) return;
    lastFrameTime = time;

    gl.useProgram(program);
    updatePointer();
    gl.uniform1f(uniforms.time, (time - startedAt) * 0.001);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindVertexArray(vertexArray);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (!firstFrameRendered) {
      firstFrameRendered = true;
      layer.dataset.plasmaState = "ready";
      layer.dataset.targetFps = String(config.targetFps);
      layer.dataset.renderScale = String(config.renderScale);
      document.body.classList.add("plasma-active");
    }
  };

  const resume = () => {
    if (animationFrame || contextLost || !isVisible || !tabVisible) return;
    lastFrameTime = 0;
    animationFrame = requestAnimationFrame(render);
  };

  const pause = () => {
    if (!animationFrame) return;
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };

  const handlePointerMove = (event) => {
    pendingPointer = { x: event.clientX, y: event.clientY };
  };

  const handleVisibilityChange = () => {
    tabVisible = document.visibilityState !== "hidden";
    if (tabVisible) resume();
    else pause();
  };

  const handleContextLost = (event) => {
    event.preventDefault();
    contextLost = true;
    layer.dataset.plasmaState = "context-lost";
    pause();
  };

  const handleContextRestored = () => {
    try {
      createResources();
      resize();
      contextLost = false;
      layer.dataset.plasmaState = "restored";
      resume();
    } catch {
      layer.dataset.plasmaState = "failed";
      layer.remove();
    }
  };

  const resizeObserver = new ResizeObserver(scheduleResize);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) resume();
    else pause();
  }, { threshold: 0 });

  try {
    createResources();
    resizeObserver.observe(layer);
    intersectionObserver.observe(layer);
    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);
    resize();
    resume();
  } catch {
    releaseResources();
    layer.remove();
  }
})();
