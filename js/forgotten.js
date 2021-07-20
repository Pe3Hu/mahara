class forgotten{
  constructor( index, awakening, board ){
    this.const = {
      index: index
    };
    this.flag = {
    };
    this.var = {
      current: {
        parquet: awakening
      }
    };
    this.array = {
      capability: [ 0, 1, 2 ],
      to_do_list: []
    };
    this.data = {
      board: board,
      knowledge: {
        'somewhere': {},
        'something': {}
      }
    };

    this.init();
  }

  init(){
    this.init_ciclre();
  }

  init_ciclre(){
    let r = CONST_A / 2;
    const geometry = new THREE.CircleGeometry( r, 10 );
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } );
    const circle = new THREE.Mesh( geometry, material );
    let center = this.data.board.array.parquet[this.var.current.parquet].const.center;

    circle.position.x = center.x;
    circle.position.y = center.y;
    circle.position.z = center.z;

    this.data.board.data.scene.add( circle );
  }

  do_smthg(){
    //
    let keys = Object.keys( this.data.knowledge['somewhere'] );
    let index = keys.indexOf( this.var.current.parquet );

    if( index ==-1 ){
      this.use_capability( 0 );
      this.use_capability( 1 );
    }

    /*switch ( awakening_parquet.data.terrain.name ){
      case 'wasteland':
        break;
      case 'borderland':
        break;
      case 'river':
        break;
      case 'warp':
        break;
      case 'ruin':
        break;
      case 'lair':
        break;
      case 'mine':
        break;
      case 'pasture':
        break;
      case 'hub':
        break;
      case 'castle':
        break;
    };*/
  }

  add_to_list( capability ){
    this.array.to_do_list.push( capability );
  }

  use_capability( capability ){
    let where = this.data.board.array.parquet[this.var.current.parquet];
    this.data.board.array.capability[capability].used_by( this, where );
  }
}
