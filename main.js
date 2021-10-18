import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js"
// var THREE = {}
var TowerBlock = {
    renderArea: document.getElementById('render-area'),
}

function initTowerBlock() {
    console.log('hi')
}

// BOTTOM IMPORT
// Supaya bisa digunakan di console browser
window.THREE = THREE
window.TowerBlock = TowerBlock
window.initTowerBlock = initTowerBlock

// ADD EVENT
window.addEventListener('load', initTowerBlock)