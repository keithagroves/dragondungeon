import React, { useEffect, useCallback } from 'react';
import { IInputs } from '../../common';
import { Viewport } from 'pixi-viewport';
import ReactNipple from 'react-nipple';

interface ControlProps {
  actionCallback: (p: IInputs) => void
  viewport: Viewport
  scheme: number
}

let activeControls = {
  left: false,
  up: false,
  right: false,
  down: false,
  shoot: false,
  autoshoot: false,
  angle: 0.0,
  space: false,
  turbo: false
};

export const Controls = (props: ControlProps) => {
  const actionCallback = props.actionCallback;

  const updateAndSend = useCallback((change: object) => {
    const updated = Object.assign({}, activeControls, change);


    actionCallback(updated)
    activeControls = updated;
  }, [actionCallback])

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (props.scheme == 0) {
        if (e.key == ' ') { updateAndSend({ space: true, shoot: true }) }
        if (e.key == 'x') { updateAndSend({ autoshoot: true }) }
        if (e.key == 'v') { updateAndSend({ turbo: true }) }
      }
    }
    const keyup = (e: KeyboardEvent) => {
      if (props.scheme == 0) {
        if (e.key == ' ') { updateAndSend({ space: false, shoot: false }) }
        if (e.key == 'x') { updateAndSend({ autoshoot: false }) }
        if (e.key == 'v') { updateAndSend({ turbo: false }) }
      }
    }
    const mouseMove = (e: MouseEvent) => {
      try {
        if (props.scheme == 0) {
          const X = window.innerWidth / 2;
          const Y = window.innerHeight / 2;
          const change = { angle: -Math.atan2(X - e.x, Y - e.y) + Math.PI / 2 };
          updateAndSend(change);
        }
      } catch { }
    }

    window.addEventListener("keydown", keydown)
    window.addEventListener("keyup", keyup)
    window.addEventListener("mousemove", mouseMove)

    window.addEventListener("gamepadconnected", gamepadInputLoop)

    function gamepadInputLoop() {
      var gamepads = navigator.getGamepads();
      if (!gamepads) { return }
      var gamepad = gamepads[0];

      if (gamepad.buttons[12].pressed) { updateAndSend({ up: true, down: false }) }
      if (gamepad.buttons[13].pressed) { updateAndSend({ down: true, up: false }) }
      if (gamepad.buttons[14].pressed) { updateAndSend({ left: true, right: false }) }
      if (gamepad.buttons[15].pressed) { updateAndSend({ right: true, left: false }) }

      requestAnimationFrame(gamepadInputLoop);
    }


    const controlFocusCheck = setInterval(() => {
      if (!document.hasFocus()) {
        updateAndSend({
          up: false,
          down: false,
          left: false,
          right: false,
        });
      }
    }, 100);

    return () => {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("mousemove", mouseMove);
      clearInterval(controlFocusCheck);
    }
  }, [props.actionCallback, updateAndSend, props.viewport])
  return <>
    <ReactNipple
      options={{ color: props.scheme == 1 ? '#c60c30' : 'transparent', mode: 'dynamic', position: { bottom: '50%', right: '50%' } }}
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh'
      }}
      onMove={(evt: any, data: any) => {
        if (data.direction) {
          console.log(data.direction.angle)
          switch (data.direction.angle) {
            case 'up':
              updateAndSend({
                up: true,
                down: false
              })
              break;
            case 'down':
              updateAndSend({
                down: true,
                up: false
              })
              break;
            case 'left':
              updateAndSend({
                left: true,
                right: false
              })
              break;
            case 'right':
              updateAndSend({
                right: true,
                left: false
              })
              break;
          }
        }
      }} /></>
}
