var Mocks = {
    ArrayFactory: function () { return []; },
    BooleanFactory: function () { return true; },
    EmptyFactory: function () {},
    FunctionFactory: function () { return function () {}; },
    NumberFactory: function () { return 1; },
    ObjectFactory: function () { return {}; },
    StringFactory: function () { return ''; },

    ModuleOne: function () { return {}; },
    ModuleTwo: function (ModuleOne) { return {}; },

    CircularOne: function (CircularTwo) {},
    CircularTwo: function (CircularOne) {},

    Foo: function () {
        var foo = this;
        
        foo.x = 1;
        foo.y = 2;

        return foo;
    },

    Bar: function (Foo) {
        return {
            x: Foo.x + 5
        };
    },

    Baz: function (Foo, Bar) {
        return function (name) {
            var str = 'Hello ' + name + '. My name is ' + Foo.x + Foo.y * Bar.x;
            return str;
        };
    }, 

    Qux: function (SomeModule) {
        return SomeModule.someProperty === true;
    }
};
