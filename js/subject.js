class subject{
  constructor( parent ){
    this.const = {
      base: 2,
      degree: 10
    };
    this.flag = {
    };
    this.var = {
    };
    this.array = {
      shatter: [],
      duplicate: []
    };
    this.data = {
      parent: parent
    };

    this.init();
  }

  init(){
    this.init_shatters();
  }

  init_shatters(){
    let count = Math.pow( this.const.base, this.const.degree );
    let half = Math.pow( this.const.base, this.const.degree / 2 );

    for( let i = 0; i < count; i++ ){
      let values = [];
      values.push( Math.floor( i / half ) );
      values.push( i % half );

      let str = String( this.data.parent.const.index ) + '-';

      for( let value of values ){
        if( value < 26 )
          str += String.fromCharCode( value + 65 );
        else
          str += String( value - 26 );
      }

      this.array.shatter.push( str );
      this.array.duplicate.push( 0 );
    }
  }
}
