import React, { useEffect } from "react";
import * as THREE from 'three';
import { RandomUtil } from "../utils/random";

import { GUI } from 'https://unpkg.com/three@0.126.0/examples/jsm/libs/dat.gui.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js';

class LifeGameCells {
  constructor (
    camera, countX, countY, countZ,
  ) {
    this.boxWidth = 0.2;
    this.boxInterval = 0.1;

    this.camera = camera;

    this.countX = countX;
    this.countY = countY;
    this.countZ = countZ;

    this.scene = new THREE.Scene(); 

    this.elapsed_time = 0;

    this.cells = [];
    for (let z = 0; z < this.countZ; z++) {
      let zSquare = [];
      for (let y = 0; y < this.countY; y++) {
        let yLine = [];
        for (let x = 0; x < this.countX; x++) {
          const geometry = new THREE.BoxGeometry( this.boxWidth, this.boxWidth, this.boxWidth );
          
          const isAlive = RandomUtil.getRandomInt(2) === 1;
          const opacity = isAlive ? 0.5 : 0.2;
          
          const material = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: opacity, transparent: true, wireframe: !isAlive } );
          const box = new THREE.Mesh( geometry, material );

          // box.castShadow = true;
          box.position.set(
            this.calculatePosition(x, this.countX),
            this.calculatePosition(y, this.countY),
            this.calculatePosition(z, this.countZ)
          );
          
          this.scene.add(box);
          yLine.push(box);
        }
        zSquare.push(yLine);
      }
      this.cells.push(zSquare);
    }
  }

  updateCells = () => {
    this.elapsed_time = this.elapsed_time+1;
    if (this.elapsed_time % 50 == 0) {
      
      this.cells.flat(Infinity).forEach((cell) => {
        const isAlive = RandomUtil.getRandomInt(2) === 1;
        const opacity = isAlive ? 0.5 : 0.2;
  
        cell.opacity = opacity;
        cell.material.wireframe = isAlive;
      })
    }
  }

  calculatePosition = (value, count) => {
    const areaSize = this.boxWidth + this.boxInterval;

    return areaSize*value - (areaSize*count - this.boxInterval) / 2
  }
}

export const ThreeSample = () => {
  useEffect(() => {
    const settings = {
      resetCamera: function() {
        controls.update();
        camera.position.set(3, 3, 3);
      }
    }

    const gui = new GUI();
    gui.add(settings, 'resetCamera');
    gui.open();

    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);

    const lifegame = new LifeGameCells(camera, 9, 9, 9);

    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animation );
    document.body.appendChild( renderer.domElement );
    const controls = new OrbitControls(camera, renderer.domElement);

    // animation
    function animation(time) {
      // mesh.rotation.x = time / 2000;
      // mesh.rotation.y = time / 1000;

      lifegame.updateCells();

      renderer.render( lifegame.scene, camera );
    }
  }, [])
  
  return <></>
}