

export default (Module) => {
  const {
    initialize, partOf, nameBy, meta, method
  } = Module.NS;

  @initialize
  @partOf(Module)
  class SecondMigration extends Module.NS.TestMigration {
    @nameBy static __filename = 'SecondMigration';
    @meta static object = {};
    @method static change() {}
  }
}
