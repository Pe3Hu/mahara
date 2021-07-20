const CONST_A = 32;
const INFINITY = 999999;

let MAX_DIST;
let WORKSPACE;
let GAME_BOARD;

init();
animate();

function init(){
  GAME_BOARD = new board();

  window.addEventListener( 'resize', onWindowResize );
  document.addEventListener( 'pointermove', onPointerMove );
  document.addEventListener( 'keydown', onDocumentKeyDown );
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

function onDocumentKeyDown( event ) {
    var keyCode = event.which;

    switch ( keyCode ) {
      case 65:
        GAME_BOARD.shift_paint_level( -1 );
        break;
      case 68:
        GAME_BOARD.shift_paint_level( 1 );
        break;
      case 90:
        GAME_BOARD.shift_paint_layer( -1 );
        break;
      case 67:
        GAME_BOARD.shift_paint_layer( 1 );
    }
};
