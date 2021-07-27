class capability{
  constructor( index ){
    this.const = {
      index: index
    };
    this.flag = {
    };
    this.var = {
    };
    this.array = {
      condition: []
    };
    this.data = {
      name: null,
      takes_time: 100
    };

    this.set_description();
  }

  set_description(){
    switch ( this.const.index ) {
      case 0:
        this.data.name = 'preview';
        break;
      case 1:
        this.data.name = 'primary inspection';
        break;
      case 2:
        this.data.name = 'common inspection';
        break;
      case 3:
        this.data.name = 'passage through the gate';
        break;
      case 4:
        this.data.name = 'primary mining';
        break;
      case 5:
        this.data.name = 'common mining';
        break;
    }
  }

  used_by( who, where ){
    let str;
    //console.log( who, where )

    switch ( this.data.name ) {
      case 'preview':
        str = this.find_shatter( who, where );
        who.data.shatters['somewhere'][where.const.index.toString()] = [ str ];
        who.add_successes( 'mapping' );
        break;
      case 'primary inspection':
      case 'common inspection':
        let roll = this.roll( who, 'mapping' );

        if( roll ){
          let guaranteed_new = false;

          if( this.data.name == 'primary inspection' )
            guaranteed_new = true;

          str = this.find_shatter( who, where, guaranteed_new );
          let index = who.data.shatters['somewhere'][where.const.index.toString()].indexOf( str );

          if( index == -1 )
            who.data.shatters['somewhere'][where.const.index.toString()].push( str );
          else
            who.data.duplicates['somewhere'].push( str );

          who.add_successes( 'mapping' );
          break;
        }
      case 'passage through the gate':
        break;
      case 'primary mining':
      case 'common mining':
        break;
    }

    console.log( this.data.name )
  }

  find_shatter( who, where, guaranteed_new ){
    let shatters = [];
    let subject = where.data.subject;
    let keys = Object.keys( who.data.shatters['somewhere'] );

    if( guaranteed_new && keys.includes( where.const.index ) ){
      for( let shatter of subject.array.shatter )
        if( who.data.shatters['somewhere'][where.const.index].includes( shatter ) )
          shatters.push( shatter );
    }
    else
      shatters = subject.array.shatter;

    let rand = Math.floor( Math.random() * shatters.length );
    let index = subject.array.shatter.indexOf( shatters[rand] );
    let str = subject.array.shatter[index] + '-' + String( subject.array.duplicate[index] );
    subject.array.duplicate[rand]++;
    return str;
  }

  roll( who, qualification ){
    let stage = who.data.qualification[qualification].stage;
    let sub_stage = who.data.qualification[qualification].sub_stage;
    let percentage = who.data.board.table.covering[stage][sub_stage];

    let rand = Math.random();
    return rand < percentage;
  }
}
