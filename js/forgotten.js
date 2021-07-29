class forgotten{
  constructor( index, awakening, board ){
    this.const = {
      index: index,
      qualification_base: 6
    };
    this.flag = {
      wait: false,
      newborn: true
    };
    this.var = {
      current: {
        parquet: awakening,
        capability: null,
        task: null,
        details: {}
      }
    };
    this.array = {
      capability: [ 0, 1, 2 ],
      sub_task: [],
      details: [],
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
          scale: 1,
          subs: {
            'old': 0,
            'new': 10
          },
        },
        'mining': {
          value: 10,
          scale: 0,
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
      },
      predisposition: {}
    };

    this.init();
  }

  init(){
    this.init_ciclre();
    this.init_predispositions();
  }

  init_ciclre(){
    let r = CONST_A / 2;
    this.data.geometry = new THREE.CircleGeometry( r, 10 );
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } );
    this.data.circle = new THREE.Mesh( this.data.geometry, material );
    let center = this.data.board.array.parquet[this.var.current.parquet].const.center;

    this.data.circle.position.x = center.x;
    this.data.circle.position.y = center.y;
    this.data.circle.position.z = center.z;

    this.data.board.data.scene.add( this.data.circle );
  }

  init_predispositions(){
    let predisposition_names = [ 'scout', 'collector', 'dealer', 'mercenary' ];
    let duplicates = [ 20, 0, 0, 0 ];// [ 20, 20, 12, 8 ];
    let min_predisposition = 0;
    let max_predisposition = 8;
    let total_predisposition = 16;
    let current_predisposition = 0;
    let predispositions = [];

    for( let i = 0; i < predisposition_names.length; i++ ){
      predispositions.push( min_predisposition );
      current_predisposition += min_predisposition;
    }

    while( current_predisposition < total_predisposition ){
      let lots = [];

      for( let i = 0; i < predispositions.length; i++ )
        if( predispositions[i] <= max_predisposition )
          for( let j = 0; j < duplicates[i] - predispositions[i]; j++ )
            lots.push( i );

      let rand = Math.floor( Math.random() * lots.length );
      predispositions[lots[rand]]++;
      current_predisposition++;
    }

    for( let i = 0; i < predisposition_names.length; i++ )
      this.data.predisposition[predisposition_names[i]] = {
        weight: predispositions[i],
        scale: 1,
        tasks: []
      }

    for( let name in this.data.predisposition )
      switch ( name ) {
        case 'dealer':
        case 'mercenary':
          this.data.predisposition[name].tasks.push( {
            index: 0,
            weight: 1,
            scale: 1,
            details: {
              'performance criterion': 'get X raw materials',
              'raw': 'any',
              'X': 8
            }
          } );
          break;
        case 'collector':
          this.data.predisposition[name].tasks.push( {
            index: 1,
            weight: 1,
            scale: 1,
            details: { 'performance criterion': 'get X grade of qualification',
              'qualification': 'mining',
              'X': 1
            }
          } );
          break;
        case 'scout':
          this.data.predisposition[name].tasks.push( {
            index: 2,
            weight: 1,
            scale: 1,
            details: {
              'performance criterion': 'find X not wasteland parquets',
              'X': 4
            }
          } );
          break;
      }
  }

  fill_to_do_list(){
    //
    let keys = Object.keys( this.data.shatters['somewhere'] );
    let index = keys.indexOf( this.var.current.parquet.toString() );

    if( index == -1 ){
      this.add_to_list( 1 );

      if( this.flag.newborn ){
        this.add_to_list( 2 );
        this.add_to_list( 2 );
        this.add_to_list( 2 );
        this.add_to_list( 2 );
        this.add_to_list( 0 );
      }
      else {
        this.array.sub_task( 1, {} )
      }
    }
    else{
      //this.follow_priorities();
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

  add_sub_task( sub_task, details ){
    this.array.sub_task.push( sub_task );
    this.array.details.push( details );
  }

  add_task( task, details ){
    this.var.current.task = task;
    this.var.current.details = details;
    this.data.board.array.task[task].start_execution( this, details );
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
      for( let i = 0; i < this.data.prioritys[priority].value * this.data.prioritys[priority].scale; i++ )
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
            this.add_to_list( 4 );
            break;
          case 'new':
            this.add_to_list( 4 );
            break;
        }
        break;
      case 'mining':
        this.add_to_list( 6 );
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

  check_qualification(){

  }
}
