const COLOR_MAX = 360;
const COLOR_BG = COLOR_MAX / 2;
const HIVE_RADIUS = 100;
const DRONE_RADIUS = 10;
const SOURCE_RADIUS = 50;

let MAX_DIST;
let WORKSPACE;
let GAME_BOARD;

init();
animate();

function init(){
  GAME_BOARD = new board();

  window.addEventListener( 'resize', onWindowResize );
  document.addEventListener( 'pointermove', onPointerMove );
}

function animate() {
  requestAnimationFrame( animate );

  GAME_BOARD.render();
  GAME_BOARD.data.stats.update();
}


function onWindowResize() {
  GAME_BOARD.data.camera.aspect = window.innerWidth / window.innerHeight;
  GAME_BOARD.data.camera.updateProjectionMatrix();

  GAME_BOARD.data.renderer.setSize( window.innerWidth, window.innerHeight );
}

function onPointerMove( event ) {
  GAME_BOARD.data.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  GAME_BOARD.data.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
