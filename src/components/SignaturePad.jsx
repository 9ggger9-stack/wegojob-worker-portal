import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

const SignaturePad = forwardRef(function SignaturePad(_, ref) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d');
    const configureCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const previous = signed ? canvas.toDataURL('image/png') : null;
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.round(220 * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.lineWidth = 2.6;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = '#111';
      if (previous) {
        const image = new Image();
        image.onload = () => context.drawImage(image, 0, 0, rect.width, 220);
        image.src = previous;
      }
    };

    const position = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const begin = (clientX, clientY) => {
      const point = position(clientX, clientY);
      drawingRef.current = true;
      setSigned(true);
      context.beginPath();
      context.moveTo(point.x, point.y);
    };

    const draw = (clientX, clientY) => {
      if (!drawingRef.current) return;
      const point = position(clientX, clientY);
      context.lineTo(point.x, point.y);
      context.stroke();
    };

    const end = () => { drawingRef.current = false; };

    const pointerDown = (event) => {
      canvas.setPointerCapture?.(event.pointerId);
      begin(event.clientX, event.clientY);
      event.preventDefault();
    };
    const pointerMove = (event) => {
      draw(event.clientX, event.clientY);
      if (drawingRef.current) event.preventDefault();
    };
    const pointerUp = (event) => {
      end();
      try { canvas.releasePointerCapture?.(event.pointerId); } catch {}
      event.preventDefault();
    };

    const touchStart = (event) => {
      const touch = event.touches[0];
      if (touch) begin(touch.clientX, touch.clientY);
      event.preventDefault();
    };
    const touchMove = (event) => {
      const touch = event.touches[0];
      if (touch) draw(touch.clientX, touch.clientY);
      event.preventDefault();
    };
    const mouseDown = (event) => { begin(event.clientX, event.clientY); event.preventDefault(); };
    const mouseMove = (event) => { draw(event.clientX, event.clientY); };

    configureCanvas();
    window.addEventListener('resize', configureCanvas);

    if (window.PointerEvent) {
      canvas.addEventListener('pointerdown', pointerDown, { passive: false });
      canvas.addEventListener('pointermove', pointerMove, { passive: false });
      canvas.addEventListener('pointerup', pointerUp, { passive: false });
      canvas.addEventListener('pointercancel', pointerUp, { passive: false });
    } else {
      canvas.addEventListener('touchstart', touchStart, { passive: false });
      canvas.addEventListener('touchmove', touchMove, { passive: false });
      canvas.addEventListener('touchend', end, { passive: false });
      canvas.addEventListener('mousedown', mouseDown);
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', end);
    }

    return () => {
      window.removeEventListener('resize', configureCanvas);
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerup', pointerUp);
      canvas.removeEventListener('pointercancel', pointerUp);
      canvas.removeEventListener('touchstart', touchStart);
      canvas.removeEventListener('touchmove', touchMove);
      canvas.removeEventListener('touchend', end);
      canvas.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', end);
    };
  }, [signed]);

  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
    setSigned(false);
  };

  useImperativeHandle(ref, () => ({
    isSigned: () => signed,
    toDataURL: () => canvasRef.current?.toDataURL('image/png') || '',
    clear,
  }), [signed]);

  return (
    <div className="signature-wrap">
      <canvas ref={canvasRef} className="signature" aria-label="Pole podpisu" />
      <button type="button" className="btn secondary" onClick={clear}>Wyczyść podpis</button>
    </div>
  );
});

export default SignaturePad;
