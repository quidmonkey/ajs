describe('ajs: A Lightweight, JavaScript Module System', function () {

  beforeEach(function () {
    spyOn(Mocks, 'Qux').and.callThrough();
    spyOn(console, 'log');
  });

  it('should define an a function', function () {
    expect('a' in window).toBeTruthy();
  });

  it('should define an an function', function () {
    expect('an' in window).toBeTruthy();
  });

  it('should define an deleteA function', function () {
    expect('deleteA' in window).toBeTruthy();
  });

  it('should define an deleteAn function', function () {
    expect('deleteAn' in window).toBeTruthy();
  });

  it('should define an getA function', function () {
    expect('getA' in window).toBeTruthy();
  });

  it('should define an getAn function', function () {
    expect('getAn' in window).toBeTruthy();
  });

  it('should define an registerA function', function () {
    expect('registerA' in window).toBeTruthy();
  });

  it('should define an registerAn function', function () {
    expect('registerAn' in window).toBeTruthy();
  });

  it('should define an array factory module', function () {
    expect(a('ArrayFactory', Mocks.ArrayFactory)).toEqual([]);
  });

  it('should define an boolean factory module', function () {
    expect(a('BooleanFactory', Mocks.BooleanFactory)).toEqual(true);
  });

  it('should define an empty factory module', function () {
    expect(a('EmptyFactory', Mocks.EmptyFactory)).toEqual(undefined);
  });

  it('should define an function factory module', function () {
    expect(a('FunctionFactory', Mocks.FunctionFactory)).toEqual(jasmine.any(Function));
  });

  it('should define an number factory module', function () {
    expect(a('NumberFactory', Mocks.NumberFactory)).toEqual(1);
  });

  it('should define an object factory module', function () {
    expect(a('ObjectFactory', Mocks.ObjectFactory)).toEqual({});
  });

  it('should define an string factory module', function () {
    expect(a('StringFactory', Mocks.StringFactory)).toEqual('');
  });

  it('should not place a module in the global scope', function () {
    expect('ArrayFactory' in window).toBeFalsy();
  });

  it('should retrieve a module', function () {
    expect(getAn('ArrayFactory')).toEqual([]);
  });

  it('should delete a module', function () {
    deleteAn('ArrayFactory');
    
    expect(getAn('ArrayFactory')).toEqual(undefined);
  });

  it('should register a library and remove it from the global scope', function () {
    window.$ = function jQuery () {};

    expect('$' in window).toBeTruthy();
    registerA('$', $);
    expect('$' in window).toBeFalsy();
    expect(getA('$')).toEqual(jasmine.any(Function));
  });

  it('should create a module with properties', function () {
    var foo = a('Foo', Mocks.Foo);

    expect(foo).toEqual(jasmine.any(Object));
    expect(foo.x).toEqual(1);
    expect(foo.y).toEqual(2);
  });

  it('should inject a dependency', function () {
    var bar = a('Bar', ['Foo'], Mocks.Bar);
    var foo = getA('Foo');

    expect(bar).toEqual(jasmine.any(Object));
    expect(bar.x).toEqual(foo.x + 5);
  });

  it('should inject multiple dependencies', function () {
    var baz = a('Baz', ['Foo', 'Bar'], Mocks.Baz);

    expect(baz).toEqual(jasmine.any(Function));
    expect(baz('Joe')).toEqual('Hello Joe. My name is 112');
  });

  it('should print a list of unloaded modules', function () {
    var mockDebug = { closure: Mocks.Qux, dependenciesList: ['SomeModule'], name: 'Qux' };
    var qux = a('Qux', ['SomeModule'], Mocks.Qux);

    expect(Mocks.Qux).not.toHaveBeenCalled();

    expect(debugUnloaded()).toEqual([mockDebug]);
    expect(console.log).toHaveBeenCalledWith('~~~~ ajs: Debug Mode - Unloaded Modules');
    expect(console.log).toHaveBeenCalledWith('1) Namespace: Qux with Dependencies: SomeModule');
  });

  it('should load a module when its dependency is loaded', function () {
    a('ModuleTwo', ['ModuleOne'], Mocks.ModuleTwo);
    a('ModuleOne', Mocks.ModuleOne);

    expect(getA('ModuleOne')).toEqual({});
    expect(getA('ModuleTwo')).toEqual({});
  });

  it('should throw an error on a duplicate module definition', function () {
    var errFunction = function () {
      a('Foo', function () {});
    };

    expect(errFunction).toThrow(new Error('~~~~ ajs: Attempting to register duplicate module name: Foo'));
  });

  it('should throw an error on circular dependencies', function () {
    var errFunction = function () {
      a('CircularTwo', ['CircularOne'], Mocks.CircularTwo);
    };

    a('CircularOne', ['CircularTwo'], Mocks.CircularOne);

    expect(errFunction).toThrow(new Error('~~~~ ajs: Unable to load CircularTwo. It shares a circular dependency with CircularOne'));
  });
});
