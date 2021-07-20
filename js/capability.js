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
      name: null
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
        this.data.name = 'passage through the gate';
        break;
    }
  }

  used_by( who, where ){
    switch ( this.data.name ) {
      case 'preview':
        let str = this.find_shatter( who, where, false );
        who.data.knowledge['somewhere'][where.const.index] = [ str ];
        break;
      case 'primary inspection':
        let primary_repetitions = 4;
        for( let i = 0; i < primary_repetitions; i++ ){
          let str = this.find_shatter( who, where, false );
          who.data.knowledge['somewhere'][where.const.index].push( str );
        }
        break;
    }

    console.log( who.data.knowledge['somewhere'] )
  }

  find_shatter( who, where, guaranteed_new ){
    let shatters = [];
    let subject = where.data.subject;
    let keys = Object.keys( who.data.knowledge['somewhere'] );

    if( guaranteed_new && keys.includes( where.const.index ) ){
      for( let shatter of subject.array.shatter )
        if( who.data.knowledge['somewhere'][where.const.index].includes( shatter ) )
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
}
