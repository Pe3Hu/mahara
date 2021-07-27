class forgotten{
  constructor( index, awakening, board ){
    this.const = {
      index: index,
      qualification_base: 6
    };
    this.flag = {
      wait: false
    };
    this.var = {
      current: {
        parquet: awakening,
        capability: null
      }
    };
    this.array = {
      capability: [ 0, 1, 2 ],
      to_do_list: [],
      gate: []
    };
    this.data = {
      board: board,
      shatters: {
        'somewhere': {},
        'something': {}
      },
      duplicates: {
        'somewhere': [],
        'something': []
      },
      prioritys: {
        'mapping': {
          value: 10,
          subs: {
            'old': 0,
            'new': 10
          },
        },
        'mining': {
          value: 0,
          subs: {
          },
        }
      },
      qualification: {
        'mapping': {
          stage: 0,
          sub_stage: 0,
          successes: 0,
          next_stage: this.const.qualification_base
        },
        'mining': {
          stage: 0,
          sub_stage: 0,
          successes: 0,
          next_stage: this.const.qualification_base
        }
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

  fill_to_do_list(){
    //
    let keys = Object.keys( this.data.shatters['somewhere'] );
    let index = keys.indexOf( this.var.current.parquet.toString() );

    if( index == -1 ){
      this.add_to_list( 0 );
      this.add_to_list( 1 );
      this.add_to_list( 1 );
      this.add_to_list( 1 );
      this.add_to_list( 1 );
    }
    else{
      this.follow_priorities();
      this.add_to_list( -1 );
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

  start_capability(){
    if( !this.flag.wait ){
      if( this.array.to_do_list.length == 0 )
        this.fill_to_do_list();

      if( this.var.current.capability == null ){
        let first = this.array.to_do_list.splice( 0, 1 )
        this.var.current.capability = first[0];

        if( this.var.current.capability == -1 ){
          this.flag.wait = true;
          return;
        }

        this.var.current.time = 0;
        this.var.capability_time = this.data.board.array.capability[this.var.current.capability].data.takes_time;
      }

      this.var.current.time += 100;

      if( this.var.current.time >= this.var.capability_time ){
        this.use_capability( this.var.current.capability );
        this.var.current.capability = null;
      }
    }
  }

  use_capability( capability ){
    let where = this.data.board.array.parquet[this.var.current.parquet];
    this.data.board.array.capability[capability].used_by( this, where );
  }

  follow_priorities(){
    let prioritys = [];
    let keys = Object.keys( this.data.prioritys )

    for( let priority of keys )
      for( let i = 0; i < this.data.prioritys[priority].value; i++ )
        prioritys.push( priority );

    let rand = Math.round( Math.random() * prioritys.length );
    let priority = prioritys[rand];

    switch ( priority ) {
      case 'mapping':
        prioritys = [];

        for( let sub_priority in this.data.prioritys[priority].subs )
          for( let i = 0; i < this.data.prioritys[priority].subs[sub_priority]; i++ )
            prioritys.push( sub_priority );

        rand = Math.round( Math.random() * prioritys.length );
        let sub_priority = prioritys[rand];

        switch ( sub_priority ) {
          case 'old':
            this.add_to_list( 2 );
            break;
          case 'new':
            this.add_to_list( 3 );
            break;
        }
        break;
      case 'mining':
        this.add_to_list( 5 );
        break;
    }
  }

  add_successes( qualification ){
    let q = this.data.qualification[qualification];
    q.successes++;

    //familiar terrain
    let l = this.data.shatters['somewhere'][this.var.current.parquet.toString()].length;
    let sqrt = Math.sqrt( l );
    if( Math.pow( Math.round( sqrt ), 2 ) == l )
      switch ( sqrt ) {
        case 1:
          this.notice_gates( 1 );
          break;
      }

    if( q.successes == q.next_stage ){
      q.stage++;
      q.sub_stage = 0;
      q.next_stage = ( q.stage + 1 ) * this.const.qualification_base;
    }
    else{
      let sub_stage_successes = q.next_stage / this.data.board.table.covering[q.stage].length;

      if( q.successes % sub_stage_successes == 0 )
        q.sub_stage = q.successes / sub_stage_successes;
    }
  }

  notice_gates( count ){
    let parquet = this.data.board.array.parquet[this.var.current.parquet];

    for( let i = 0; i < count; i++ ){
      let gates = [];

      for( let gate in parquet.data.neighbours )
        if( !this.array.gate.includes( gate ) )
          gates.push( gate );

      if( gates.length > 0 ){
        let rand = Math.floor( Math.random() * gates.length );
        this.array.gate.push( gates[rand] );
      }
    }
  }
}
