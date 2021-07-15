class parquet{
  constructor( index, vertexs, board ){
    this.const = {
      index: index
    };
    this.array = {
      vertex: vertexs,
      gate: [],
      cluster: []
    };
    this.data = {
      hue: null,
      board: board,
      neighbours: {}
    };

    this.init();
  }

  init(){

  }

  set_hue( level ){
    switch ( level ) {
      case -1:
        this.data.hue = this.const.index / this.data.board.array.parquet.length;
        break;
      case 0:
        this.data.hue = this.array.cluster[level] / this.data.board.array.cluster[level].length;
        //console.log(  this.array.cluster, level, this.data.board.array.cluster[level].length )
        break;
    }
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
    //console.log( board )
  }
}
