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
      color: {
        h: null,
        s: null,
        l: null
      },
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
      for( let parquet of this.array.parquet ){
        let obj = all_parquets[parquet].data.neighbours;

        for( let key in obj )
          for( let region of regions )
            if( region.array.parquet.includes( all_parquets[obj[key]].const.index ) )
              neighbour_regions.push( region.const.index );
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

  paint( index, level ){
    let all_parquets = this.data.board.array.parquet;
    if( level != -1 ){
      this.data.color.h = index / this.data.board.array.region[level].length;
      this.data.color.s = 1;
      this.data.color.l = 0.5;
    }
    else{
      this.data.color.h = 0;
      this.data.color.s = 0;
      this.data.color.l = 2 / 3;
    }
    let colors = this.data.board.data.map.geometry.attributes.color.array;

    for( let parquet of this.array.parquet ){
      let parquet_triangle_count = 9 * 4;
      let start_index = all_parquets[parquet].const.index * parquet_triangle_count;
      const color = new THREE.Color();

      this.data.color.s = 1;
      this.data.color.l = 0.5;

      switch ( all_parquets[parquet].data.terrain.name ) {
        case 'wasteland':
          this.data.color.h = 0;
          this.data.color.s = 0;
          this.data.color.l = 0.5;
          break;
        case 'borderland':
          this.data.color.h = 280/360;
          break;
        case 'river':
          this.data.color.h = 215/360;
          break;
        case 'warp':
          this.data.color.h = 360;
          break;
        case 'ruin':
          this.data.color.h = 20/360;
          break;
        case 'lair':
          this.data.color.h = 30/360;
          this.data.color.s = 0.25;
          this.data.color.l = 0.25;
          break;
        case 'mine':
          this.data.color.h = 50/360;
          break;
        case 'pasture':
          this.data.color.h = 110/360;
          break;
      };

      for( let i = start_index; i < start_index + parquet_triangle_count; i += 9 ){
        color.setHSL( this.data.color.h, this.data.color.s, this.data.color.l );

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
