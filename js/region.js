class region{
  constructor( index, level, board, index_array ){
    this.const = {
      index: index,
      level: level
    };
    this.var = {
      current: {
        cluster: null
      }

    }
    this.array = {
      parquet: [],
      region: [],
      neighbour: []
    };
    this.data = {
      hue: null,
      board: board
    };

    this.init( index_array );
  }

  init( index_array ){
    if( this.const.level == 0 )
      this.array.parquet = index_array;
    else{
      this.array.region = index_array;

      for( let region of this.array.region ){
        let shifted_index = region - this.data.board.array.region_index_shift[this.const.level - 1];
        let parquets = this.data.board.array.region[this.const.level - 1][shifted_index].array.parquet;

        for( let parquet of parquets )
          this.array.parquet.push( parquet );
      }
    }
  }

  set_neighbours(){
    let all_parquets = this.data.board.array.parquet;
    let child_regions = this.data.board.array.region[this.const.level - 1];
    let regions = this.data.board.array.region[this.const.level];
    let neighbour_regions = [];

    if( this.const.level == 0 ){
      for( let parquet of this.array.parquet )
        if( all_parquets[parquet].flag.border ){
          let obj = all_parquets[parquet].data.neighbours;

          for( let key in obj )
            neighbour_regions.push( all_parquets[obj[key]].const.index );
        }
    }
    else
      for( let sub_region_index of this.array.region ){
        let region_index = 0;

        let shifted_index = sub_region_index - this.data.board.array.region_index_shift[this.const.level - 1];

        for( let neighbour_region of child_regions[shifted_index].array.neighbour ){
          let current_region_index = null;

          for( let region of regions )
            if( region.array.region.includes( neighbour_region ) )
              current_region_index = region.const.index;

          let index = neighbour_regions.indexOf( current_region_index );

          if( index == -1 &&
              current_region_index != this.const.index )
            neighbour_regions.push( current_region_index );
        }
      }

    this.array.neighbour = neighbour_regions;
  }

  set_hue( index, level ){
    this.data.hue = index / this.data.board.array.region[level].length;
  }

  paint( index, level ){
    this.set_hue( index, level );
    let colors = this.data.board.data.map.geometry.attributes.color.array;

    for( let parquet of this.array.parquet ){
      let parquet_triangle_count = 9 * 4;
      let start_index = this.data.board.array.parquet[parquet].const.index * parquet_triangle_count;
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


    //console.log( board )
  }
}
