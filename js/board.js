class board{
  constructor (){
    this.const = {
      workspace_size_x: 1024,//CONST_A * 50,
      workspace_size_y: 512,//CONST_A * 25,
      a: 1,
      cols: 10,
      rows: 26,
      cluster_size_max: 6,
      cluster_size_min: 3
    };
    this.var = {
      index: {
        vertex: 0,
        parquet: 0,
        cluster: 0,
        region: 0,
        region_level: 0
      },
      current: {
        parquet_cluster: {
          x: 0,
          y: 0
        },
        paint_level: 0
      }
    }
    this.array = {
      vertex: [],
      parquet: [],
      row_size: [],
      row_first_vertex: [],
      gate: [],
      cluster: [],
      region: [],
      region_index_shift: [ 0 ]
    };
    this.data = {
      renderer: null,
      scene: null,
      camera: null,
      stats: null,
      uniforms: null,
      geometry: {
        border_line: null,
        map: null
      },
      hues: {
      }
    };

    this.const.b =  Math.sqrt( 2 + Math.sqrt( 3 ) ) * this.const.a;

    this.init();
  }

  init() {
    this.init_main();
    this.init_geometrys();
    this.init_gates();
    this.init_first_regions_level();
    //this.init_ciclres();
  }

  init_main(){
    WORKSPACE = new THREE.Vector3(
      this.const.workspace_size_x,
      this.const.workspace_size_y,
      0
    );
    MAX_DIST = Math.sqrt( Math.pow( WORKSPACE.x * 2, 2 ) + Math.pow( WORKSPACE.y * 2, 2 ) );

    this.data.camera = new THREE.PerspectiveCamera( WORKSPACE.x + WORKSPACE.y, window.innerWidth / window.innerHeight, 1, 10000 );
    this.data.camera.position.x = 0;
    this.data.camera.position.y = 0;
    this.data.camera.position.z = -0.36 * ( WORKSPACE.x + WORKSPACE.y );
    this.data.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    this.data.scene = new THREE.Scene();

    let material = new THREE.LineBasicMaterial({
      color: 0xffffff
    });

    let points = [];
    let x = WORKSPACE.x;
    let y = WORKSPACE.y;
    points.push( new THREE.Vector3( -x, -y, -1 ) );
    points.push( new THREE.Vector3( -x, y, -1 ) );
    points.push( new THREE.Vector3( x, y, -1 ) );
    points.push( new THREE.Vector3( x, -y, -1 ) );
    points.push( new THREE.Vector3( -x, -y, -1 ) );

    this.data.geometry.borders_line = new THREE.BufferGeometry().setFromPoints( points );
    this.data.borders_line = new THREE.Line( this.data.geometry.borders_line, material );

    this.data.scene.add( this.data.borders_line );

    this.data.renderer = new THREE.WebGLRenderer();
    this.data.renderer.setPixelRatio( window.devicePixelRatio );
    this.data.renderer.setSize( window.innerWidth, window.innerHeight );

    let container = document.getElementById( 'container' );
    container.appendChild( this.data.renderer.domElement );

    this.data.stats = new Stats();
    container.appendChild( this.data.stats.dom );

    this.data.clock = new THREE.Clock( true );

		this.data.raycaster = new THREE.Raycaster();

		this.data.pointer = new THREE.Vector2();

    this.data.scene.add( new THREE.AmbientLight( 0xffffff ) );
  }

  init_geometrys(){
    for( let i = 0; i < this.const.rows; i++ )
      this.set_row();

    const triangles = this.array.parquet.length * 4;
		const positions = new Float32Array( triangles * 3 * 3 );
		const normals = new Float32Array( triangles * 3 * 3 );
		const colors = new Float32Array( triangles * 3 * 3 );

		const pA = new THREE.Vector3();
		const pB = new THREE.Vector3();
		const pC = new THREE.Vector3();

		const cb = new THREE.Vector3();
		const ab = new THREE.Vector3();

		const color = new THREE.Color();

    for ( let parquet of this.array.parquet ){
      let shifted_index = parquet.const.index * 4 * 9;

      for ( let j = 1; j < parquet.array.vertex.length - 2; j++ ){
        let i = shifted_index + ( j - 1 ) * 9;

        const ax = this.array.vertex[parquet.array.vertex[0]].x;
        const ay = this.array.vertex[parquet.array.vertex[0]].y;
        const az = this.array.vertex[parquet.array.vertex[0]].z;

        const bx = this.array.vertex[parquet.array.vertex[j]].x;
        const by = this.array.vertex[parquet.array.vertex[j]].y;
        const bz = this.array.vertex[parquet.array.vertex[j]].z;

        const cx = this.array.vertex[parquet.array.vertex[j + 1]].x;
        const cy = this.array.vertex[parquet.array.vertex[j + 1]].y;
        const cz = this.array.vertex[parquet.array.vertex[j + 1]].z;

        positions[ i ] = ax;
        positions[ i + 1 ] = ay;
        positions[ i + 2 ] = az;

        positions[ i + 3 ] = bx;
        positions[ i + 4 ] = by;
        positions[ i + 5 ] = bz;

        positions[ i + 6 ] = cx;
        positions[ i + 7 ] = cy;
        positions[ i + 8 ] = cz;

        color.setHSL( 1, 1, 1 );//parquet.data.hue

				pA.set( ax, ay, az );
				pB.set( bx, by, bz );
				pC.set( cx, cy, cz );

				cb.subVectors( pC, pB );
				ab.subVectors( pA, pB );
				cb.cross( ab );

				cb.normalize();

				const nx = cb.x;
				const ny = cb.y;
				const nz = cb.z;

				normals[ i ] = nx;
				normals[ i + 1 ] = ny;
				normals[ i + 2 ] = nz;

				normals[ i + 3 ] = nx;
				normals[ i + 4 ] = ny;
				normals[ i + 5 ] = nz;

				normals[ i + 6 ] = nx;
				normals[ i + 7 ] = ny;
				normals[ i + 8 ] = nz;

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

    this.data.geometry.map = new THREE.BufferGeometry();
    this.data.geometry.map.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		this.data.geometry.map.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
		this.data.geometry.map.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    let material = new THREE.MeshPhongMaterial( {
  					color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
  					side: THREE.DoubleSide, vertexColors: true
  				} );

		this.data.map = new THREE.Mesh( this.data.geometry.map, material );
		this.data.scene.add( this.data.map )

		this.data.raycaster = new THREE.Raycaster();

		this.data.pointer = new THREE.Vector2();
  }

  init_ciclres(){
    let r = this.const.a * 0.1;
    let vertex_index = 2;
    let count = 6;
    let circle_counter = 0;

    let point = this.array.vertex[vertex_index].clone();
    let a_index = ( vertex_index - 1 + count ) % count;
    let b_index = ( vertex_index + 1 ) % count;
    let a_vec = this.array.vertex[a_index].clone();
    let b_vec = this.array.vertex[b_index].clone();

    a_vec.sub( point );
    a_vec.normalize();
    b_vec.sub( point );
    b_vec.normalize();

    let way = a_vec.clone();
    way.add( b_vec );
    way.normalize();
    let l = r / Math.sin( 60 / 2 / 180 * Math.PI );
    way.multiplyScalar( l );
    point.add( way );

    let rows = Math.floor( this.const.a * 2 / ( r * 2 ) );
    let cols = Math.floor( ( this.const.b + this.const.a ) / ( r * 2 ) );
    let vertexs = [];

    a_vec.multiplyScalar( 2 * r );
    b_vec.multiplyScalar( 2 * r );

    for( let i = 0; i < rows; i++ ){
      let vec = point.clone();
      //if( i % 2 == 0 )
        for( let j = 0; j < i; j++ ){
          vec.add( a_vec );
        }

      vertexs.push( [] );

      for( let j = 0; j < cols; j++ ){
        vertexs[i].push( vec.clone() );
        vec.add( b_vec );
      }
    }

    let parquet = this.array.parquet[0];

    for( let i = 0; i < rows; i++ ){
      for( let j = 0; j < cols; j++ ){
        let belonging_chek = false;

        for ( let k = 0; k < parquet.array.vertex.length; k+= 2)
          for ( let l = 0; l < parquet.array.vertex.length - 2; l++ ){
            let a = ( k  ) % parquet.array.vertex.length;
            let b = ( k + l + 1 ) % parquet.array.vertex.length;
            let c = ( k + l + 2 ) % parquet.array.vertex.length;

            if( !belonging_chek )
              belonging_chek = belonging_chek || this.check_dot_in_triangle(
                vertexs[i][j],
                [
                  this.array.vertex[parquet.array.vertex[a]],
                  this.array.vertex[parquet.array.vertex[b]],
                  this.array.vertex[parquet.array.vertex[c]]
                ] );
          }


        if( belonging_chek ){
          let border_check = true;

          for ( let l = 0; l < parquet.array.vertex.length - 1; l++ ){
            let ll = ( l + 1 ) % parquet.array.vertex.length;

            if( border_check ){
              let d = this.distance_between_dot_and_line_by_two_points(
                vertexs[i][j],
                [
                  this.array.vertex[parquet.array.vertex[l]],
                  this.array.vertex[parquet.array.vertex[ll]]
                ] );

              if( d - r * 0.99 < 0.01 )
                border_check = false;
            }
          }

          if( border_check ){
            const geometry = new THREE.CircleGeometry( r, 400 );
            const material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
            const circle = new THREE.Mesh( geometry, material );

            circle.position.x = vertexs[i][j].x;
            circle.position.y = vertexs[i][j].y;
            circle.position.z = vertexs[i][j].z;

            this.data.scene.add( circle );
            circle_counter++;
          }
        }
      }
    }

    let total_area = 0;

    for ( let l = 1; l < parquet.array.vertex.length - 2; l++ )
        total_area += this.triangle_vertex_area(
          [
            this.array.vertex[parquet.array.vertex[0]],
            this.array.vertex[parquet.array.vertex[l]],
            this.array.vertex[parquet.array.vertex[l + 1]]
          ] );

    let circle_radius = r;

    let percentage = this.coverage_percentage( total_area, circle_radius, circle_counter );
    console.log( 'percentage is', percentage )
  }

  init_gates(){
    for( let parquet of this.array.parquet ){
      let gates = [];

      for ( let l = 0; l < parquet.array.vertex.length - 1; l++ ){
        let ll = ( l + 1 ) % parquet.array.vertex.length;

        let vertex_indexs = [
          parquet.array.vertex[l],
          parquet.array.vertex[ll]
        ];

        let flag = false;
        let already_index = null;

        for( let i = 0; i < this.array.gate.length; i++ )
          if( !flag ){
            let gate = this.array.gate[i];
            flag = flag || ( gate[0] == vertex_indexs[0] && gate[1] == vertex_indexs[1] );
            flag = flag || ( gate[0] == vertex_indexs[1] && gate[1] == vertex_indexs[0] );

            if( flag )
              gates.push( i );
          }

        if( !flag ){
          gates.push( this.array.gate.length );
          this.array.gate.push( vertex_indexs );
        }
      }

      parquet.array.gate = gates;
    }

    for( let i = 0; i < this.array.parquet.length - 1; i++ )
      for( let j = i + 1; j < this.array.parquet.length; j++ ){
        let gate_index = this.check_joint_gate( [
          this.array.parquet[i],
          this.array.parquet[j]
        ] );

        if( gate_index != -1 ){
          this.array.parquet[i].data.neighbours[gate_index] = j;
          this.array.parquet[j].data.neighbours[gate_index] = i;
        }
      }
  }

  init_first_regions_level(){
    this.array.region.push( [] );
    let regions = this.array.region[this.var.index.region_level];
    let parquets = this.array.parquet;

    for( let parquet of this.array.parquet ){
      regions.push( new region( this.var.index.region, this.var.index.region_level, this, [ parquet.const.index ] ) )
      this.var.index.region++;
    }

    this.array.region_index_shift.push( this.var.index.region );

    for( let region of regions )
      region.set_neighbours();

    let min_cluster_count = this.const.cluster_size_min * ( this.const.cluster_size_min + 1 ) ;
    while( this.array.region[this.var.index.region_level].length >= min_cluster_count )
      this.init_next_regions();

    if( this.array.region[this.var.index.region_level].length >= this.const.cluster_size_min * this.const.cluster_size_min ){
      this.const.cluster_size_max = this.const.cluster_size_min + 1;
      this.init_next_regions();
    }

    console.log( this.array.region[this.var.index.region_level - 1].length, this.array.region[this.var.index.region_level].length )

    this.var.current.paint_level = 2;
    this.paint_regions();
  }

  init_next_regions(){
    //
    this.array.cluster = [];
    let clusters = this.array.cluster;
    let regions = this.array.region[this.var.index.region_level];
    let free_regions_not_const_index = [];
    let single_regions_not_const_index = [];
    let cluster_max = regions.length / 2;
    this.var.index.cluster = 0;

    //all unused regions are set
    for( let region of regions )
      free_regions_not_const_index.push( region.const.index );

    //distribution of regions by clusters while there are free ones
    while( free_regions_not_const_index.length > 0 && this.var.index.cluster < cluster_max ){
      //the first element of the cluster is specified
      let first_index = free_regions_not_const_index.splice( 0, 1 );
      let cluster_regions_not_const_indexs = [ first_index[0] ];

      let rand = Math.floor( Math.random() * ( this.const.cluster_size_max - this.const.cluster_size_min ) );
      let cluster_size = this.const.cluster_size_min + rand;
      let counter = 0;

      //filling the remaining places in the cluster
      while( cluster_regions_not_const_indexs.length < cluster_size && counter < cluster_size ){
        let neighbours = [];
        let free_region_neighbours = [];

        //counting neighbours for all free parquets
        for( let index of free_regions_not_const_index ){
          let shifted_index = index - this.array.region_index_shift[this.var.index.region_level];
          free_region_neighbours.push( regions[shifted_index].array.neighbour );
        }

        //compiling an array of neighbours suitable for expansion
        for( let cluster_parquet_index of cluster_regions_not_const_indexs ){
          let shifted_index = cluster_parquet_index - this.array.region_index_shift[this.var.index.region_level];
          let cluster_neighbours = regions[shifted_index].array.neighbour;

          for( let cluster_neighbour of cluster_neighbours ){
            let index_free_regions_not_const_index = free_regions_not_const_index.indexOf( cluster_neighbour );

            if( index_free_regions_not_const_index != -1 ){
              let single_check = false;

              //checking the pakret cut off from the surrounding
              for( let neighbour of free_region_neighbours[index_free_regions_not_const_index] ){
                let neighbour_index = free_regions_not_const_index.indexOf( neighbour );

                if( neighbour_index != -1 )
                  if( free_region_neighbours[neighbour_index].length == 1 )
                    single_check = true;
              }

              if( !single_check ){
                let index_neighbours = neighbours.indexOf( cluster_neighbour );

                if( index_neighbours == -1 )
                  neighbours.push( cluster_neighbour );
              }
            }
          }
        }

        //choosing one neighbour from all possible
        if( neighbours.length > 0 ){
          let rand = Math.floor( Math.random() * neighbours.length )
          cluster_regions_not_const_indexs.push( neighbours[rand] );

          let index_free_regions_not_const_index = free_regions_not_const_index.indexOf( neighbours[rand] );
          free_regions_not_const_index.splice( index_free_regions_not_const_index, 1 );
        }
        //end of cluster formation due to lack of options
        else{
          //erasing data from the parquet with the only element of the cluster
          if( cluster_regions_not_const_indexs.length == 1 ){
            single_regions_not_const_index.push( cluster_regions_not_const_indexs[0] )
          }

          cluster_size = cluster_regions_not_const_indexs.length;
        }
        counter++;
      }

      //adding a cluster of more than one parquet
      if( cluster_regions_not_const_indexs.length > 1 ){
        clusters.push( cluster_regions_not_const_indexs )
        this.var.index.cluster++;
      }
    }

    let single_regions_not_const_cluster_indexs = [];
    let single_regions_not_const_cluster_sizes = [];

    //distribution of remaining singles
    for( let single of single_regions_not_const_index ){
      let cluster_indexs = [];
      let cluster_sizes = [];
      let neighbours = [];
      let shifted_index = single - this.array.region_index_shift[this.var.index.region_level];

      let region_neighbours = regions[shifted_index].array.neighbour;

      for( let region_neighbour of region_neighbours ){
        let cluster_index = null;

        for( let i = 0; i < clusters.length; i++ )
          if( clusters[i].includes( region_neighbour ) )
            cluster_index = i;

        let index = cluster_indexs.indexOf( cluster_index );

        if( index ==  -1 ){
          cluster_indexs.push( cluster_index );
          cluster_sizes.push( clusters[cluster_index].length );
        }
      }

      for( let i = 0; i < clusters.length; i++ ){
        let index = clusters[i].indexOf( single )

        if( index != -1 ){
          cluster_indexs.push( i );
          cluster_sizes.push( clusters[i].length );
        }
      }

      single_regions_not_const_cluster_indexs.push( cluster_indexs );
      single_regions_not_const_cluster_sizes.push( cluster_sizes );
    }

    let options = [];
    for( let i = 0; i < this.const.cluster_size_max; i++ )
      options.push( {} );

    for( let i = 0; i < single_regions_not_const_cluster_sizes.length; i++ )
      for( let j = 0; j < single_regions_not_const_cluster_sizes[i].length; j++ ){
        let keys = Object.keys( options[single_regions_not_const_cluster_sizes[i][j]] );
        let index = keys.indexOf( single_regions_not_const_cluster_indexs[i][j].toString() );

        if( index == -1 )
          options[single_regions_not_const_cluster_sizes[i][j]][single_regions_not_const_cluster_indexs[i][j]] = [ single_regions_not_const_index[i] ];
        else
          options[single_regions_not_const_cluster_sizes[i][j]][single_regions_not_const_cluster_indexs[i][j]].push( single_regions_not_const_index[i] );
      }

    //joining singles to the smallest clusters
    for( let i = 0; i < options.length; i++ )
      for( let cluster_index in options[i] )
        for( let j = 0; j < options[i][cluster_index].length; j++ ){
          let index = single_regions_not_const_index.indexOf( options[i][cluster_index][j] );

          if( index != -1 ){
            clusters[cluster_index].push( options[i][cluster_index][j] );
            single_regions_not_const_index.splice( index, 1 )
          }
        }

    let is_null = false;

    while( !is_null )
      is_null = 0 == this.merging_small_clusters();

    this.var.index.region_level++;
    this.array.region.push( [] );
    regions = this.array.region[this.var.index.region_level];

    for( let cluster of clusters ){
      regions.push( new region( this.var.index.region, this.var.index.region_level, this, cluster ) )
      this.var.index.region++;
    }

    this.array.region_index_shift.push( this.var.index.region );

    for( let region of regions )
      region.set_neighbours();
  }

  merging_small_clusters(){
    let min_neighbours = this.const.cluster_size_max;
    let max_neighbours = 0;
    let small_clusters = [];
    let neighbour_clusters = [];
    let clusters = this.array.cluster;
    let regions = this.array.region[this.var.index.region_level];

    //
    for( let i = 0; i < clusters.length; i++ )
      if( clusters[i].length == this.const.cluster_size_min - 1 )
        small_clusters.push( i );

    for( let small_cluster of small_clusters ){
      let neighbours = [];
      let sub_region_indexs = clusters[small_cluster];

      for( let sub_region_index of sub_region_indexs ){
        let shifted_index = sub_region_index - this.array.region_index_shift[this.var.index.region_level];

        for( let neighbour_region of regions[shifted_index].array.neighbour ){
          let neighbour_cluster = null;

          for( let i = 0; i < clusters.length; i++ )
            if( clusters[i].includes( neighbour_region ) )
              neighbour_cluster = i;

          let index = neighbours.indexOf( neighbour_cluster );

          if( index == -1 &&
              neighbour_cluster != small_cluster &&
              clusters[small_cluster].length + clusters[neighbour_cluster].length < this.const.cluster_size_max )
            neighbours.push( neighbour_cluster );
        }
      }


      neighbour_clusters.push( neighbours );
    }

    for( let neighbour_cluster of neighbour_clusters ){
      if( neighbour_cluster.length < min_neighbours && neighbour_cluster.length != 0 )
        min_neighbours = neighbour_cluster.length;

      if( neighbour_cluster.length > max_neighbours )
        max_neighbours = neighbour_cluster.length;
    }

    if( max_neighbours == 0 )
      return max_neighbours;

    let rand_index = -1;

    if( min_neighbours == 1 )
      rand_index = 0;

    //merging clusters
    for( let i = 0; i < small_clusters.length; i++ )
      if( neighbour_clusters[i].length > 0 ){

        if( rand_index == -1 )
          rand_index = Math.floor( Math.random() * neighbour_clusters[i].length );

        this.merge_two_clusters( [
          small_clusters[i],
          neighbour_clusters[i][rand_index]
        ] );

        let small_cluster_index = small_clusters.indexOf( neighbour_clusters[i][rand_index] );

        if( small_cluster_index != -1 ){
          let neighbour_cluster_index = neighbour_clusters[small_cluster_index].indexOf( small_clusters[i] );

          if( neighbour_cluster_index != -1 )
             neighbour_clusters[small_cluster_index].splice( neighbour_cluster_index, 1 );
        }

        for( let j = i + 1; j < small_clusters.length; j++ ){
          let neighbour_cluster_index = neighbour_clusters[j].indexOf( neighbour_clusters[i][rand_index] );

          if( neighbour_cluster_index != -1 )
             neighbour_clusters[j].splice( neighbour_cluster_index, 1 );
        }
      }

    //erase empty clusters
    for( let i = 0; i < clusters.length; i++ )
      if( clusters[i].length == 0 )
        clusters.splice( i, 1 );

    //bug
    let bug_flag = true;

    while( bug_flag ){
      bug_flag = false;

      for( let i = 0; i < clusters.length; i++ )
        if( clusters[i].length == 0 )
          bug_flag = true;

      if( bug_flag )
        for( let i = 0; i < clusters.length; i++ )
          if( clusters[i].length == 0 )
            clusters.splice( i, 1 );
    }

    /*let arr = [];
    for( let i = 0; i < clusters.length; i++ )
      arr.push( [] )

    for( let i = 0; i < this.array.parquet.length; i++ )
      arr[this.array.parquet[i].array.cluster].push( i );
    console.log( arr )*/

    return min_neighbours;
  }

  merge_two_clusters( clusters ){
    //
    let min_cluster_index = Math.min( clusters[0], clusters[1] );
    let max_cluster_index = Math.max( clusters[0], clusters[1] );

    for( let i = 0; i < this.array.cluster[max_cluster_index].length; i++ ){
      let parquet = this.array.cluster[max_cluster_index][i];
      this.array.cluster[min_cluster_index].push( parquet );
    }

    this.array.cluster[max_cluster_index] = [];
  }

  distance_between_dot_and_line_by_two_points( dot, points ){
    let x0 = dot.x;
    let y0 = dot.y;
    let x1 = points[0].x;
    let y1 = points[0].y;
    let x2 = points[1].x;
    let y2 = points[1].y;
    return Math.abs( ( y2 - y1 ) * x0 - ( x2 - x1 ) * y0 + x2 * y1 - y2 * x1 ) / Math.sqrt( Math.pow( ( y2 - y1 ), 2 ) + Math.pow( ( x2 - x1 ), 2 ) );
  }

  triangle_vertex_area( points ){
    let x0 = points[0].x;
    let y0 = points[0].y;
    let x1 = points[1].x;
    let y1 = points[1].y;
    let x2 = points[2].x;
    let y2 = points[2].y;

    //Heron's formula
    //let p = Math.sqrt( Math.pow( ( x0 - x1 ), 2 ) + Math.pow( ( x0 - x1 ), 2 ), Math.pow( ( x0 - x1 ), 2 ) );
    return Math.abs( ( x1 - x0 ) * ( y2 - y0 ) - ( x2 - x0 ) * ( y1 - y0 ) ) / 2;
  }

  coverage_percentage( total_area, circle_radius, circle_count ){
    let circles_area = Math.PI * Math.pow( circle_radius, 2 ) * circle_count;
    return Math.round( circles_area / total_area * 100 ) / 100;
  }

  check_dot_in_triangle( dot, points ){
    //
    let flag = false;
    let b_x = points[1].x - points[0].x;
    let c_x = points[2].x - points[0].x;
    let dot_x = dot.x - points[0].x;
    let b_y = points[1].y - points[0].y;
    let c_y = points[2].y - points[0].y;
    let dot_y = dot.y - points[0].y;

    let m = ( dot_x * b_y - b_x * dot_y ) / ( c_x * b_y - b_x * c_y );

    if( m >= 0 && m <= 1 ){
      let l = ( dot_x - m * c_x ) / b_x;
      if( l > 0 && ( m + l ) < 1 )
        flag = true;
    }

    return flag;
  }

  check_joint_gate( parquets ){
    let gate_index = -1;

    for( let i = 0; i < parquets[0].array.gate.length; i++ )
      if( gate_index == -1 ){
        let index = parquets[1].array.gate.indexOf( parquets[0].array.gate[i] )

        if( index != -1 )
          gate_index = parquets[1].array.gate[index];
      }

    return gate_index;
  }

  set_parquet( start_angle, first, mirror_x, mirror_y_x, vertex_index ){
    //
    const a = this.const.a * CONST_A;
    const b = this.const.b * CONST_A;
    const edges = [ b, a, a, a, a, a, a ];
    const angles = [ 45, 120, 0, 30, 90, 75 ];
    const angles_orign = [ 135, 60, 0, 150, 90, 105 ];
    for( let i = 0; i < angles.length; i++ )
      angles[i] = angles[i] * Math.PI / 180 - Math.PI / 2;

    let angle = start_angle;
    if( mirror_y_x < 0 )
      angle = start_angle + Math.PI;

    let vector = new THREE.Vector3( WORKSPACE.x * 1.4, WORKSPACE.y * 2 );
    if( this.array.vertex.length != 0 )
      vector = this.array.vertex[vertex_index].clone();

    let dots = [];
    dots.push( vector.clone() );

    let start = 0;
    let count = 5;
    let end = first + start + ( count + 1 ) * 1;
    let i = first + start;

    while( i != end ){
      let ii = ( i + angles.length ) % angles.length;
      let add_vector = new THREE.Vector3( 1, 0, 0 );
      let axis = new THREE.Vector3( 0, 0, 1 );
      add_vector.applyAxisAngle( axis, angle );
      add_vector.normalize();
      add_vector.multiplyScalar( edges[ii] );
      angle += angles[ii] * mirror_x + Math.PI / 2 * mirror_x;
      vector.add( add_vector );
      dots.push( vector.clone() );
      i += 1;
    }

    let vertex_indexs = [];

    for( let i = 0; i < dots.length; i++ ){
      let min_d = a / 2;
      let vertex_index = null;

      for( let j = 0; j < this.array.vertex.length; j++ ){
        let d = dots[i].distanceTo( this.array.vertex[j] );

        if( d < min_d ){
          vertex_index = j;
          break;
        }
      }

      if( vertex_index == null ){
        this.array.vertex.push( dots[i] );
        vertex_indexs.push( this.array.vertex.length - 1 );
      }
      else
        vertex_indexs.push( vertex_index );
    }

    this.array.parquet.push( new parquet( this.var.index.parquet, vertex_indexs, this ) );
    this.var.index.parquet++;

    /*let material_line = new THREE.LineBasicMaterial({
      color: 0xffffff
    });
    this.data.geometry.borders_line = new THREE.BufferGeometry().setFromPoints( dots );
    this.data.borders_line = new THREE.Line( this.data.geometry.borders_line, material_line );
		this.data.scene.add( this.data.borders_line );*/
  }

  set_row(){
    this.array.row_first_vertex.push( this.array.vertex.length );
    let global_angle = 150;
    let old_row_sizes = 0;

    if( this.var.current.parquet_cluster.y > 0 )
       old_row_sizes = this.array.row_size[this.var.current.parquet_cluster.y - 1];

    let other_shifts = [
      [ 1, 2, 7, 2, 2, 4, 2 ],
      [ 1, 1, 4, 2, 2, 4, 1 ]
    ];
    let i = this.var.current.parquet_cluster.y;

    if( i > 1 )
      i = 1;

    let first;

    for( let j = 0; j < this.const.cols; j++ ){
      if( i == 0 )
        first = 2;

      if( j > 0 && this.var.current.parquet_cluster.y == 0 )
        first = 3;

      if( j == 0 && this.var.current.parquet_cluster.y > 0 )
          first = old_row_sizes - 2;
      if( j == 0 && this.var.current.parquet_cluster.y > 1 )
          first = old_row_sizes - 1;

      let vertex_index = this.array.vertex.length - first;

      if( j > 0 && this.var.current.parquet_cluster.y > 0 ){
        let minus = 0;
        if( j > 0 )
          minus += 44;
        if( j > 1 )
          minus += 42 * ( j - 1 ) ;

        vertex_index = this.array.row_first_vertex[this.var.current.parquet_cluster.y - 1] + minus;
      }

      if( j > 0 && this.var.current.parquet_cluster.y > 1 )
        vertex_index += -19 * j + ( j - 1);
      let start_angle = global_angle + 120;
      this.set_parquet( start_angle / 180 * Math.PI, 0, -1, 1, vertex_index );

      vertex_index = this.array.vertex.length - other_shifts[i][0];
      start_angle = global_angle + 195;
      this.set_parquet( start_angle / 180 * Math.PI, 1, 1, 1, vertex_index );
      start_angle += -90;
      this.set_parquet( start_angle / 180 * Math.PI, 1, -1, 1, vertex_index );

      vertex_index = this.array.vertex.length - other_shifts[i][1];
      start_angle = global_angle + 60;
      this.set_parquet( start_angle / 180 * Math.PI, 0, -1, 1, vertex_index );
      start_angle += 180;
      this.set_parquet( start_angle / 180 * Math.PI, 0, 1, -1, vertex_index );

      vertex_index = this.array.vertex.length - other_shifts[i][2];
      start_angle = global_angle + 195;
      this.set_parquet( start_angle / 180 * Math.PI, 5, 1, -1, vertex_index );

      vertex_index = this.array.vertex.length - other_shifts[i][3];
      start_angle = global_angle + 135;
      this.set_parquet( start_angle / 180 * Math.PI, 1, 1, -1, vertex_index );

      vertex_index = this.array.vertex.length - other_shifts[i][4];
      start_angle = global_angle + 105;
      this.set_parquet( start_angle / 180 * Math.PI, 1, 1, -1, vertex_index );
      start_angle += 90;
      this.set_parquet( start_angle / 180 * Math.PI, 1, -1, 1, vertex_index );

      vertex_index = this.array.vertex.length - other_shifts[i][5];
      start_angle = global_angle + 135;
      this.set_parquet( start_angle / 180 * Math.PI, 4, -1, 1, vertex_index );

      vertex_index = this.array.vertex.length - other_shifts[i][6];
      start_angle = global_angle + 15;
      this.set_parquet( start_angle / 180 * Math.PI, 1, 1, 1, vertex_index );
      this.set_parquet( start_angle / 180 * Math.PI, 5, -1, 1, vertex_index );
    }
    if( false ){  }
    this.array.row_size.push( this.array.vertex.length - this.array.row_first_vertex[this.var.current.parquet_cluster.y] );
    this.var.current.parquet_cluster.y++;
  }

  paint_regions(){
    let regions = this.array.region[this.var.current.paint_level];

    for( let region of regions ){
      let hue_index = ( region.const.index - this.array.region_index_shift[this.var.current.paint_level] + regions.length ) % regions.length;
      region.paint( hue_index, this.var.current.paint_level )
    }
  }

  shift_paint_level( shift ){
    this.var.current.paint_level = ( shift + this.var.current.paint_level + this.array.region.length ) % this.array.region.length;
    console.log( this.var.current.paint_level )
    this.paint_regions();
  }

  render() {
    //
    this.data.raycaster.setFromCamera( this.data.pointer, this.data.camera );

    this.data.geometry.map.attributes.color.needsUpdate = true;
    //console.log( this.data.map )

    const intersects = this.data.raycaster.intersectObject( this.data.map );

		if ( intersects.length > 0 ) {
			const intersect = intersects[ 0 ];
			//console.log( Math.floor( intersect.faceIndex / 4 ) )
		}

    if( Math.round( this.data.clock.getElapsedTime().toFixed(2) * 100 ) % 100 == 0 ){
    }

    this.data.renderer.render( this.data.scene, this.data.camera );
  }
}
