

export default (Module) => {
  const {
    initialize, partOf, nameBy, meta, method
  } = Module.NS;

  @initialize
  @partOf(Module)
  class FirstMigration extends Module.NS.TestMigration {
    @nameBy static __filename = 'FirstMigration';
    @meta static object = {};
    @method static change() {}
  }
}
