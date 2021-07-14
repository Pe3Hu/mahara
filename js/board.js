class board{
  constructor (){
    this.const = {
      workspace_size: 500,
      a: 35,
      cols: 2,
      rows: 3
    };
    this.var = {
      index: {
        vertex: 0,
        parquet: 0
      },
      current: {
        parquet_cluster: {
          x: 0,
          y: 0
        }
      }
    }
    this.array = {
      vertex: [],
      parquet: [],
      row_size: [],
      row_first_vertex: []
    };
    this.data = {
      renderer: null,
      scene: null,
      camera: null,
      stats: null,
      uniforms: null,
      geometry: {
        border_line: null
      },
      hues: {
      }
    };

    this.const.b =  Math.sqrt( 2 + Math.sqrt( 3 ) ) * this.const.a;

    this.init();
  }

  init() {
    WORKSPACE = new THREE.Vector3(
      this.const.workspace_size,
      this.const.workspace_size,
      this.const.workspace_size
    );
    MAX_DIST = Math.sqrt( Math.pow( this.const.workspace_size * 2, 2 ) + Math.pow( this.const.workspace_size * 2, 2 ) );

    this.data.camera = new THREE.PerspectiveCamera( this.const.workspace_size, window.innerWidth / window.innerHeight, 1, 10000 );
    this.data.camera.position.x = 0;
    this.data.camera.position.y = 0;
    this.data.camera.position.z = -this.const.workspace_size * 0.4;
    this.data.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    this.data.scene = new THREE.Scene();

    let material = new THREE.LineBasicMaterial({
      color: 0xffffff
    });

    let points = [];
    let r = this.const.workspace_size;
    points.push( new THREE.Vector3( -r, -r, 0 ) );
    points.push( new THREE.Vector3( -r, r, 0 ) );
    points.push( new THREE.Vector3( r, r, 0 ) );
    points.push( new THREE.Vector3( r, -r, 0 ) );
    points.push( new THREE.Vector3( -r, -r, 0 ) );

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

    this.init_geometrys();
    this.init_ciclres();
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
      parquet.set_hue();

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

        color.setHSL( parquet.data.hue, 1, 0.5 );

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

    let geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		geometry.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
		geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    let material = new THREE.MeshPhongMaterial( {
  					color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
  					side: THREE.DoubleSide, vertexColors: true
  				} );

		this.data.mesh = new THREE.Mesh( geometry, material );
		this.data.scene.add( this.data.mesh )

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

  set_parquet( start_angle, first, mirror_x, mirror_y_x, vertex_index ){
    //
    const a = this.const.a;
    const b = this.const.b;
    const edges = [ b, a, a, a, a, a, a ];
    const angles = [ 45, 120, 0, 30, 90, 75 ];
    const angles_orign = [ 135, 60, 0, 150, 90, 105 ];
    for( let i = 0; i < angles.length; i++ )
      angles[i] = angles[i] * Math.PI / 180 - Math.PI / 2;

    let angle = start_angle;
    if( mirror_y_x < 0 )
      angle = start_angle + Math.PI;

    let vector = new THREE.Vector3( this.const.workspace_size - a, this.const.workspace_size - b - a );
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

  render() {
    //
    this.data.raycaster.setFromCamera( this.data.pointer, this.data.camera );

    const intersects = this.data.raycaster.intersectObject( this.data.mesh );

		if ( intersects.length > 0 ) {
			const intersect = intersects[ 0 ];
			//console.log( Math.floor( intersect.faceIndex / 4 ) )
		}

    if( Math.round( this.data.clock.getElapsedTime().toFixed(2) * 100 ) % 100 == 0 ){
    }

    this.data.renderer.render( this.data.scene, this.data.camera );
  }
}
