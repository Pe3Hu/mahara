class parquet{
  constructor( index, vertexs, board ){
    this.const = {
      index: index,
      center: null
    };
    this.flag = {
      in_workspace: false,
      free: true
    };
    this.var = {
      zone: -1,
      warp: -1,
      hub: -1
    }
    this.array = {
      vertex: vertexs,
      gate: [],
      cluster: []
    };
    this.data = {
      hue: null,
      board: board,
      neighbours: {},
      all_neighbours: {},
      terrain: {},
      subject: new subject( this )
    };

    this.set_center();
  }

  set_center(){
    let x = 0;
    let y = 0;

    for( let index of this.array.vertex ){
      let vertex = this.data.board.array.vertex[index];
      x += vertex.x / this.array.vertex.length;
      y += vertex.y / this.array.vertex.length;
    };

    this.const.center = new THREE.Vector3(
      x,
      y,
      0
    );
  }

  set_hue( level ){
    switch ( level ) {
      case -1:
        this.data.hue = this.const.index / this.data.board.array.parquet.length;
        break;
      case 0:
        this.data.hue = this.array.cluster[level] / this.data.board.array.cluster[level].length;
        break;
    }
  }

  set_type( type ){
    this.flag.free = false;
    this.data.terrain.type = type;

    switch ( type ) {
      case 0:
        this.data.terrain.name = 'wasteland';
        this.flag.free = true;
        break;
      case 1:
        this.data.terrain.name = 'borderland';
        break;
      case 2:
        this.data.terrain.name = 'river';
        break;
      case 3:
        this.data.terrain.name = 'warp';
        break;
      case 4:
        this.data.terrain.name = 'ruin';
        break;
      case 5:
        this.data.terrain.name = 'lair';
        break;
      case 6:
        this.data.terrain.name = 'mine';
        break;
      case 7:
        this.data.terrain.name = 'pasture';
        break;
      case 8:
        this.data.terrain.name = 'hub';
        break;
      case 9:
        this.data.terrain.name = 'castle';
        break;
    }
  }

  check_zone_equality(){
    let min_zone = INFINITY;
    let max_zone = -1;
    let all_parquets = this.data.board.array.parquet;

    for( let key in this.data.neighbours ){
    min_zone = Math.min( all_parquets[this.data.neighbours[key]].var.zone, min_zone );
    max_zone = Math.max( all_parquets[this.data.neighbours[key]].var.zone, max_zone );
    }

    let flag = ( min_zone == this.var.zone && max_zone == this.var.zone );
    return flag;
  }

  paint( level ){
    this.set_hue( level );
    let colors = this.data.board.data.map.geometry.attributes.color.array;

    let parquet_triangle_count = 9 * 4;
    let start_index = this.const.index * parquet_triangle_count;
  	const color = new THREE.Color();

    for( let i = start_index; i < start_index + parquet_triangle_count; i += 9 ){
      color.setHSL( this.data.hue, 1, 0.5 );

      colors[ i ] = color.r;
			colors[ i + 1 ] = color.g;
			colors[ i + 2 ] = color.b;

			colors[ i + 3 ] = color.r;
			colors[ i + 4 ] = color.g;
			colors[ i + 5 ] = color.b;

			colors[ i + 6 ] = color.r;
			colors[ i + 7 ] = color.g;
			colors[ i + 8 ] = color.b;
    }
  }
}
