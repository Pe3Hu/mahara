class task {
  constructor( index ){
    this.const = {
      index: index
    };
    this.flag = {
    };
    this.var = {
    };
    this.array = {
    };
    this.data = {
    };

    this.set_description();
  }

  set_description(){
    switch ( this.const.index ) {
      case 0:
        this.data.name = 'earn initial capital';
        break;
      case 1:
        this.data.name = 'improve qualification';
        break;
      case 2:
        this.data.name = 'explore the map';
        break;
      case 3:
        this.data.name = '';
        break;
      case 4:
        this.data.name = '';
        break;
      case 5:
        this.data.name = '';
        break;
    }
  }

  start_execution( details ){
    switch ( this.data.name ) {
      case 'earn initial capital':
        break;
      case 'improve qualification':
        break;
      case 'explore the map':
        break;
    }

    switch ( details['performance criterion'] ) {
      case 'get X raw materials':
        break;
      case 'raise qualifications by X stages':
        break;
      case 'find X not wasteland parquets':
        break;
    }
  }
}
